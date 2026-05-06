import { useMemo } from "react";
import { ConflictWarning } from "@/components/features/trainings/ConflictWarning";
import { RecommendedTrainers } from "@/components/features/search/RecommendedTrainers";

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

type TrainingWizardStep3Props = {
  trainers: TrainerOption[];
  selectedPrimaryTrainerId: string;
  selectedCoTrainerIds: string[];
  conflicts: ConflictItem[];
  recommendedTrainers: RecommendedTrainerItem[];
  recommendationsLoading: boolean;
  recommendationDurationMs: number | null;
  assigning: boolean;
  assignError: string | null;
  onPrimaryChange: (trainerId: string) => void;
  onPickRecommendation: (trainerId: string) => void;
  onCoTrainerToggle: (trainerId: string) => void;
  onSave: (ignoreConflicts: boolean) => void;
};

export function TrainingWizardStep3({
  trainers,
  selectedPrimaryTrainerId,
  selectedCoTrainerIds,
  conflicts,
  recommendedTrainers,
  recommendationsLoading,
  recommendationDurationMs,
  assigning,
  assignError,
  onPrimaryChange,
  onPickRecommendation,
  onCoTrainerToggle,
  onSave,
}: TrainingWizardStep3Props) {
  const coTrainerOptions = useMemo(
    () => trainers.filter((trainer) => trainer._id !== selectedPrimaryTrainerId),
    [selectedPrimaryTrainerId, trainers],
  );

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      <h2 className="text-lg font-semibold">3. Adım - Eğitmen Atama</h2>

      <RecommendedTrainers
        items={recommendedTrainers}
        loading={recommendationsLoading}
        queryDurationMs={recommendationDurationMs}
        onPick={onPickRecommendation}
      />

      <div className="space-y-1.5">
        <label htmlFor="primaryTrainer" className="text-sm font-medium">
          Ana Eğitmen
        </label>
        <select
          id="primaryTrainer"
          value={selectedPrimaryTrainerId}
          onChange={(event) => onPrimaryChange(event.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Ana eğitmen seçin</option>
          {trainers.map((trainer) => (
            <option key={trainer._id} value={trainer._id}>
              {trainer.firstName} {trainer.lastName}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Co-trainerlar</p>
        {coTrainerOptions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Eklenebilecek co-trainer bulunamadı.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {coTrainerOptions.map((trainer) => {
              const checked = selectedCoTrainerIds.includes(trainer._id);
              return (
                <label
                  key={trainer._id}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onCoTrainerToggle(trainer._id)}
                    className="size-4"
                  />
                  {trainer.firstName} {trainer.lastName}
                </label>
              );
            })}
          </div>
        )}
      </div>

      <ConflictWarning conflicts={conflicts} />

      {assignError ? <p className="text-sm text-destructive">{assignError}</p> : null}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onSave(false)}
          disabled={assigning}
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          {assigning ? "Kaydediliyor..." : "Atamayi Kaydet"}
        </button>
        {conflicts.length > 0 ? (
          <button
            type="button"
            onClick={() => onSave(true)}
            disabled={assigning}
            className="rounded-md border border-[#F59E0B] text-[#92400E] px-4 py-2 text-sm font-semibold disabled:opacity-60"
          >
            Uyarıya Ragmen Devam Et
          </button>
        ) : null}
      </div>
    </div>
  );
}
