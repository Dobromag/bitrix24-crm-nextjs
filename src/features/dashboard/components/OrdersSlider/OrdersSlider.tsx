// src/features/dashboard/components/OrdersSlider/OrdersSlider.tsx
import { DashboardBlockTitle } from "@/features/dashboard/ui/DashboardBlockTitle/DashboardBlockTitle";
import { useOrders } from "@/features/orders/hooks/useOrders";
import {
  ORDER_STATUS_COLOR,
  ORDER_STATUS_TEXT,
} from "@/features/orders/lib/orderStatus";
import type { Deal } from "@/features/orders/types";

import {
  Box,
  Button,
  Typography,
  type SxProps,
  type Theme,
} from "@mui/material";

import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./OrdersSlider.module.scss";

interface OrdersSliderProps {
  orders: Deal[];
  sx?: SxProps<Theme>;
}

export const OrdersSlider = ({ orders, sx }: OrdersSliderProps) => {
  const { repeatOrder, isRepeating } = useOrders();

  return (
    <Box className={styles.sliderContainer} sx={sx}>
      <DashboardBlockTitle>Заказы</DashboardBlockTitle>

      <Swiper
        slidesPerView={1}
        spaceBetween={16}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        className={styles.swiper}
        breakpoints={{
          600: { slidesPerView: 2, spaceBetween: 16 },
          960: { slidesPerView: 3, spaceBetween: 24 },
          1280: { slidesPerView: 4, spaceBetween: 32 },
          1536: { slidesPerView: 4, spaceBetween: 32 },
        }}
      >
        {orders.map((order) => {
          const statusText = ORDER_STATUS_TEXT[order.stageId] || "Статус";
          const statusColor = ORDER_STATUS_COLOR[order.stageId] || "#000";

          return (
            <SwiperSlide key={order.id} className={styles.slide}>
              <Box className={styles.card}>
                {/* Статус */}
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      bgcolor: statusColor,
                      borderRadius: "50%",
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {statusText}
                  </Typography>
                </Box>

                {/* Заголовок */}
                <Typography
                  variant="body1"
                  fontWeight={600}
                  className={styles.cardText}
                >
                  {order.title}
                </Typography>

                {/* Дата */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className={styles.cardText}
                >
                  Дата: {order.dateCreate}
                </Typography>

                {/* Кнопки */}
                <Box display="flex" flexDirection="column" gap={1} mt={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => repeatOrder(order.bitrixDealId)}
                    disabled={isRepeating}
                  >
                    Повторить заказ
                  </Button>
                  <Button variant="contained" size="small">
                    Скачать
                  </Button>
                </Box>
              </Box>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  );
};
