import { Button, Stack } from '@mui/material'

import { IconFacebook } from '../IconFacebook/IconFacebook'
import { IconGoogle } from '../IconGoogle/IconGoogle'

export default function SocialAuthActions() {
  return (
    <Stack spacing={1.2}>
      <Button
        component="a"
        href="/api/auth/google"
        variant="outlined"
        size="large"
        fullWidth
        startIcon={<IconGoogle />}
        sx={{
          height: 48,
          borderRadius: 2,
          borderColor: '#d1d5db',
          color: '#111827',
          fontWeight: 900,
          textTransform: 'none',
          '&:hover': {
            borderColor: '#9ca3af',
            backgroundColor: '#f9fafb',
          },
        }}
      >
        Iniciar sessao com Google
      </Button>

      <Button
        component="a"
        href="/api/auth/facebook"
        variant="contained"
        size="large"
        fullWidth
        startIcon={<IconFacebook />}
        sx={{
          height: 48,
          borderRadius: 2,
          bgcolor: '#1877f2',
          color: '#fff',
          fontWeight: 900,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            bgcolor: '#166fe5',
            boxShadow: 'none',
          },
        }}
      >
        Iniciar sessao com Facebook
      </Button>
    </Stack>
  )
}
