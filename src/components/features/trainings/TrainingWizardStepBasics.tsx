import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { TrainingCreateInput } from "@/lib/schemas/training.schema";

type TrainingWizardStepBasicsProps = {
  register: UseFormRegister<TrainingCreateInput>;
  errors: FieldErrors<TrainingCreateInput>;
};

export function TrainingWizardStepBasics({ register, errors }: TrainingWizardStepBasicsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="subject" className="text-sm font-medium">
          Konu
        </label>
        <input
          id="subject"
          type="text"
          {...register("subject")}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        {errors.subject ? <p className="text-sm text-destructive">{errors.subject.message}</p> : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="date" className="text-sm font-medium">
            Tarih
          </label>
          <input
            id="date"
            type="date"
            {...register("date")}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          {errors.date ? <p className="text-sm text-destructive">{errors.date.message}</p> : null}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="durationMinutes" className="text-sm font-medium">
            Sure (dakika)
          </label>
          <input
            id="durationMinutes"
            type="number"
            min={15}
            step={15}
            {...register("durationMinutes", { valueAsNumber: true })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          {errors.durationMinutes ? (
            <p className="text-sm text-destructive">{errors.durationMinutes.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="location" className="text-sm font-medium">
          Konum
        </label>
        <input
          id="location"
          type="text"
          {...register("location")}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        {errors.location ? <p className="text-sm text-destructive">{errors.location.message}</p> : null}
      </div>
    </div>
  );
}
