"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  trainingAssignSchema,
  trainingCreateSchema,
  type TrainingAssignInput,
  type TrainingCreateInput,
} from "@/lib/schemas/training.schema";
import { TrainingWizardStepBasics } from "@/components/features/trainings/TrainingWizardStepBasics";
import { TrainingWizardStepNotes } from "@/components/features/trainings/TrainingWizardStepNotes";
import { TrainingWizardStep3 } from "@/components/features/trainings/TrainingWizardStep3";

const stepLabels = ["Temel Bilgiler", "Notlar", "Eğitmen Atama (3. adım)"];

type TrainerOption = {
  _id: string;
  firstName: string;
  lastName: string;
};

type ConflictItem = {
  trainingId: string;
  subject: string;
  date: string;
  conflictingTrainerIds: string[];
};

type RecommendedTrainerItem = {
  _id: string;
  firstName: string;
  lastName: string;
  matchedSkills: string[];
  averageScore: number | null;
};

export function TrainingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [assigning, setAssigning] = useState(false);
  const [createdTrainingId, setCreatedTrainingId] = useState<string | null>(null);
  const [trainerOptions, setTrainerOptions] = useState<TrainerOption[]>([]);
  const [selectedPrimaryTrainerId, setSelectedPrimaryTrainerId] = useState("");
  const [selectedCoTrainerIds, setSelectedCoTrainerIds] = useState<string[]>([]);
  const [conflicts, setConflicts] = useState<ConflictItem[]>([]);
  const [recommendedTrainers, setRecommendedTrainers] = useState<RecommendedTrainerItem[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendationDurationMs, setRecommendationDurationMs] = useState<number | null>(null);

  const {
    register,
    trigger,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrainingCreateInput>({
    resolver: zodResolver(trainingCreateSchema),
    defaultValues: {
      subject: "",
      date: "",
      durationMinutes: 60,
      location: "",
      notes: "",
    },
  });

  const goToStepTwo = async () => {
    const isValid = await trigger(["subject", "date", "durationMinutes", "location"]);
    if (!isValid) {
      return;
    }

    setStep(2);
  };

  const assignPayload = useMemo<TrainingAssignInput | null>(() => {
    if (!createdTrainingId || !selectedPrimaryTrainerId) {
      return null;
    }

    return {
      trainingId: createdTrainingId,
      primaryTrainerId: selectedPrimaryTrainerId,
      coTrainerIds: selectedCoTrainerIds,
      ignoreConflicts: false,
    };
  }, [createdTrainingId, selectedCoTrainerIds, selectedPrimaryTrainerId]);

  useEffect(() => {
    if (step !== 3) {
      return;
    }

    let cancelled = false;
    const fetchTrainers = async () => {
      const response = await fetch("/api/trainers?activeOnly=true", { cache: "no-store" });
      const result = await response.json();

      if (cancelled) {
        return;
      }

      if (!response.ok) {
        setAssignError(result?.error?.message ?? "Eğitmen listesi alinamadi");
        return;
      }

      setTrainerOptions((result?.data?.trainers ?? []) as TrainerOption[]);
    };

    void fetchTrainers();

    return () => {
      cancelled = true;
    };
  }, [step]);

  useEffect(() => {
    if (step !== 3 || !createdTrainingId) {
      return;
    }

    let cancelled = false;
    const fetchRecommendations = async () => {
      setRecommendationsLoading(true);

      const response = await fetch(`/api/trainers/recommended?trainingId=${createdTrainingId}`, {
        cache: "no-store",
      });
      const result = await response.json();

      if (cancelled) {
        return;
      }

      if (!response.ok) {
        setRecommendationsLoading(false);
        setRecommendationDurationMs(null);
        setRecommendedTrainers([]);
        return;
      }

      setRecommendedTrainers((result?.data?.recommended ?? []) as RecommendedTrainerItem[]);
      setRecommendationDurationMs((result?.data?.queryDurationMs ?? null) as number | null);
      setRecommendationsLoading(false);
    };

    void fetchRecommendations();

    return () => {
      cancelled = true;
    };
  }, [createdTrainingId, step]);

  useEffect(() => {
    if (!assignPayload) {
      return;
    }

    let cancelled = false;
    const checkConflicts = async () => {
      const response = await fetch("/api/trainings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assignPayload),
      });

      const result = await response.json();

      if (cancelled) {
        return;
      }

      if (!response.ok) {
        setAssignError(result?.error?.message ?? "Çakışma kontrolu yapilamadi");
        return;
      }

      setAssignError(null);
      setConflicts((result?.data?.conflicts ?? []) as ConflictItem[]);
    };

    void checkConflicts();

    return () => {
      cancelled = true;
    };
  }, [assignPayload]);

  const onSubmit = async () => {
    setSubmitError(null);

    const payload = getValues();
    const parsed = trainingCreateSchema.safeParse(payload);

    if (!parsed.success) {
      setSubmitError("Lütfen zorunlu alanlari kontrol edin");
      return;
    }

    const response = await fetch("/api/trainings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
    });

    const result = await response.json();
    if (!response.ok) {
      setSubmitError(result?.error?.message ?? "Eğitim kaydedilemedi");
      return;
    }

    const trainingId = result?.data?.training?._id as string | undefined;
    if (!trainingId) {
      setSubmitError("Kayit sonrası eğitim kimligi bulunamadı");
      return;
    }

    setCreatedTrainingId(trainingId);
    setStep(3);
  };

  const handleCoTrainerToggle = (trainerId: string) => {
    setConflicts([]);
    setSelectedCoTrainerIds((prev) =>
      prev.includes(trainerId) ? prev.filter((id) => id !== trainerId) : [...prev, trainerId],
    );
  };

  const handleRecommendationPick = (trainerId: string) => {
    setSelectedPrimaryTrainerId(trainerId);
    setSelectedCoTrainerIds((current) => current.filter((id) => id !== trainerId));
    setConflicts([]);
  };

  const handleAssignmentSave = async (ignoreConflicts: boolean) => {
    if (!createdTrainingId || !selectedPrimaryTrainerId) {
      setAssignError("Ana eğitmen secimi zorunludur");
      return;
    }

    const payload: TrainingAssignInput = {
      trainingId: createdTrainingId,
      primaryTrainerId: selectedPrimaryTrainerId,
      coTrainerIds: selectedCoTrainerIds,
      ignoreConflicts,
    };

    const parsed = trainingAssignSchema.safeParse(payload);
    if (!parsed.success) {
      setAssignError("Atama verisi geçersiz");
      return;
    }

    setAssigning(true);
    setAssignError(null);

    const response = await fetch("/api/trainings", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 409) {
        setConflicts((result?.data?.conflicts ?? []) as ConflictItem[]);
        setAssignError(result?.error?.message ?? "Çakışma uyarıyla bildirildi");
      } else {
        setAssignError(result?.error?.message ?? "Atama kaydedilemedi");
      }

      setAssigning(false);
      return;
    }

    router.push("/trainings");
  };

  const finishAndGoList = () => {
    router.push("/trainings");
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Yeni Eğitim Wizard</h1>
        <p className="text-sm text-muted-foreground">Adım 1-2 tamamlandığında eğitim planned durumunda kaydedilir.</p>
      </header>

      <ol className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
        {stepLabels.map((label, index) => {
          const current = index + 1;
          const isActive = current === step;
          const isDone = current < step;

          return (
            <li
              key={label}
              className={`rounded-md border px-3 py-2 ${
                isActive ? "border-primary" : isDone ? "border-green-600" : "border-border"
              }`}
            >
              {current}. {label}
            </li>
          );
        })}
      </ol>

      {step === 1 ? (
        <div className="rounded-lg border border-border bg-card p-4 space-y-4">
          <TrainingWizardStepBasics register={register} errors={errors} />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={goToStepTwo}
              className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold"
            >
              Sonraki Adım
            </button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg border border-border bg-card p-4 space-y-4">
          <TrainingWizardStepNotes register={register} errors={errors} />
          {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-md border border-border px-4 py-2 text-sm font-semibold"
            >
              Geri
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold disabled:opacity-60"
            >
              {isSubmitting ? "Kaydediliyor..." : "Planlı Eğitim Olarak Kaydet"}
            </button>
          </div>
        </form>
      ) : null}

      {step === 3 ? (
        <TrainingWizardStep3
          trainers={trainerOptions}
          selectedPrimaryTrainerId={selectedPrimaryTrainerId}
          selectedCoTrainerIds={selectedCoTrainerIds}
          conflicts={conflicts}
          recommendedTrainers={recommendedTrainers}
          recommendationsLoading={recommendationsLoading}
          recommendationDurationMs={recommendationDurationMs}
          assigning={assigning}
          assignError={assignError}
          onPrimaryChange={(trainerId) => {
            setSelectedPrimaryTrainerId(trainerId);
            setConflicts([]);
          }}
          onPickRecommendation={handleRecommendationPick}
          onCoTrainerToggle={handleCoTrainerToggle}
          onSave={handleAssignmentSave}
        />
      ) : null}

      {step === 3 ? (
        <button
          type="button"
          onClick={finishAndGoList}
          className="rounded-md border border-border px-4 py-2 text-sm font-semibold"
        >
          Atamayi Sonra Tamamla
        </button>
      ) : null}
    </section>
  );
}
