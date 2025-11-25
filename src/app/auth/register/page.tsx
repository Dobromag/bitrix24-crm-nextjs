"use client";

import AuthLayout, { FieldConfig } from "@/app/auth/AuthLayout";
import { useRouter } from "next/navigation";
import { UseFormSetError } from "react-hook-form";

export default function RegisterPage() {
  const router = useRouter();

  const fieldsConfig: FieldConfig[] = [
    { name: "name", placeholder: "Имя", component: "text" },
    { name: "email", placeholder: "Email", component: "text" },
    {
      name: "password",
      placeholder: "Пароль",
      component: "password",
      hasAdornment: true,
    },
    {
      name: "confirmPassword",
      placeholder: "Повторите пароль",
      component: "password",
      hasAdornment: true,
    },
  ];

  const onSubmit = async (
    data: Record<string, string | undefined>,
    setError: UseFormSetError<Record<string, string | undefined>>
  ) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();

        if (errData.fieldErrors) {
          Object.entries(errData.fieldErrors).forEach(([field, message]) => {
            setError(field as keyof typeof data, {
              message: message as string,
              type: "server",
            });
          });
        }

        setError("root", {
          message: errData.error || "Ошибка регистрации",
        });
        return;
      }

      router.push("/auth/login");
    } catch (err) {
      console.error(err);
      setError("root", {
        message: "Неизвестная ошибка при регистрации",
      });
    }
  };

  return (
    <AuthLayout
      variant="register"
      title="Регистрация"
      fieldsConfig={fieldsConfig}
      onSubmit={onSubmit}
      buttonText="Зарегистрироваться"
      linkText="Вход"
      linkHref="/auth/login"
      inputHeight={40}
      inputFontSize={14}
      buttonHeight={40}
      buttonFontSize={14}
    />
  );
}
