import { z } from "zod";
export const userSchema = z.object({
  name: z.string().min(3, "Имя должно содержать минимум 3 символа"),
  email: z
    .string()
    .toLowerCase()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Неверный формат email"),
  phone: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => !val || val === "" || /^\+7\d{10}$/.test(val),
      "Неверный формат телефона"
    ),
  address: z
    .union([z.string(), z.null()])
    .refine(
      (val) => !val || val.length >= 5,
      "Адрес должен содержать минимум 5 символов"
    ),
});
export const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^(?=.*[A-Z])(?=.*\d).{6,}$/.test(val),
        "Пароль: мин. 6 символов, 1 заглавная, 1 цифра"
      ),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (!data.newPassword && !data.confirmPassword) return true;
      if (!data.newPassword || !data.confirmPassword) return false;
      return data.newPassword === data.confirmPassword;
    },
    {
      message: "Пароли не совпадают",
      path: ["confirmPassword"], // ошибка появится под confirmPassword
    }
  );
export const avatarSchema = z.object({
  avatar: z
    .union([z.instanceof(File), z.string(), z.null()])
    .optional()
    .nullable()
    .refine((val) => {
      if (!val || typeof val === "string" || val === null) return true;
      return ["image/jpeg", "image/png"].includes(val.type);
    }, "Только JPG или PNG")
    .refine((val) => {
      if (val instanceof File) return val.size < 2 * 1024 * 1024;
      return true;
    }, "Максимум 2MB"),
});
