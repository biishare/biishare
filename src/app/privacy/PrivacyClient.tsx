'use client'

import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  IconButton,
  Divider,
} from '@mui/material'

import { Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

export { privacyMetadata as metadata }
from '@/MetaData/pages/privacy'
export default function PrivacyPolicyPage() {
  const router = useRouter()

  return (
    <Box
      sx={{
        py: 10,
        minHeight: '100vh',
        backgroundColor: '#fafafa',
      }}
    >
      <Container maxWidth="md">

        {/* HEADER */}
        <Stack spacing={1} sx={{ mb: 5 }}>
          <Typography variant="h3" fontWeight={800}>
            Política de Privacidade
          </Typography>

          <Typography color="text.secondary">
            Biishare — Última atualização: 24 de Maio de 2026
          </Typography>
        </Stack>

        {/* CONTENT */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: '1px solid #eee',
            backgroundColor: '#fff',
          }}
        >
          <Stack spacing={4}>

            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                1. Introdução
              </Typography>

              <Typography color="text.secondary" lineHeight={1.8}>
                A Biishare respeita a privacidade dos seus utilizadores e está comprometida
                com a proteção dos dados pessoais, bem como com o respeito pelos direitos autorais
                e propriedade intelectual.
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                2. Dados que recolhemos
              </Typography>

              <Typography color="text.secondary" lineHeight={1.8}>
                Podemos recolher dados de navegação, informações técnicas do dispositivo
                e interações com a plataforma. Não recolhemos dados sensíveis sem consentimento.
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                3. Utilização dos dados
              </Typography>

              <Typography color="text.secondary" lineHeight={1.8}>
                Os dados são utilizados para melhorar a experiência do utilizador,
                otimizar conteúdos educativos e garantir o funcionamento da plataforma.
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                4. Direitos autorais
              </Typography>

              <Typography color="text.secondary" lineHeight={1.8}>
                A Biishare valoriza e respeita rigorosamente os direitos de autor.
                Todo o conteúdo procura respeitar os criadores originais.
                Caso exista qualquer violação de direitos autorais, o conteúdo será analisado
                e removido rapidamente após confirmação.
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                5. Partilha de dados
              </Typography>

              <Typography color="text.secondary" lineHeight={1.8}>
                Não vendemos nem partilhamos dados pessoais com terceiros para fins comerciais.
                Apenas partilhamos dados quando exigido por lei ou para funcionamento técnico da plataforma.
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                6. Segurança
              </Typography>

              <Typography color="text.secondary" lineHeight={1.8}>
                Implementamos medidas técnicas e organizacionais para proteger os dados dos utilizadores,
                embora nenhum sistema seja totalmente seguro.
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                7. Direitos do utilizador
              </Typography>

              <Typography color="text.secondary" lineHeight={1.8}>
                O utilizador pode solicitar acesso, correção ou eliminação dos seus dados pessoais,
                quando aplicável.
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                8. Alterações
              </Typography>

              <Typography color="text.secondary" lineHeight={1.8}>
                Esta política pode ser atualizada periodicamente. Recomendamos consulta regular.
              </Typography>
            </Box>

          </Stack>
        </Paper>

        {/* HOME BUTTON */}
        <IconButton
          aria-label="Ir para página inicial"
          onClick={() => router.push('/')}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            backgroundColor: '#FF7A00',
            color: '#fff',
            width: 56,
            height: 56,
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            '&:hover': {
              backgroundColor: '#e66a00',
            },
          }}
        >
          <Home size={22} />
        </IconButton>

      </Container>
    </Box>
  )
}