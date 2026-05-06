import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { TrainingCreateInput } from "@/lib/schemas/training.schema";

type TrainingWizardStepNotesProps = {
  register: UseFormRegister<TrainingCreateInput>;
  errors: FieldErrors<TrainingCreateInput>;
};

export function TrainingWizardStepNotes({ register, errors }: TrainingWizardStepNotesProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="notes" className="text-sm font-medium">
          Notlar (opsiyonel)
        </label>
        <textarea
          id="notes"
          rows={6}
          {...register("notes")}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        {errors.notes ? <p className="text-sm text-destructive">{errors.notes.message}</p> : null}
      </div>
    </div>
  );
}
