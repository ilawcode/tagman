import { z } from "zod";

export const trainerCreateSchema = z
  .object({
    firstName: z.string().trim().min(1, "Ad zorunludur").max(100, "Ad cok uzun"),
    lastName: z.string().trim().min(1, "Soyad zorunludur").max(100, "Soyad cok uzun"),
    employmentType: z.enum(["internal", "external"]),
    consultingFirm: z.string().trim().max(150, "Firma adi cok uzun").optional(),
    biography: z.string().trim().min(1, "Özgeçmiş zorunludur").max(2000, "Özgeçmiş cok uzun"),
  })
  .superRefine((data, ctx) => {
    const hasFirm = Boolean(data.consultingFirm && data.consultingFirm.trim().length > 0);

    if (data.employmentType === "external" && !hasFirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["consultingFirm"],
        message: "Kurum dışı eğitmen icin danışmanlık firmasi zorunludur",
      });
    }
  });

export type TrainerCreateInput = z.infer<typeof trainerCreateSchema>;

export const trainerUpdateSchema = trainerCreateSchema.extend({
  isActive: z.boolean(),
});

export type TrainerUpdateInput = z.infer<typeof trainerUpdateSchema>;

export const trainerSkillAssignmentSchema = z.object({
  skillId: z.string().min(1, "Skill id zorunludur"),
  score: z
    .number()
    .int("Puan tam sayı olmali")
    .min(1, "Puan en az 1 olmali")
    .max(10, "Puan en fazla 10 olmali"),
});

export const trainerSkillUpdateSchema = trainerUpdateSchema.extend({
  skills: z.array(trainerSkillAssignmentSchema),
});

export type TrainerSkillUpdateInput = z.infer<typeof trainerSkillUpdateSchema>;
