'use client'

import {
  Paper,
  Skeleton,
  Box,
} from '@mui/material'

interface Props {
  count?: number
}

export default function ToquesSkeleton({
  count = 5,
}: Props) {
  const skeletonCount = count + 1

  return (
    <Box
      sx={{
        mb: 4,
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 1,
          mb: 1.5,
        }}
      >
        <Skeleton
          variant="rounded"
          animation="wave"
          width={86}
          height={24}
        />

        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            gap: 1,
          }}
        >
          {[1, 2].map((item) => (
            <Skeleton
              key={item}
              variant="circular"
              animation="wave"
              width={36}
              height={36}
            />
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          px: 1,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {Array.from({
          length: skeletonCount,
        }).map((_, i) => (
          <Box
            key={i}
            sx={{
              flex: {
                xs: '0 0 140px',
                sm: '0 0 200px',
                md: '0 0 240px',
              },
              scrollSnapAlign: 'start',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                width: '100%',
                aspectRatio: '9 / 16',
                overflow: 'hidden',
                borderRadius: 2,
                position: 'relative',
                bgcolor: '#0f172a',
              }}
            >
              <Skeleton
                variant="rectangular"
                animation="wave"
                width="100%"
                height="100%"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  bgcolor: 'rgba(255,255,255,.12)',
                }}
              />

              <Skeleton
                variant="rounded"
                animation="wave"
                width={45}
                height={20}
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  borderRadius: 1,
                  bgcolor: 'rgba(255,255,255,.32)',
                }}
              />

              <Skeleton
                variant="circular"
                animation="wave"
                width={28}
                height={28}
                sx={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  bgcolor: 'rgba(255,255,255,.24)',
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 2,
                  background:
                    'linear-gradient(to top, rgba(0,0,0,.78), transparent)',
                }}
              >
                <Skeleton
                  animation="wave"
                  width="90%"
                  height={28}
                  sx={{ mb: 1 }}
                />

                <Skeleton
                  animation="wave"
                  width="100%"
                  height={16}
                />

                <Skeleton
                  animation="wave"
                  width="75%"
                  height={16}
                />
              </Box>
            </Paper>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
