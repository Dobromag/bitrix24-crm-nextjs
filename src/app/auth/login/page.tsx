"use client";

import AuthLayout, { FieldConfig } from "@/app/auth/AuthLayout";
import { useRouter } from "next/navigation";
import { UseFormSetError } from "react-hook-form";

export default function LoginPage() {
  const router = useRouter();

  const fieldsConfig: FieldConfig[] = [
    { name: "email", placeholder: "Email", component: "text" },
    {
      name: "password",
      placeholder: "Пароль",
      component: "password",
      hasAdornment: true,
    },
  ];

  const handleLogin = async (
    data: Record<string, string | undefined>,
    setError: UseFormSetError<Record<string, string | undefined>>
  ) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        if (errData.error) {
          setError("root", { message: errData.error });
        }
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("root", { message: "Неизвестная ошибка при логине" });
    }
  };

  return (
    <AuthLayout
      title="Вход"
      fieldsConfig={fieldsConfig}
      onSubmit={handleLogin}
      buttonText="Войти"
      linkText="Регистрация"
      linkHref="/auth/register"
      variant="login"
    />
  );
}
