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
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        px: 1,
        overflowX: 'auto',

        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      {Array.from({
        length: count,
      }).map((_, i) => (
        <Box
          key={i}
          sx={{
            flex: {
              xs: '0 0 120px',
              sm: '0 0 180px',
              md: '0 0 240px',
            },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              height: {
                xs: 213,
                sm: 320,
                md: 427,
              },

              overflow: 'hidden',
              borderRadius: 2,
              position: 'relative',

              bgcolor: '#111',
            }}
          >
            {/* imagem/video */}
            <Skeleton
              variant="rectangular"
              animation="wave"
              width="100%"
              height="100%"
              sx={{
                position: 'absolute',
                inset: 0,
              }}
            />

            {/* badge topo */}
            <Skeleton
              variant="rounded"
              width={45}
              height={20}
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                borderRadius: 1,
              }}
            />

            {/* icon topo */}
            <Skeleton
              variant="circular"
              width={28}
              height={28}
              sx={{
                position: 'absolute',
                top: 10,
                left: 10,
              }}
            />

            {/* gradiente inferior */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 2,
              }}
            >
              <Skeleton
                width="90%"
                height={28}
                sx={{ mb: 1 }}
              />

              <Skeleton
                width="100%"
                height={16}
              />

              <Skeleton
                width="75%"
                height={16}
              />
            </Box>
          </Paper>
        </Box>
      ))}
    </Box>
  )
}