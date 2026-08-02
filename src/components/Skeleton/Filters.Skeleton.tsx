import { Box, Skeleton } from "@mui/material";

interface FiltersSkeletonProps {
  stickyTop?: number;
  stuck?: boolean;
}

export function FiltersSkeleton({ stickyTop = 0, stuck = false }: FiltersSkeletonProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "nowrap",
        gap: 1,
        mt: 2,
        mb: stuck ? 2 : 1,
        mx: {
          xs: 0,
          lg: -1.5,
        },
        px: {
          xs: 2,
          lg: 1.5,
        },
        overflowX: "auto",
        scrollbarWidth: "none",
        position: "sticky",
        top: {
          xs: stickyTop,
          md: 0,
        },
        zIndex: 40,
        transition:
          "top 180ms ease, margin-bottom 180ms ease, border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease",
        bgcolor: stuck ? "rgba(255,255,255,0.96)" : "background.paper",
        backdropFilter: stuck ? "blur(14px)" : "none",
        borderBottom: stuck
          ? "1px solid rgba(226, 232, 240, 0.9)"
          : "1px solid transparent",
        boxShadow: "none",
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
