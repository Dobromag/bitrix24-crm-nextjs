import {
  avatarSchema,
  passwordSchema,
  userSchema,
} from "@/lib/validation/zodSchemas";
import { z } from "zod";

export type ProfileFormData = z.infer<typeof userSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;
export type AvatarFormData = z.infer<typeof avatarSchema> & {
  avatar?: File | string | null; // Extend for front (File)
};

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  bitrix_contact_id: string | null;
  password: string;
  previous_password_hashes: string;
  avatar: string | null;
}

export type UserData = ProfileFormData & {
  id: number;
  avatar: string | null;
  bitrix_contact_id: string | null; // Добавь, если нужен в dashboard/profile
};
export type UpdateUserInput = Partial<
  z.infer<typeof userSchema> &
    z.infer<typeof passwordSchema> &
    z.infer<typeof avatarSchema>
>;
