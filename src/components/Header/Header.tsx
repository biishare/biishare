'use client'


import Link from 'next/link'
import { Box, Button } from '@mui/material'
import { Zap } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getShorts } from '../../../services/short.service'
import { Toque } from '../../../types/Toque'
import Image from 'next/image'


export default function Header() {
  const { data } = useQuery<{ data: Toque[] }>({
    queryKey: ['first-toque'],
    queryFn: () => getShorts({ limit: 1 }),
    staleTime: 1000 * 60 * 10,
  })

  const firstToque = data?.data?.[0]

  return (
    <header className="top-0 z-40 w-full border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-6 justify-between">
        {/* LOGO */}
        <Link href="/">
  <Image
    src="/logo.svg"
    alt="Biishare"
    width={90}
    height={36}
    priority
    style={{
      width:'auto',
      height:'32px'
    }}
  />
</Link>

        {/* BOTÃO TOQUES */}
        <Box>
            <Link
              href={`/toque`}
              style={{ textDecoration: 'none' }}
            >
              <Button
                startIcon={<Zap size={18} />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 2.2,
                  py: 1,
                  borderRadius: '999px',

                  color: '#fff',

                  background:
                    'linear-gradient(135deg,#f59e0b,#fb923c)',

                  boxShadow:
                    '0 8px 20px rgba(245,158,11,.25)',

                  transition: 'all .25s ease',

                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow:
                      '0 12px 28px rgba(245,158,11,.35)',
                    background:
                      'linear-gradient(135deg,#d97706,#f97316)',
                  },

                  '&:active': {
                    transform: 'scale(.97)',
                  },
                }}
              >
                Explorar Toques
              </Button>
            </Link>
        </Box>
      </div>
    </header>
  )
}

