import { z } from "zod";

export const createSkillSchema = z.object({
  name: z.string().trim().min(1, "Skill adi zorunludur").max(100, "Skill adi cok uzun"),
});

export const updateSkillSchema = z.object({
  isActive: z.boolean(),
});

export type CreateSkillInput = z.infer<typeof createSkillSchema>;
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>;
