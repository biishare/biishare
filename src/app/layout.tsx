import './globals.css'
import { Providers } from './providers'
import Script from 'next/script'
import { Suspense } from 'react'
import { GA_ID } from '../../lib/analytics'
import AnalyticsTracker from '@/components/AnalyticsTracker/AnalyticsTracker'
import ScrollRestoration from '@/components/ScrollRestoration/ScrollRestoration'
import { createMetadata } from '@/MetaData/baseMetadata'

interface Props {
  children: React.ReactNode
}

export const metadata = createMetadata({
  title: 'Biishare',
  description:
    'A Biishare é uma plataforma que une entretenimento e aprendizado em uma experiência moderna, dinâmica e envolvente. Aqui o conhecimento ganha vida através de vídeos, imagens, documentos e conteúdos interactivos, tornando o estudo mais leve, acessível e interessante para estudantes e curiosos que querem aprender de forma diferente.',
})

export default function RootLayout({
  children,
}: Props) {
  return (
    <html lang="pt">
      <body>
        <Providers>
          <Suspense fallback={null}>
            <ScrollRestoration />
          </Suspense>
          {children}
        </Providers>

        {/* GA */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />

        <Script id="ga-script" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag(){ dataLayer.push(arguments); }

            window.gtag = gtag;

            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>

        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4705848499204860"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Analytics (sem Suspense) */}
        <AnalyticsTracker />
      </body>
    </html>
  )
}
