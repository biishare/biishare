'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Box, Paper, Typography } from '@mui/material'
import { PlayCircle, FileText } from 'lucide-react'
import { PostDTO } from '../../../types/post'
import { getSubjectLabel, getContentTypeLabel, getLevelLabel } from '../../../utils/labels'
import { getCloudinaryBlur } from '../../../utils/Post/CloudinaryBlur'

interface Props {
  post: PostDTO
}

export default function ContentCard({ post }: Props) {
  const isVideo = post.contentType === 'video'

  return (
    <Link
      href={`/content/${post._id}`}
      scroll={false}
      style={{ textDecoration: 'none' }}
      aria-label={`Abrir conteúdo: ${post.title}`}
    >
      <Paper
        sx={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          backgroundColor: '#fff',
          transition: 'all 0.25s ease',
          cursor: 'pointer',

          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
            borderColor: '#FDBA74',
          },
        }}
      >
        {/* THUMBNAIL */}
        <Box sx={{ position: 'relative', aspectRatio: '16 / 9', width: '100%' }}>

          {/* BADGE */}
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              zIndex: 2,
              px: 1.2,
              py: 0.4,
              borderRadius: 1,
              fontSize: 12,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(6px)',
              color: '#fff',
            }}
          >
            {isVideo ? <PlayCircle size={14} /> : <FileText size={14} />}
            {isVideo ? 'Vídeo' : 'Documento'}
          </Box>

          <Image
            src={post.imageLink || '/placeholder.jpg'}
            alt={post.title}
            fill
            placeholder="blur"
            blurDataURL={
              post.imageLink
                ? getCloudinaryBlur(post.imageLink)
                : undefined
            }
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              objectFit: 'cover',
            }}
          />
        </Box>

        {/* CONTEÚDO */}
        <Box
          p={2}
          display="flex"
          flexDirection="column"
          gap={1}
        >
          {/* TÍTULO */}
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',

              minHeight: 48, // 🔥 ESSENCIAL
              lineHeight: '24px', // 🔥 garante consistência
            }}
          >
            {post.title}
          </Typography>

          {/* METADATA */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: 13,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {getSubjectLabel(post.subjectId)} • {post.year} • {getLevelLabel(post.level)}
          </Typography>

          {/* TIPO (MENOS REDUNDANTE) */}
          <Typography
            variant="body2"
            sx={{
              fontSize: 13,
              color: '#f59e0b',
              fontWeight: 500,
            }}
          >
            {isVideo ? 'Assistir aula' : 'Ler material'}
          </Typography>
        </Box>
      </Paper>
    </Link>
  )
}