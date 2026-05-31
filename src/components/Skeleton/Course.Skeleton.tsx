'use client'

import { Box, Paper, Skeleton } from '@mui/material'

interface ContentCardSkeletonProps {
  count?: number
}

export default function ContentCardSkeleton({
  count = 8,
}: ContentCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Paper
          key={index}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
          }}
        >
          {/* IMAGEM */}
          <Skeleton
            variant="rectangular"
            sx={{ aspectRatio: '16 / 9' }}
          />

          {/* TEXTO */}
          <Box p={2}>
            <Skeleton height={28} width="90%" />
            <Skeleton height={20} width="70%" />
            <Skeleton height={20} width="60%" />
          </Box>

          {/* FOOTER */}
          <Box
            p={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Skeleton height={24} width="40%" />
            <Skeleton height={36} width={120} />
          </Box>
        </Paper>
      ))}
    </>
  )
}
