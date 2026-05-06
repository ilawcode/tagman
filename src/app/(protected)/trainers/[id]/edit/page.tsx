"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  trainerSkillUpdateSchema,
  type TrainerSkillUpdateInput,
} from "@/lib/schemas/trainer.schema";

type SkillOption = {
  _id: string;
  name: string;
  isActive: boolean;
};

type AssignedSkill = {
  skillId: string;
  name: string;
  score: number;
};

type TrainerSkillPayload = {
  skill: { _id: string; name: string } | string;
  score: number;
};

export default function TrainerEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const trainerId = params.id;

  const [availableSkills, setAvailableSkills] = useState<SkillOption[]>([]);
  const [assignedSkills, setAssignedSkills] = useState<AssignedSkill[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [score, setScore] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  const defaultValues = useMemo<TrainerSkillUpdateInput>(
    () => ({
      firstName: "",
      lastName: "",
      employmentType: "internal",
      consultingFirm: "",
      biography: "",
      isActive: true,
      skills: [],
    }),
    [],
  );

  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TrainerSkillUpdateInput>({
    resolver: zodResolver(trainerSkillUpdateSchema),
    defaultValues,
  });

  const employmentType = useWatch({
    control,
    name: "employmentType",
    defaultValue: "internal",
  });

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const [trainerRes, skillsRes] = await Promise.all([
          fetch(`/api/trainers/${trainerId}`, { cache: "no-store" }),
          fetch("/api/skills?activeOnly=true", { cache: "no-store" }),
        ]);

        const trainerJson = await trainerRes.json();
        const skillsJson = await skillsRes.json();

        if (cancelled) {
          return;
        }

        if (!trainerRes.ok) {
          setFormError(trainerJson?.error?.message ?? "Eğitmen verisi alinamadi");
          setLoading(false);
          return;
        }

        if (!skillsRes.ok) {
          setFormError(skillsJson?.error?.message ?? "Skill listesi alinamadi");
          setLoading(false);
          return;
        }

        const trainerSkills = (trainerJson?.data?.trainer?.skills ?? []) as TrainerSkillPayload[];

        setFormError(null);
        setAvailableSkills((skillsJson?.data?.skills ?? []) as SkillOption[]);
        setValue("firstName", trainerJson?.data?.trainer?.firstName ?? "");
        setValue("lastName", trainerJson?.data?.trainer?.lastName ?? "");
        setValue("employmentType", trainerJson?.data?.trainer?.employmentType ?? "internal");
        setValue("consultingFirm", trainerJson?.data?.trainer?.consultingFirm ?? "");
        setValue("biography", trainerJson?.data?.trainer?.biography ?? "");
        setValue("isActive", trainerJson?.data?.trainer?.isActive ?? true);
        setAssignedSkills(
          trainerSkills
            .map((entry) => {
              if (typeof entry.skill === "string") {
                return {
                  skillId: entry.skill,
                  name: entry.skill,
                  score: entry.score,
                };
              }

              return {
                skillId: entry.skill._id,
                name: entry.skill.name,
                score: entry.score,
              };
            })
            .sort((a, b) => a.name.localeCompare(b.name, "tr")),
        );
        setLoading(false);
      } catch {
        if (cancelled) {
          return;
        }

        setFormError("Veri yüklenemedi");
        setLoading(false);
      }
    };

    void fetchData();

    return () => {
      cancelled = true;
    };
  }, [setValue, trainerId]);

  const handleAddOrUpdateSkill = () => {
    setFormError(null);

    const selectedSkill = availableSkills.find((item) => item._id === selectedSkillId);
    if (!selectedSkill) {
      setFormError("Lütfen bir skill seçin");
      return;
    }

    if (score < 1 || score > 10) {
      setFormError("Puan 1 ile 10 arasinda olmali");
      return;
    }

    setAssignedSkills((prev) => {
      const existingIndex = prev.findIndex((item) => item.skillId === selectedSkill._id);
      if (existingIndex === -1) {
        return [...prev, { skillId: selectedSkill._id, name: selectedSkill.name, score }].sort((a, b) =>
          a.name.localeCompare(b.name, "tr"),
        );
      }

      const updated = [...prev];
      updated[existingIndex] = { ...updated[existingIndex], score };
      return updated.sort((a, b) => a.name.localeCompare(b.name, "tr"));
    });

    setSelectedSkillId("");
    setScore(1);
  };

  const handleRemoveSkill = (skillId: string) => {
    setAssignedSkills((prev) => prev.filter((item) => item.skillId !== skillId));
  };

  const onSubmit = async (formValues: TrainerSkillUpdateInput) => {
    setFormError(null);

    const payload: TrainerSkillUpdateInput = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      employmentType: formValues.employmentType,
      consultingFirm: formValues.consultingFirm,
      biography: formValues.biography,
      isActive: formValues.isActive,
      skills: assignedSkills.map((item) => ({ skillId: item.skillId, score: item.score })),
    };

    const parsed = trainerSkillUpdateSchema.safeParse(payload);
    if (!parsed.success) {
      setFormError("Puanlar 1-10 araliginda olmali");
      return;
    }

    const response = await fetch(`/api/trainers/${trainerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
    });

    const result = await response.json();
    if (!response.ok) {
      setFormError(result?.error?.message ?? "Skill atamalari kaydedilemedi");
      return;
    }

    router.push(`/trainers/${trainerId}`);
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Yükleniyor...</p>;
  }

  const activeSkillOptions = availableSkills.filter((item) => item.isActive);

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Eğitmen Düzenleme</h1>
          <p className="text-sm text-muted-foreground">
            Profil bilgilerini guncelleyin, aktif/pasif durumunu yonetin ve skill puanlarini kaydedin.
          </p>
        </div>
        <Link href={`/trainers/${trainerId}`} className="text-sm underline">
          Profile Don
        </Link>
      </header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-lg border border-border bg-card p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="firstName" className="text-sm font-medium">
                Ad
              </label>
              <input
                id="firstName"
                type="text"
                {...register("firstName")}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="lastName" className="text-sm font-medium">
                Soyad
              </label>
              <input
                id="lastName"
                type="text"
                {...register("lastName")}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="employmentType" className="text-sm font-medium">
                Istihdam Turu
              </label>
              <select
                id="employmentType"
                {...register("employmentType")}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="internal">Kurum içi</option>
                <option value="external">Kurum dışı</option>
              </select>
            </div>

            {employmentType === "external" ? (
              <div className="space-y-1.5">
                <label htmlFor="consultingFirm" className="text-sm font-medium">
                  Danışmanlık Firmasi
                </label>
                <input
                  id="consultingFirm"
                  type="text"
                  {...register("consultingFirm")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            ) : null}

            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="biography" className="text-sm font-medium">
                Özgeçmiş
              </label>
              <textarea
                id="biography"
                rows={5}
                {...register("biography")}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <label className="inline-flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" {...register("isActive")} className="size-4" />
              Eğitmen aktif
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 space-y-4 mt-4">
          <h2 className="text-lg font-semibold">Skill Atamalari</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div className="space-y-1.5">
              <label htmlFor="skillId" className="text-sm font-medium">
                Skill
              </label>
              <select
                id="skillId"
                value={selectedSkillId}
                onChange={(event) => setSelectedSkillId(event.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Skill seçin</option>
                {activeSkillOptions.map((skill) => (
                  <option key={skill._id} value={skill._id}>
                    {skill.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="score" className="text-sm font-medium">
                Puan (1-10)
              </label>
              <input
                id="score"
                type="number"
                min={1}
                max={10}
                value={score}
                onChange={(event) => setScore(Number(event.target.value))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <button
              type="button"
              onClick={handleAddOrUpdateSkill}
              className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold"
            >
              Ekle / Guncelle
            </button>
          </div>

          <div className="space-y-2">
            {assignedSkills.length === 0 ? (
              <p className="text-sm text-muted-foreground">Henüz skill atanmamis.</p>
            ) : (
              assignedSkills.map((item) => (
                <div
                  key={item.skillId}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                >
                  <p className="text-sm">
                    <span className="font-medium">{item.name}</span> - Puan: {item.score}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(item.skillId)}
                    className="rounded-md border border-border px-2 py-1 text-xs"
                  >
                    Kaldir
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {formError ? <p className="text-sm text-destructive mt-3">{formError}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold disabled:opacity-60 mt-4"
        >
          {isSubmitting ? "Kaydediliyor..." : "Degisiklikleri Kaydet"}
        </button>
      </form>
    </section>
  );
}
