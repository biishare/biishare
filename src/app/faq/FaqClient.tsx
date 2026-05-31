'use client'

import {
    Box,
    Container,
    Typography,
    Paper,
    Stack,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material'

import { ChevronDown, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'



export default function FaqPage() {
    const router = useRouter()

    const faqs = [
        {
            q: 'O que é a Biishare?',
            a: 'A Biishare é uma plataforma educativa digital que disponibiliza vídeos, documentos, imagens e materiais de apoio para ajudar estudantes a aprender de forma simples e acessível.',
        },
        {
            q: 'A Biishare é gratuita?',
            a: 'Sim. A maioria dos conteúdos da Biishare é gratuita e acessível a todos os utilizadores.',
        },
        {
            q: 'Preciso criar conta para usar a plataforma?',
            a: 'Depende da funcionalidade. Alguns conteúdos podem ser acessados sem conta, mas recursos personalizados podem exigir registo.',
        },
        {
            q: 'Que tipo de conteúdos a Biishare oferece?',
            a: 'Vídeos educativos, documentos de estudo, imagens explicativas, shorts educativos e materiais de apoio escolar.',
        },
        {
            q: 'O conteúdo é confiável?',
            a: 'Sim. O conteúdo é preparado com foco educativo e revisão de qualidade, baseado em fontes seguras e conhecimento académico.',
        },
        {
            q: 'A Biishare respeita direitos autorais?',
            a: 'Sim. A Biishare respeita rigorosamente os direitos autorais. Conteúdos que violem direitos de terceiros são removidos após verificação.',
        },
        {
            q: 'Como posso reportar conteúdo protegido por direitos autorais?',
            a: 'Deves entrar em contacto com a plataforma, indicando o link do conteúdo, descrição da violação e prova de propriedade quando aplicável.',
        },
        {
            q: 'Posso enviar o meu próprio conteúdo?',
            a: 'Sim. Em breve será possível submeter conteúdos educativos para revisão e possível publicação.',
        },
        {
            q: 'A Biishare guarda os meus dados pessoais?',
            a: 'A Biishare apenas recolhe dados essenciais para funcionamento da plataforma e não vende dados pessoais a terceiros.',
        },
        {
            q: 'Posso usar os conteúdos fora da plataforma?',
            a: 'Os conteúdos podem ser usados para fins educativos pessoais. Uso comercial ou redistribuição deve respeitar direitos autorais.',
        },
        {
            q: 'Como posso contactar a Biishare?',
            a: 'Através dos canais oficiais da plataforma .',
        },
    ]

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
                <Stack spacing={1} sx={{ mb: 5, textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight={800}>
                        Perguntas Frequentes
                    </Typography>

                    <Typography color="text.secondary">
                        Biishare — Suporte e dúvidas comuns
                    </Typography>
                </Stack>

                {/* FAQ CARD */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        borderRadius: 4,
                        border: '1px solid #eee',
                        backgroundColor: '#fff',
                    }}
                >
                    <Stack spacing={1}>
                        {faqs.map((item, index) => (
                            <Accordion
                                key={index}
                                disableGutters
                                elevation={0}
                                sx={{
                                    borderBottom: '1px solid #f0f0f0',
                                    '&:before': { display: 'none' },
                                }}
                            >
                                <AccordionSummary expandIcon={<ChevronDown />}>
                                    <Typography fontWeight={600}>
                                        {item.q}
                                    </Typography>
                                </AccordionSummary>

                                <AccordionDetails>
                                    <Typography color="text.secondary" lineHeight={1.8}>
                                        {item.a}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
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