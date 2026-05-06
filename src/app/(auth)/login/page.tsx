"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginInput } from "@/lib/schemas/auth.schema";

export default function LoginPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (values: LoginInput) => {
    setFormError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const result = await response.json();
    if (!response.ok) {
      setFormError(result?.error?.message ?? "Giris sirasinda bir hata olustu");
      return;
    }

    router.replace("/dashboard");
  };

  return (
    <section className="min-h-screen grid place-items-center p-6 bg-background">
      <div className="w-full max-w-md rounded-lg bg-card border border-border p-6 space-y-5">
        <div>
          <h1 className="text-xl font-semibold">Koordinator Giris</h1>
          <p className="text-sm text-muted-foreground">E-posta ve sifrenizle giris yapin.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              E-posta *
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="ornek@firma.com"
              {...register("email")}
            />
            {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Sifre *
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Sifrenizi girin"
              {...register("password")}
            />
            {errors.password ? (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            ) : null}
          </div>

          {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Giris yapiliyor..." : "Giris Yap"}
          </button>
        </form>

        <p className="text-sm text-muted-foreground">
          Hesabiniz yok mu? <Link className="text-foreground underline" href="/register">Kayit olun</Link>
        </p>
      </div>
    </section>
  );
}
