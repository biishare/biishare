'use client'

import { Box, Paper, Skeleton } from '@mui/material'

export default function DetailContentSkeleton() {
  return (
    <div className="bg-amber-50 py-8 px-4 lg:px-24">
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
        }}
      >
        {/* HERO */}
        <div className="md:w-[70%] w-full">
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            {/* video/doc placeholder */}
            <Skeleton
              variant="rectangular"
              sx={{
                width: '100%',
                aspectRatio: '16 / 9',
                minHeight: {
                  xs: 240,
                  sm: 320,
                  md: 520,
                },
                borderRadius: 2,
              }}
            />

            <Box mt={2}>
              <Skeleton height={32} width="80%" />
              <Skeleton height={24} width="60%" />
            </Box>
          </Paper>
        </div>

        {/* PLAYLIST */}
        <div className="md:w-[30%] w-full">
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              maxHeight: 520,
              overflow: 'hidden',
            }}
          >
            <Skeleton
              height={28}
              width="70%"
              sx={{ mb: 2 }}
            />

            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                height={50}
                sx={{
                  mb: 1,
                  borderRadius: 1,
                }}
              />
            ))}
          </Paper>
        </div>
      </Box>
    </div>
  )
}