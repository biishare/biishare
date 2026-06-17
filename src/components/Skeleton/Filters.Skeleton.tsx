import { Box, Skeleton } from "@mui/material";

export function FiltersSkeleton() {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "nowrap",
        gap: 1,
        mt: 2,
        mb: 1,
        px: 2,
        overflowX: "auto",
        scrollbarWidth: "none",
        position: "sticky",
        top: 0,
        zIndex: 999,
        bgcolor: "background.paper",
        borderBottom: "1px solid #e0e0e0",
        py: 1,
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {[1, 2, 3, 4].map((i) => (
        <Skeleton
          key={i}
          variant="rounded"
          animation="wave"
          width={120}
          height={32}
          sx={{
            flexShrink: 0,
            borderRadius: 999,
          }}
        />
      ))}
    </Box>
  );
}
