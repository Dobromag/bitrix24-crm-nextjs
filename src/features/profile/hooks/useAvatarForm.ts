import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import type { AvatarFormData } from "../types";

export const useAvatarForm = (defaultValue: string) => {
  const [preview, setPreview] = useState(defaultValue);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<AvatarFormData>({
    defaultValues: { avatar: defaultValue },
  });
  const handleFileChange = (file: File | null) => {
    setError(null);
    if (!file) {
      form.setValue("avatar", null);
      setPreview(defaultValue);
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
        setLocalPreviewUrl(undefined);
      }
      return;
    }
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Только JPG или PNG");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Максимальный размер 2MB");
      return;
    }
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl(undefined);
    }
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setLocalPreviewUrl(localUrl);
    form.setValue("avatar", file);
  };
  const resetAvatar = () => {
    form.setValue("avatar", null);
    setPreview(defaultValue);
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl(undefined);
    }
    setError(null);
  };
  const setPreviewExternal = useCallback(
    (url: string) => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
        setLocalPreviewUrl(undefined);
      }
      setPreview(url);
      form.setValue(
        "avatar",
        url.startsWith("/avatars/")
          ? url
          : url === "/images/icons/default-avatar.svg"
          ? null
          : url
      );
    },
    [form, localPreviewUrl]
  );
  return {
    ...form,
    preview,
    handleFileChange,
    resetAvatar,
    setPreview: setPreviewExternal,
    uploadError: error,
  };
};
