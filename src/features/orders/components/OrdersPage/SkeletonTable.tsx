import { Box, Skeleton } from "@mui/material";

export const SkeletonTable = () => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 2,
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          height={150}
          sx={{ borderRadius: 3 }}
        />
      ))}
    </Box>
  );
};
