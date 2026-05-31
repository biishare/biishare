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

export { termsMetadata as metadata }
from '@/MetaData/pages/terms'

export default function TermsOfServicePage() {
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
                        Termos de Serviço
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
                                Estes Termos de Serviço regem o uso da plataforma Biishare.
                                Ao utilizar a plataforma, o utilizador concorda com estas condições.
                            </Typography>
                        </Box>

                        <Divider />

                        <Box>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                2. Utilização da plataforma
                            </Typography>

                            <Typography color="text.secondary" lineHeight={1.8}>
                                A Biishare disponibiliza conteúdos educativos para fins de aprendizagem.
                                O utilizador compromete-se a utilizar a plataforma de forma responsável,
                                sem atividades abusivas, ilegais ou que prejudiquem o sistema.
                            </Typography>
                        </Box>

                        <Divider />

                        <Box>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                3. Conteúdos educativos
                            </Typography>

                            <Typography color="text.secondary" lineHeight={1.8}>
                                A plataforma fornece vídeos, documentos, imagens e outros materiais educativos.
                                Estes conteúdos têm caráter informativo e educativo, não substituindo ensino oficial.
                            </Typography>
                        </Box>

                        <Divider />

                        <Box>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                4. Direitos autorais
                            </Typography>

                            <Typography color="text.secondary" lineHeight={1.8}>
                                A Biishare respeita rigorosamente os direitos de autor.
                                Todo o conteúdo procura respeitar os criadores originais.
                                Caso exista violação de direitos autorais, o conteúdo será removido após análise e confirmação.
                            </Typography>
                        </Box>

                        <Divider />

                        <Box>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                5. Responsabilidades do utilizador
                            </Typography>

                            <Typography color="text.secondary" lineHeight={1.8}>
                                O utilizador compromete-se a não:
                                publicar conteúdo ilegal, violar direitos de terceiros,
                                tentar invadir sistemas ou prejudicar a plataforma.
                            </Typography>
                        </Box>

                        <Divider />

                        <Box>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                6. Disponibilidade do serviço
                            </Typography>

                            <Typography color="text.secondary" lineHeight={1.8}>
                                A Biishare procura manter a plataforma disponível de forma contínua,
                                mas não garante ausência total de interrupções ou falhas técnicas.
                            </Typography>
                        </Box>

                        <Divider />

                        <Box>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                7. Limitação de responsabilidade
                            </Typography>

                            <Typography color="text.secondary" lineHeight={1.8}>
                                A Biishare não é responsável por decisões tomadas com base nos conteúdos da plataforma.
                                O uso dos conteúdos é da responsabilidade do utilizador.
                            </Typography>
                        </Box>

                        <Divider />

                        <Box>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                8. Alterações aos termos
                            </Typography>

                            <Typography color="text.secondary" lineHeight={1.8}>
                                A Biishare pode atualizar estes Termos de Serviço a qualquer momento.
                                Recomenda-se a consulta regular desta página.
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