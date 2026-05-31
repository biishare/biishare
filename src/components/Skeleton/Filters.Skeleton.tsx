import { Box, Skeleton } from "@mui/material";

export function FiltersSkeleton() {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "nowrap",
        gap: 2,
        mt: 4,
        overflowX: "auto",
        pb: 1,
      }}
    >
      {[1, 2, 3, 4].map((i) => (
        <Skeleton
          key={i}
          variant="rounded"
          width={160}
          height={56}
        />
      ))}
    </Box>
  );
}
