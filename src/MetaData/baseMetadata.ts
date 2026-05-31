import { Metadata } from 'next'

type MetadataProps = {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article'
}

const DEFAULT_IMAGE = '/opengraph-image.jpg'

export function createMetadata({
  title,
  description,
  path = '',
  image = DEFAULT_IMAGE,
  type = 'website',
}: MetadataProps): Metadata {
  const url = `https://Biishare.com${path}`

  return {
    title,
    description,

    metadataBase: new URL('https://Biishare.com'),

    keywords: [
      'Biishare',
      'educação',
      'ciência',
      'tecnologia',
      'aprendizagem',
      'ensino digital',
    ],

    authors: [
      {
        name: 'Biishare',
      },
    ],

    creator: 'Biishare',

    openGraph: {
      type,
      title,
      description,
      url,
      siteName: 'Biishare',

      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      canonical: url,
    },

    icons: {
      icon: '/favicon.ico',
    },
  }
}