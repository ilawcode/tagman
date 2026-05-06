import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Gecerli bir e-posta girin"),
  password: z.string().min(8, "Sifre en az 8 karakter olmali"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = registerSchema;
export type LoginInput = z.infer<typeof loginSchema>;
