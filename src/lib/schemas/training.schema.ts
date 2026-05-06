import { z } from "zod";

export const trainingCreateSchema = z.object({
  subject: z.string().trim().min(1, "Konu zorunludur").max(200, "Konu cok uzun"),
  date: z.string().min(1, "Tarih zorunludur"),
  durationMinutes: z
    .number()
    .int("Sure tam sayı olmali")
    .min(15, "Sure en az 15 dakika olmali")
    .max(24 * 60, "Sure en fazla 1440 dakika olabilir"),
  location: z.string().trim().min(1, "Konum zorunludur").max(200, "Konum cok uzun"),
  notes: z.string().trim().max(2000, "Notlar cok uzun").optional(),
});

export type TrainingCreateInput = z.infer<typeof trainingCreateSchema>;

export const trainingAssignSchema = z
  .object({
    trainingId: z.string().min(1, "Eğitim id zorunludur"),
    primaryTrainerId: z.string().min(1, "Ana eğitmen zorunludur"),
    coTrainerIds: z.array(z.string().min(1, "Eğitmen id zorunludur")).default([]),
    ignoreConflicts: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.coTrainerIds.includes(data.primaryTrainerId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["coTrainerIds"],
        message: "Ana eğitmen co-trainer listesinde olamaz",
      });
    }

    const uniqueCount = new Set(data.coTrainerIds).size;
    if (uniqueCount !== data.coTrainerIds.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["coTrainerIds"],
        message: "Aynı co-trainer birden fazla kez seçilemez",
      });
    }
  });

export type TrainingAssignInput = z.infer<typeof trainingAssignSchema>;

export const trainingCancelSchema = z.object({
  cancelNote: z.string().trim().min(1, "İptal notu zorunludur").max(2000, "İptal notu cok uzun"),
});

export type TrainingCancelInput = z.infer<typeof trainingCancelSchema>;

export const trainingCompleteSchema = z.object({
  score: z
    .number({ message: "Puan zorunludur" })
    .int("Puan tam sayı olmali")
    .min(1, "Puan 1 ile 10 arasinda olmali")
    .max(10, "Puan 1 ile 10 arasinda olmali"),
});

export type TrainingCompleteInput = z.infer<typeof trainingCompleteSchema>;
