import { Box, Skeleton } from "@mui/material";

export const SkeletonTable = () => {
  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <Skeleton variant="rectangular" height={48} sx={{ mb: 1 }} />
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} variant="rectangular" height={52} sx={{ mb: 0.5 }} />
      ))}
    </Box>
  );
};
