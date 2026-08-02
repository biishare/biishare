'use client'

import { Box, Skeleton } from '@mui/material'

interface ContentCardSkeletonProps {
  count?: number
  mobileCount?: number
}

export default function ContentCardSkeleton({
  count = 8,
  mobileCount = 3,
}: ContentCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Box
          key={index}
          sx={{
            display: {
              xs: index >= mobileCount ? 'none' : 'flex',
              sm: 'flex',
            },
            flexDirection: 'column',
            gap: 1.1,
            minWidth: 0,

            '@media (hover: hover) and (pointer: fine)': {
              mx: -1,
              p: 1,
              borderRadius: 2,
            },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              aspectRatio: '16 / 9',
              width: '100%',
              overflow: 'hidden',
              bgcolor: '#e2e8f0',

              '@media (hover: hover) and (pointer: fine)': {
                borderRadius: 1.5,
              },
            }}
          >
            <Skeleton
              variant="rectangular"
              animation="wave"
              sx={{
                width: '100%',
                height: '100%',
                transform: 'none',
              }}
            />

            <Skeleton
              variant="rectangular"
              animation="wave"
              width={48}
              height={20}
              sx={{
                position: 'absolute',
                right: 8,
                bottom: 8,
                bgcolor: 'rgba(0,0,0,.18)',
              }}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={0.45} sx={{ pb: 0.5 }}>
            <Box sx={{ minHeight: 44 }}>
              <Skeleton height={22} width="94%" />
              <Skeleton height={22} width="72%" />
            </Box>

            <Skeleton height={18} width="68%" />
          </Box>
        </Box>
      ))}
    </>
  )
}
