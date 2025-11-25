// src/app/(protected)/profile/page.tsx (updated)
"use client";
import Avatar from "@/features/profile/components/Avatar";
import PasswordFields from "@/features/profile/components/PasswordForm";
import ProfileFields from "@/features/profile/components/ProfileForm";
import { useAvatarForm } from "@/features/profile/hooks/useAvatarForm";
import { usePasswordForm } from "@/features/profile/hooks/usePasswordForm";
import { useProfileForm } from "@/features/profile/hooks/useProfileForm";
import { getUser, updateUser } from "@/features/profile/server/actions";
import type { UpdateUserInput } from "@/features/profile/types";
import Button from "@mui/material/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import styles from "./page.module.scss";
export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient(); // Для управления кэшем React Query
  // Загрузка данных пользователя
  const {
    data: userData,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: getUser,
    refetchOnWindowFocus: true,
  });
  const defaultAvatar = "/images/icons/default-avatar.svg";
  const profileData = userData
    ? {
        name: userData.name ?? "",
        email: userData.email ?? "",
        phone: userData.phone ?? null,
        address: userData.address ?? null,
      }
    : {};
  // Инициализация форм
  const profileMethods = useProfileForm(profileData);
  const passwordMethods = usePasswordForm();
  const avatarMethods = useAvatarForm(defaultAvatar);
  // Обновляем форму при изменении userData
  useEffect(() => {
    if (userData) {
      profileMethods.reset(profileData);
      const baseAvatar = userData.avatar ?? defaultAvatar;
      // добавляем v-параметр, чтобы браузер всегда получал актуальную версию
      const newAvatarUrl =
        baseAvatar === defaultAvatar
          ? baseAvatar
          : `${baseAvatar}?v=${Date.now()}`;
      avatarMethods.setPreview(newAvatarUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, profileMethods]);
  // Единая мутация для профиля и пароля
  const updateMutation = useMutation({
    mutationFn: async (data: Partial<UpdateUserInput>) => {
      return await updateUser(data);
    },
    onSuccess: async (result) => {
      if (result?.updated) {
        setIsEditing(false);
        passwordMethods.reset();
        await queryClient.invalidateQueries({ queryKey: ["userData"] });
      }
      setServerError(null);
    },
    onError: (err: Error) => {
      setServerError(err.message);
    },
  });
  // Обработка сохранения
  const handleSave = async () => {
    setServerError(null);
    // Проверяем валидацию обеих форм
    const profileValid = await profileMethods.trigger();
    const passwordValid = await passwordMethods.trigger();
    const avatarValid = await avatarMethods.trigger();
    if (profileValid && passwordValid && avatarValid) {
      const profileData = profileMethods.getValues();
      const passwordData = passwordMethods.getValues();
      const rawAvatar = avatarMethods.getValues("avatar");
      let avatarForServer: string | null = null;
      if (rawAvatar instanceof File) {
        try {
          const formData = new FormData();
          formData.append("avatar", rawAvatar);
          const res = await fetch("/api/upload-avatar", {
            method: "POST",
            body: formData,
            credentials: "include",
          });
          const data: { avatarUrl?: string; error?: string } = await res.json();
          if (!res.ok || !data.avatarUrl) {
            throw new Error(data.error || "Ошибка загрузки аватара");
          }
          avatarForServer = data.avatarUrl;
        } catch (err) {
          setServerError(
            err instanceof Error ? err.message : "Неизвестная ошибка"
          );
          return;
        }
      } else {
        avatarForServer =
          typeof rawAvatar === "string"
            ? rawAvatar.trim() === ""
              ? null
              : rawAvatar
            : null;
      }
      const combined: Partial<UpdateUserInput> = {
        ...profileData,
        ...passwordData,
        avatar: avatarForServer,
      };
      updateMutation.mutate(combined);
    }
  };
  if (error) return <div>Ошибка: {error.message}</div>;
  if (!userData && isLoading) return <div>Загрузка...</div>;
  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.title}>Профиль</h1>
      <div className={styles.profileBlock}>
        <div className={styles.avatarSection}>
          <Avatar
            preview={avatarMethods.preview}
            onFileChange={avatarMethods.handleFileChange}
            onReset={avatarMethods.resetAvatar}
            disabled={!isEditing}
            size={203}
            alt="User avatar"
          />
          {avatarMethods.uploadError && (
            <p style={{ color: "#DA2323", fontSize: 12 }}>
              {avatarMethods.uploadError}
            </p>
          )}
        </div>
        <div className={styles.contentSection}>
          <FormProvider {...profileMethods}>
            <ProfileFields disabled={!isEditing} />
          </FormProvider>
          {isEditing && (
            <>
              <h2 className={styles.subtitle}>Смена пароля</h2>
              <FormProvider {...passwordMethods}>
                <PasswordFields />
              </FormProvider>
            </>
          )}
          {serverError ? (
            <p className={styles.error} style={{ color: "#DA2323" }}>
              {serverError}
            </p>
          ) : null}
          <Button
            variant="contained"
            color="primary"
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            fullWidth
            disabled={updateMutation.isPending || isFetching}
            sx={{
              mt: 2,
              height: isEditing ? 40 : 48,
              fontSize: isEditing ? 14 : 16,
              textTransform: "none",
            }}
          >
            {isEditing
              ? updateMutation.isPending
                ? "Сохранение..."
                : "Сохранить"
              : isFetching
              ? "Загрузка..."
              : "Редактировать"}
          </Button>
        </div>
      </div>
    </div>
  );
}
