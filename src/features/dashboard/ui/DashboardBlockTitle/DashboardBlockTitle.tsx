import { Typography } from "@mui/material";
import React from "react";

interface DashboardBlockTitleProps {
  children: React.ReactNode;
}

export const DashboardBlockTitle = ({ children }: DashboardBlockTitleProps) => {
  return (
    <Typography
      sx={{
        fontWeight: 400,
        marginBottom: "12px",
        fontSize: {
          xs: "20px",
          sm: "24px",
          md: "28px",
          lg: "32px",
        },
      }}
    >
      {children}
    </Typography>
  );
};
