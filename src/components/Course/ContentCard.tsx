'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Box, Typography } from '@mui/material'
import { FileText, PlayCircle } from 'lucide-react'

import { PostDTO } from '../../../types/post'
import { getSubjectLabels, getLevelLabel } from '../../../utils/labels'
import { getCloudinaryBlur } from '../../../utils/Post/CloudinaryBlur'
import SavePostButton from '../Post/SavePostButton'

interface Props {
  post: PostDTO
}

export default function ContentCard({ post }: Props) {
  const isVideo = post.contentType === 'video'
  const contentHref = `/content/${post._id}`

  return (
    <Box
      sx={{
        minWidth: 0,
        transition: 'background-color 0.18s ease',

        '@media (hover: hover) and (pointer: fine)': {
          mx: -1,
          p: 1,
          borderRadius: 2,

          '&:hover': {
            bgcolor: '#f1f5f9',
          },
        },

        '&:hover .content-card-title': {
          color: '#c2410c',
        },

        '&:hover .content-card-image': {
          transform: 'scale(1.025)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.1,
          minWidth: 0,
        }}
      >
        <Link
          href={contentHref}
          scroll={false}
          style={{ color: 'inherit', textDecoration: 'none' }}
          aria-label={`Abrir conteudo: ${post.title}`}
        >
          <Box
            sx={{
              position: 'relative',
              aspectRatio: '16 / 9',
              width: '100%',
              overflow: 'hidden',
              bgcolor: '#e2e8f0',
              cursor: 'pointer',

              '@media (hover: hover) and (pointer: fine)': {
                borderRadius: 1.5,
              },
            }}
          >
            <Image
              className="content-card-image"
              src={post.imageLink || '/placeholder.jpg'}
              alt={post.title}
              fill
              placeholder={post.imageLink ? 'blur' : 'empty'}
              blurDataURL={
                post.imageLink ? getCloudinaryBlur(post.imageLink) : undefined
              }
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              style={{
                objectFit: 'cover',
                transition: 'transform 0.22s ease',
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                right: 8,
                bottom: 8,
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 0.45,
                px: 0.8,
                py: 0.35,
                bgcolor: 'rgba(0,0,0,0.78)',
                color: '#fff',
                fontSize: 11,
                fontWeight: 700,
                lineHeight: 1,
                textTransform: 'uppercase',
              }}
            >
              {isVideo ? <PlayCircle size={13} /> : <FileText size={13} />}
              {isVideo ? 'Video' : 'Doc'}
            </Box>
          </Box>
        </Link>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto',
            gap: 0.8,
            alignItems: 'start',
            minWidth: 0,
            pb: 0.5,
          }}
        >
          <Link
            href={contentHref}
            scroll={false}
            style={{
              color: 'inherit',
              display: 'block',
              minWidth: 0,
              textDecoration: 'none',
            }}
            aria-label={`Abrir conteudo: ${post.title}`}
          >
            <Box
              display="flex"
              flexDirection="column"
              gap={0.45}
              sx={{ minWidth: 0 }}
            >
              <Typography
                className="content-card-title"
                variant="subtitle1"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  minHeight: 44,
                  color: '#111827',
                  fontSize: 15,
                  fontWeight: 700,
                  lineHeight: '22px',
                  textOverflow: 'ellipsis',
                  transition: 'color 0.18s ease',
                }}
              >
                {post.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: '#64748b',
                  fontSize: 13,
                  lineHeight: '18px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {getSubjectLabels(post.subjectIds, post.subjectId)} &bull;{' '}
                {getLevelLabel(post.level)}
              </Typography>
            </Box>
          </Link>

          <SavePostButton
            postId={post._id}
            title={post.title}
            sx={{
              width: 34,
              height: 34,
              mt: -0.4,
              flexShrink: 0,
              bgcolor: 'transparent',
              borderColor: 'transparent',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#f1f5f9',
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}