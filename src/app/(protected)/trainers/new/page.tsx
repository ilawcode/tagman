"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  trainerCreateSchema,
  type TrainerCreateInput,
} from "@/lib/schemas/trainer.schema";

export default function NewTrainerPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const defaultValues = useMemo<TrainerCreateInput>(
    () => ({
      firstName: "",
      lastName: "",
      employmentType: "internal",
      consultingFirm: "",
      biography: "",
    }),
    [],
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<TrainerCreateInput>({
    resolver: zodResolver(trainerCreateSchema),
    mode: "onBlur",
    defaultValues,
  });

  const employmentType = useWatch({ control, name: "employmentType" });

  const onSubmit = async (values: TrainerCreateInput) => {
    setFormError(null);

    const response = await fetch("/api/trainers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const result = await response.json();
    if (!response.ok) {
      setFormError(result?.error?.message ?? "Eğitmen kaydı oluşturulamadi");
      return;
    }

    router.push(`/trainers/${result.data.trainer._id}`);
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Yeni Eğitmen</h1>
        <p className="text-sm text-muted-foreground">Zorunlu alanlar * ile isaretlenmistir.</p>
      </header>

      <form className="space-y-5 max-w-2xl" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="firstName" className="text-sm font-medium">
              Ad *
            </label>
            <input
              id="firstName"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register("firstName")}
            />
            {errors.firstName ? (
              <p className="text-sm text-destructive">{errors.firstName.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="lastName" className="text-sm font-medium">
              Soyad *
            </label>
            <input
              id="lastName"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register("lastName")}
            />
            {errors.lastName ? (
              <p className="text-sm text-destructive">{errors.lastName.message}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="employmentType" className="text-sm font-medium">
            Kurum Tipi *
          </label>
          <select
            id="employmentType"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register("employmentType")}
            onChange={(event) => {
              const value = event.target.value as "internal" | "external";
              setValue("employmentType", value, { shouldValidate: true, shouldDirty: true });
              if (value === "internal") {
                setValue("consultingFirm", "", { shouldValidate: true, shouldDirty: true });
              }
            }}
          >
            <option value="internal">Kurum İçi</option>
            <option value="external">Kurum Dışı</option>
          </select>
        </div>

        {employmentType === "external" ? (
          <div className="space-y-1.5">
            <label htmlFor="consultingFirm" className="text-sm font-medium">
              Danışmanlık Firmasi *
            </label>
            <input
              id="consultingFirm"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register("consultingFirm")}
            />
            {errors.consultingFirm ? (
              <p className="text-sm text-destructive">{errors.consultingFirm.message}</p>
            ) : null}
          </div>
        ) : null}

        <div className="space-y-1.5">
          <label htmlFor="biography" className="text-sm font-medium">
            Özgeçmiş *
          </label>
          <textarea
            id="biography"
            rows={5}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register("biography")}
          />
          {errors.biography ? (
            <p className="text-sm text-destructive">{errors.biography.message}</p>
          ) : null}
        </div>

        {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          {isSubmitting ? "Kaydediliyor..." : "Eğitmeni Kaydet"}
        </button>
      </form>
    </section>
  );
}
