import { Button } from "@mui/material";
import { memo } from "react";
import styles from "./PayButton.module.scss";

interface PayButtonProps {
  invoiceId: string;
  onPay: (id: string) => Promise<void>;
  isPaying: boolean;
}

export const PayButton = memo(
  ({ invoiceId, onPay, isPaying }: PayButtonProps) => {
    const handleClick = async () => {
      await onPay(invoiceId);
    };

    return (
      <Button
        variant="contained"
        size="small"
        onClick={handleClick}
        disabled={isPaying}
        className={styles.button}
        sx={{
          bgcolor: "#000",
          "&:hover": { bgcolor: "#333" },
          "&:disabled": { bgcolor: "#666" },
        }}
      >
        {isPaying ? "Оплачивается..." : "Оплатить"}
      </Button>
    );
  }
);

PayButton.displayName = "PayButton";
