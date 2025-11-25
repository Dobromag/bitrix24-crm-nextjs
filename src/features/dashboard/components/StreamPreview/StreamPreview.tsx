// src/features/dashboard/components/StreamPreview/StreamPreview.tsx
import { DashboardBlockTitle } from "@/features/dashboard/ui/DashboardBlockTitle/DashboardBlockTitle";
import { LiveIndicator } from "@/features/stream/components/LiveIndicator/LiveIndicator";
import { Box, Typography, type SxProps, type Theme } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import type { StreamPreviewData } from "../../types";
import styles from "./StreamPreview.module.scss";

interface StreamPreviewProps {
  stream: StreamPreviewData;
  sx?: SxProps<Theme>; // Добавили поддержку sx
}

export const StreamPreview = ({ stream, sx }: StreamPreviewProps) => {
  return (
    <Box className={styles.previewBlock} sx={sx}>
      <DashboardBlockTitle>Трансляция</DashboardBlockTitle>
      <Box className={styles.videoWrapper}>
        <Image
          src={stream.previewUrl}
          alt="Трансляция preview"
          fill
          className={styles.video}
          priority
        />
        <LiveIndicator className={styles.liveBadge} />
      </Box>
      <Box className={styles.stats}>
        <Typography>Активных заказов: {stream.stats.activeOrders}</Typography>
        <Typography>
          Сотрудников онлайн: {stream.stats.onlineEmployees}
        </Typography>
        <Typography>Зрителей: {stream.stats.viewers}</Typography>
      </Box>
      <Link href="/stream" className={styles.link}>
        Перейти к трансляции →
      </Link>
    </Box>
  );
};
