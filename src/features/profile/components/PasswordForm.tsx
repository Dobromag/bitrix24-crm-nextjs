"use client";

import CustomInput from "@/components/ui/CustomInput";

export default function PasswordFields() {
  return (
    <>
      <CustomInput
        name="newPassword"
        label="Новый пароль"
        type="password"
        placeholder="Введите новый пароль"
        hasAdornment
      />
      <CustomInput
        name="confirmPassword"
        label="Подтвердить пароль"
        type="password"
        placeholder="Подтвердите пароль"
        hasAdornment
      />
    </>
  );
}
