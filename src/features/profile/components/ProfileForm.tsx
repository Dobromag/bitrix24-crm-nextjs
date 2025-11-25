"use client";

import CustomInput from "@/components/ui/CustomInput";

interface ProfileFieldsProps {
  disabled?: boolean;
}

export default function ProfileFields({
  disabled = false,
}: ProfileFieldsProps) {
  return (
    <>
      <CustomInput
        name="name"
        label="Имя"
        placeholder="Введите имя"
        disabled={disabled}
      />
      <CustomInput
        name="email"
        label="Email"
        type="email"
        placeholder="Введите email"
        disabled={true}
      />
      <CustomInput
        name="phone"
        label="Телефон"
        type="tel"
        autoComplete="off"
        inputMode="tel"
        placeholder="+7 (___) ___-__-__"
        disabled={disabled}
      />
      <CustomInput
        name="address"
        label="Адрес"
        placeholder="Введите адрес"
        disabled={disabled}
      />
    </>
  );
}
