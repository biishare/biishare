'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Avatar, Box, Stack, Typography } from '@mui/material'
import { FileText, Image as ImageIcon, ListVideo, PlayCircle } from 'lucide-react'

import { PostContentType, PostDTO } from '../../../types/post'
import { getSubjectLabels, getLevelLabel } from '../../../utils/labels'
import { getCloudinaryBlur } from '../../../utils/Post/CloudinaryBlur'
import SavePostButton from '../Post/SavePostButton'

interface Props {
  post: PostDTO
}

const LEGACY_CREATOR_NAME = 'Saber Academico'

export default function ContentCard({ post }: Props) {
  const contentHref = `/content/${post._id}`
  const creatorName = getPostCreatorName(post)
  const creatorAvatar = post.creator?.avatarUrl
  const badge = getContentBadge(post.contentType)
  const previewImage = getPostPreviewImage(post)

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
          color: '#0f172a',
        },

        '&:hover .content-card-image': {
          transform: 'scale(1.025)',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.05, minWidth: 0 }}>
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
              src={previewImage}
              alt={post.title}
              fill
              placeholder={previewImage.startsWith('http') ? 'blur' : 'empty'}
              blurDataURL={previewImage.startsWith('http') ? getCloudinaryBlur(previewImage) : undefined}
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
                px: 0.85,
                py: 0.42,
                bgcolor: 'rgba(0,0,0,0.82)',
                color: '#fff',
                fontSize: 11,
                fontWeight: 800,
                lineHeight: 1,
                textTransform: 'uppercase',
              }}
            >
              {badge.icon}
              {badge.label}
            </Box>
          </Box>
        </Link>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '40px minmax(0, 1fr) 42px',
            gap: 1,
            alignItems: 'start',
            minWidth: 0,
            pb: 0.3,
          }}
        >
          <Avatar
            src={creatorAvatar}
            alt={creatorName}
            sx={{
              width: 38,
              height: 38,
              bgcolor: '#111827',
              color: '#fff',
              fontSize: 14,
              fontWeight: 900,
            }}
          >
            {getInitials(creatorName)}
          </Avatar>

          <Link
            href={contentHref}
            scroll={false}
            style={{ color: 'inherit', display: 'block', minWidth: 0, textDecoration: 'none' }}
            aria-label={`Abrir conteudo: ${post.title}`}
          >
            <Stack gap={0.25} sx={{ minWidth: 0 }}>
              <Typography
                className="content-card-title"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  minHeight: 44,
                  color: '#0f172a',
                  fontSize: 16,
                  fontWeight: 850,
                  lineHeight: '22px',
                  textOverflow: 'ellipsis',
                  transition: 'color 0.18s ease',
                }}
              >
                {post.title}
              </Typography>

              <Typography
                sx={{
                  color: '#64748b',
                  fontSize: 13.5,
                  fontWeight: 700,
                  lineHeight: '18px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {creatorName}
              </Typography>

              <Typography
                sx={{
                  color: '#64748b',
                  fontSize: 13,
                  lineHeight: '18px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {getSubjectLabels(post.subjectIds, post.subjectId)} &bull; {getLevelLabel(post.level)} &bull; {formatPostDate(post.createdAt)}
              </Typography>
            </Stack>
          </Link>

          <SavePostButton
            postId={post._id}
            title={post.title}
            iconSize={23}
            sx={{
              width: 42,
              height: 42,
              mt: -0.45,
              flexShrink: 0,
              bgcolor: 'transparent',
              borderColor: 'transparent',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#e2e8f0',
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}

function getPostCreatorName(post: PostDTO) {
  return post.creator?.name || LEGACY_CREATOR_NAME
}

function getPostPreviewImage(post: PostDTO) {
  if (post.imageLink) {
    return post.imageLink
  }

  if (post.contentType === 'image') {
    return post.images?.[0]?.url || '/placeholder.jpg'
  }

  return '/placeholder.jpg'
}

function getContentBadge(type: PostContentType) {
  if (type === 'document') {
    return { label: 'Doc', icon: <FileText size={14} /> }
  }

  if (type === 'image') {
    return { label: 'Imagem', icon: <ImageIcon size={14} /> }
  }

  if (type === 'playlist') {
    return { label: 'Playlist', icon: <ListVideo size={14} /> }
  }

  return { label: 'Video', icon: <PlayCircle size={14} /> }
}

function getInitials(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function formatPostDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Publicado recentemente'
  }

  return `Publicado em ${new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)}`
}
