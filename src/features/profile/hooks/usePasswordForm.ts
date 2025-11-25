import { passwordSchema } from "@/lib/validation/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { PasswordFormData } from "../types";

export const usePasswordForm = () => {
  return useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });
};
