'use client'

import { Box, Paper, Skeleton } from '@mui/material'

export default function DetailContentSkeleton() {
  return (
    <Box
      sx={{
        px: { xs: 2, md: 6, lg: 10 },
        py: 4,
        maxWidth: 1400,
        mx: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3,
        }}
      >
        <Box>
          <Paper
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              background: '#000',
            }}
          >
            <Skeleton
              variant="rectangular"
              animation="wave"
              sx={{
                width: '100%',
                aspectRatio: '16 / 9',
                minHeight: {
                  xs: 220,
                  sm: 320,
                  md: 520,
                },
                bgcolor: 'rgba(255,255,255,.12)',
              }}
            />
          </Paper>

          <Box mt={2}>
            <Skeleton
              animation="wave"
              height={34}
              width="82%"
            />

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                mt: 1,
              }}
            >
              {[92, 76, 58, 88].map((width, index) => (
                <Skeleton
                  key={index}
                  variant="rounded"
                  animation="wave"
                  width={width}
                  height={24}
                  sx={{ borderRadius: 999 }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        <Paper
          sx={{
            borderRadius: 3,
            p: 2,
            height: 'fit-content',
            maxHeight: { md: '80vh' },
            overflow: 'hidden',
            position: 'sticky',
            top: 20,
          }}
        >
          <Skeleton
            animation="wave"
            height={28}
            width="64%"
            sx={{ mb: 2 }}
          />

          <Box
            sx={{
              border: '1px solid #fcd34d',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2.5,
                  py: 1.5,
                  borderBottom:
                    index === 5 ? 'none' : '1px solid #fed7aa',
                  bgcolor: index === 0 ? '#fef3c7' : '#fff',
                }}
              >
                {index === 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 4,
                      bgcolor: '#f59e0b',
                    }}
                  />
                )}

                <Skeleton
                  variant="circular"
                  animation="wave"
                  width={20}
                  height={20}
                  sx={{ flexShrink: 0 }}
                />

                <Skeleton
                  animation="wave"
                  height={18}
                  width="100%"
                />

                <Skeleton
                  animation="wave"
                  height={16}
                  width={34}
                  sx={{ flexShrink: 0 }}
                />
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>

      <Box mt={5}>
        <Skeleton
          variant="rounded"
          animation="wave"
          width={150}
          height={24}
          sx={{ mb: 1.5 }}
        />

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            overflow: 'hidden',
          }}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              animation="wave"
              sx={{
                flex: {
                  xs: '0 0 140px',
                  sm: '0 0 200px',
                  md: '0 0 240px',
                },
                aspectRatio: '9 / 16',
                borderRadius: 2,
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  )
}
