// src/features/dashboard/components/ProfileBlock/ProfileBlock.tsx
import { DashboardBlockTitle } from "@/features/dashboard/ui/DashboardBlockTitle/DashboardBlockTitle";
import type { UserData } from "@/features/profile/types";
import { Box, Typography, type SxProps, type Theme } from "@mui/material";
import styles from "./ProfileBlock.module.scss";

interface ProfileBlockProps {
  profile: UserData;
  sx?: SxProps<Theme>; // Добавили поддержку sx
}

export const ProfileBlock = ({ profile, sx }: ProfileBlockProps) => {
  return (
    <Box className={styles.profileBlock} sx={sx}>
      <DashboardBlockTitle>Профиль</DashboardBlockTitle>
      <Box className={styles.field}>
        <Typography variant="body2" color="text.secondary">
          Имя
        </Typography>
        <Typography variant="body1">{profile.name}</Typography>
      </Box>
      <Box className={styles.field}>
        <Typography variant="body2" color="text.secondary">
          Email
        </Typography>
        <Typography variant="body1">{profile.email}</Typography>
      </Box>
      <Box className={styles.field}>
        <Typography variant="body2" color="text.secondary">
          Телефон
        </Typography>
        <Typography variant="body1">{profile.phone || "Не указан"}</Typography>
      </Box>
      <Box className={styles.field}>
        <Typography variant="body2" color="text.secondary">
          Адрес
        </Typography>
        <Typography variant="body1">
          {profile.address || "Не указан"}
        </Typography>
      </Box>
    </Box>
  );
};
