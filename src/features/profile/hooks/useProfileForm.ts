import { userSchema } from "@/lib/validation/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ProfileFormData } from "../types";

export const useProfileForm = (defaultValues: Partial<ProfileFormData>) => {
  return useForm<ProfileFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: null,
      address: null,
      ...defaultValues,
    },
  });
};
