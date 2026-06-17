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
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            backgroundColor: '#fff',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              aspectRatio: '16 / 9',
              width: '100%',
            }}
          >
            <Skeleton
              variant="rectangular"
              animation="wave"
              sx={{
                width: '100%',
                height: '100%',
              }}
            />

            <Skeleton
              variant="rounded"
              animation="wave"
              width={88}
              height={24}
              sx={{
                position: 'absolute',
                top: 10,
                left: 10,
                borderRadius: 1,
                bgcolor: 'rgba(0,0,0,.18)',
              }}
            />
          </Box>

          <Box
            p={2}
            display="flex"
            flexDirection="column"
            gap={1}
          >
            <Box sx={{ minHeight: 48 }}>
              <Skeleton height={24} width="94%" />
              <Skeleton height={24} width="72%" />
            </Box>

            <Skeleton height={18} width="78%" />
            <Skeleton height={18} width="42%" />
          </Box>
        </Paper>
      ))}
    </>
  )
}
