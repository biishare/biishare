'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {
  ArrowLeft,
  Bookmark,
  Clock3,
  FileCheck2,
  FileImage,
  GraduationCap,
  LogOut,
  Send,
  ShieldCheck,
  Upload,
} from 'lucide-react'

import {
  AuthUser,
  clearAuthSession,
  getCurrentUser,
  getAuthSession,
  logoutUser,
  saveAuthUser,
} from '../../../services/auth.service'
import { getLoginRedirectPath } from '../../../constants/features'
import { getSavedPosts } from '../../../services/post.service'
import { getSavedToques } from '../../../services/short.service'
import { getContentTypeLabel, getLevelLabel, getSubjectLabels } from '../../../utils/labels'
import { getCloudinaryBlur } from '../../../utils/Post/CloudinaryBlur'
import ProfileImageUploader from './ProfileImageUploader'
import SavePostButton from '../Post/SavePostButton'
import SaveToqueButton from '../Toque/SaveToqueButton'
import { ToquesCard } from '../Toque/Toques'

type ProfileSection = 'saved' | 'creator'

type CreatorApplicationRecord = {
  workDescription: string
  publicName: string
  verificationCode: string
  verificationPhotoName: string
  submittedAt: string
  status: 'pending'
}

const sectionCards = [
  {
    id: 'saved' as const,
    title: 'Guardados',
    icon: Bookmark,
  },
]

function createCreatorVerificationCode() {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `BII-${random.slice(0, 3)}-${random.slice(3)}`
}

export default function ProfileClient({
  expectedUsername,
  initialUser,
  redirectToUsername = false,
}: {
  expectedUsername?: string
  initialUser?: AuthUser
  redirectToUsername?: boolean
}) {
  const router = useRouter()
  const [authUser, setAuthUser] = useState<AuthUser | null>(initialUser ?? null)
  const [isCheckingSession, setIsCheckingSession] = useState(!initialUser)
  const [activeSection, setActiveSection] = useState<ProfileSection>('saved')

  useEffect(() => {
    const redirectToCanonicalProfile = (user: AuthUser) => {
      if (redirectToUsername && user.username) {
        router.replace(`/profile/${user.username}`)
        return true
      }

      if (expectedUsername && user.username && user.username !== expectedUsername) {
        router.replace(`/profile/${user.username}`)
        return true
      }

      return false
    }

    if (initialUser) {
      saveAuthUser(initialUser)
      setAuthUser(initialUser)
      setIsCheckingSession(false)
      redirectToCanonicalProfile(initialUser)
      return
    }

    const cachedSession = getAuthSession()

    if (cachedSession?.user) {
      setAuthUser(cachedSession.user)
    }

    getCurrentUser()
      .then((user) => {
        saveAuthUser(user)
        setAuthUser(user)
        redirectToCanonicalProfile(user)
      })
      .catch(() => {
        clearAuthSession()
        router.replace(getLoginRedirectPath())
      })
      .finally(() => setIsCheckingSession(false))
  }, [expectedUsername, initialUser, redirectToUsername, router])

  const handleLogout = () => {
    logoutUser()
      .catch(() => undefined)
      .finally(() => {
        clearAuthSession()
        setAuthUser(null)
        router.replace(getLoginRedirectPath())
        router.refresh()
      })
  }

  if (isCheckingSession || !authUser) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <Paper
          elevation={0}
          sx={{
            border: '1px solid #e5e7eb',
            borderRadius: 3,
            p: { xs: 3, md: 5 },
            background: '#fff',
          }}
        >
          <Typography fontWeight={900}>A verificar sessao...</Typography>
          <Typography color="text.secondary" mt={0.5}>
            Aguarde um momento.
          </Typography>
        </Paper>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: { xs: 1.5, lg: 2 },
          alignItems: 'stretch',
        }}
      >
        <ProfileHero
          avatarUrl={authUser.avatarUrl}
          coverUrl={authUser.coverUrl}
          email={authUser.email}
          name={authUser.name}
          onLogout={handleLogout}
          onUserUpdated={setAuthUser}
          username={authUser.username}
        />
      </Box>

      {activeSection !== 'creator' && (
        <>

          <Box
            sx={{
              mt: 2,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'minmax(260px, 360px)' },
              gap: { xs: 1, md: 1.2 },
            }}
          >
            {sectionCards.map((card) => (
              <SectionCard
                key={card.id}
                active={activeSection === card.id}
                icon={card.icon}
                title={card.title}
                onClick={() => setActiveSection(card.id)}
              />
            ))}
          </Box>
        </>
      )}
      <Paper
        elevation={0}
        sx={{
          mt: 2,
          border: '1px solid #e5e7eb',
          borderRadius: 2,
          p: { xs: 1.5, md: 2 },
          background: '#fff',
        }}
      >
        {activeSection === 'saved' && <SavedPosts />}
        {activeSection === 'creator' && (
          <CreatorApplicationDemo authUser={authUser} onBack={() => setActiveSection('saved')} />
        )}
      </Paper>
    </main>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" justifyContent="space-between" gap={2}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={900} textAlign="right">
        {value}
      </Typography>
    </Stack>
  )
}

function ProfileHero({
  avatarUrl,
  coverUrl,
  email,
  name,
  onLogout,
  onUserUpdated,
  username,
}: {
  avatarUrl?: string
  coverUrl?: string
  email: string
  name: string
  onLogout: () => void
  onUserUpdated: (user: AuthUser) => void
  username?: string
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: 174, md: 190 },
        height: '100%',
        borderRadius: 2,
        p: { xs: 2, md: 2.5 },
        border: '1px solid #e5e7eb',
        background: coverUrl
          ? `linear-gradient(90deg, rgba(15,23,42,.82), rgba(15,23,42,.28)), url(${coverUrl}) center/cover`
          : 'linear-gradient(135deg, #ffffff 0%, #ffffff 58%, #fffaf3 100%)',

        '&:hover .profile-cover-action, &:focus-within .profile-cover-action': {
          opacity: 1,
          pointerEvents: 'auto',
        },
      }}
    >
      <ProfileImageUploader
        slot="cover"
        onUserUpdated={onUserUpdated}
      />

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        gap={{ xs: 1.6, md: 2.2 }}
        sx={{ position: 'relative', zIndex: 1 }}
      >
        <Box
          sx={{
            position: 'relative',
            flexShrink: 0,

            '&:hover .profile-avatar-action, &:focus-within .profile-avatar-action': {
              opacity: 1,
              pointerEvents: 'auto',
            },
          }}
        >
          <Avatar
            src={avatarUrl}
            alt={name}
            sx={{
              width: { xs: 88, md: 112 },
              height: { xs: 88, md: 112 },
              border: coverUrl
                ? '3px solid rgba(255,255,255,.9)'
                : '3px solid #fff',
              background: 'linear-gradient(145deg,#475569,#111827)',
              boxShadow: '0 18px 38px rgba(15,23,42,.18)',
              overflow: 'hidden',

              '& .MuiAvatar-img': {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              },
            }}
          >
            {!avatarUrl && (
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',

                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '22%',
                    left: '50%',
                    width: '34%',
                    height: '34%',
                    borderRadius: '50%',
                    background: '#fff',
                    transform: 'translateX(-50%)',
                  },

                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: '18%',
                    right: '18%',
                    bottom: '-4%',
                    height: '48%',
                    borderRadius: '50% 50% 0 0',
                    background: '#fff',
                  },
                }}
              />
            )}
          </Avatar>

          <ProfileImageUploader
            slot="avatar"
            onUserUpdated={onUserUpdated}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontSize: { xs: 26, md: 31 },
              fontWeight: 900,
              lineHeight: 1.05,
              color: coverUrl ? '#fff' : '#111827',
              pr: { xs: 10, md: 0 },
            }}
          >
            {name}
          </Typography>

          <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap" mt={0.8}>
            {username && (
              <Chip
                size="small"
                label={`@${username}`}
                sx={{
                  height: 24,
                  borderRadius: 1.5,
                  fontWeight: 800,
                  color: coverUrl ? '#fff' : '#ea580c',
                  background: coverUrl ? 'rgba(255,255,255,.16)' : '#fff7ed',
                }}
              />
            )}
            <Typography
              color={coverUrl ? 'rgba(255,255,255,.82)' : 'text.secondary'}
              fontSize={14}
            >
              {email}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            gap={1}
            flexWrap="wrap"
            sx={{
              mt: 1.8,
            }}
          >

            <Button
              variant="text"
              onClick={onLogout}
              startIcon={<LogOut size={16} />}
              sx={{
                height: 38,
                px: 1.25,
                borderRadius: 1.5,
                textTransform: 'none',
                fontWeight: 800,
                color: coverUrl ? 'rgba(255,255,255,.84)' : '#64748b',
                border: '1px solid',
                borderColor: coverUrl ? 'rgba(255,255,255,.18)' : '#e5e7eb',
                background: coverUrl ? 'rgba(255,255,255,.08)' : 'transparent',

                '&:hover': {
                  color: coverUrl ? '#fff' : '#334155',
                  borderColor: coverUrl ? 'rgba(255,255,255,.32)' : '#cbd5e1',
                  background: coverUrl ? 'rgba(255,255,255,.14)' : '#f8fafc',
                },

                '& .MuiButton-startIcon': {
                  mr: 0.7,
                },
              }}
            >
              Sair
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  )
}

function SectionCard({
  active,
  icon: Icon,
  title,
  onClick,
}: {
  active: boolean
  icon: typeof Bookmark
  title: string
  onClick: () => void
}) {
  return (
    <Paper
      elevation={0}
      component="button"
      onClick={onClick}
      sx={{
        minHeight: 74,
        width: '100%',
        border: active ? '1px solid #fb923c' : '1px solid #dbe3ef',
        borderRadius: 2,
        p: 1.4,
        cursor: 'pointer',
        background: active ? '#fff3e6' : '#f8fafc',
        textAlign: 'left',
        transition: 'all .2s ease',
        boxShadow: active ? '0 8px 20px rgba(249, 115, 22, .08)' : 'none',

        '&:hover': {
          borderColor: '#fdba74',
          background: active ? '#ffedd5' : '#fff7ed',
          boxShadow: '0 8px 20px rgba(15, 23, 42, .06)',
        },

        '&:focus-visible': {
          outline: '2px solid #fb923c',
          outlineOffset: 2,
        },
      }}
    >
      <Stack direction="row" alignItems="center" gap={1.2} height="100%">
        <Box
          sx={{
            width: 40,
            height: 40,
            display: 'grid',
            placeItems: 'center',
            borderRadius: 2,
            color: active ? '#ea580c' : '#64748b',
            background: active ? '#ffedd5' : '#eef2f7',
            flexShrink: 0,
          }}
        >
          <Icon
            size={24}
            fill={active ? 'rgba(249,115,22,.14)' : 'rgba(100,116,139,.1)'}
          />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography fontWeight={900} fontSize={15} color="#111827" noWrap>
            {title}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  )
}

function SavedPosts() {
  const {
    data: savedPostsData,
    isLoading: isLoadingPosts,
    isError: isPostsError,
  } = useQuery({
    queryKey: ['saved-posts'],
    queryFn: () => getSavedPosts({ limit: 50 }),
  })
  const {
    data: savedToquesData,
    isLoading: isLoadingToques,
    isError: isToquesError,
  } = useQuery({
    queryKey: ['saved-toques'],
    queryFn: () => getSavedToques({ limit: 50 }),
  })

  const savedItems = savedPostsData?.data ?? []
  const savedToques = savedToquesData?.data ?? []
  const isLoading = isLoadingPosts || isLoadingToques
  const hasError = isPostsError || isToquesError

  return (
    <Box>
      <Typography fontSize={22} fontWeight={900}>
        Guardados
      </Typography>

      {isLoading && (
        <Stack alignItems="center" py={5}>
          <CircularProgress size={28} />
        </Stack>
      )}

      {hasError && (
        <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
          Nao foi possivel carregar todos os guardados.
        </Alert>
      )}

      {!isLoading && !hasError && savedItems.length === 0 && savedToques.length === 0 && (
        <Paper elevation={0} sx={{ mt: 2, border: '1px solid #e5e7eb', borderRadius: 2, p: 2 }}>
          <Typography fontWeight={850}>Ainda nao guardaste conteudos.</Typography>
          <Typography color="text.secondary" fontSize={14} mt={0.5}>
            Quando guardares posts ou toques, eles vao aparecer aqui.
          </Typography>
        </Paper>
      )}

      {savedItems.length > 0 && (
        <>
          <Typography fontSize={18} fontWeight={900} mt={2}>
            Posts
          </Typography>

          <Box
            sx={{
              mt: 1,
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                lg: 'repeat(3, minmax(0, 1fr))',
              },
              gap: 1.2,
            }}
          >
            {savedItems.map((item) => {
              const post = item.post
              const previewImage = post.imageLink || '/opengraph-image.jpg'

              return (
                <Paper
                  key={item.id}
                  elevation={0}
                  sx={{
                    border: '1px solid #e5e7eb',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <Link
                    href={`/content/${post._id}`}
                    scroll={false}
                    style={{ color: 'inherit', textDecoration: 'none' }}
                    aria-label={`Abrir conteudo: ${post.title}`}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        aspectRatio: '16 / 9',
                        width: '100%',
                        bgcolor: '#e2e8f0',
                      }}
                    >
                      <Image
                        src={previewImage}
                        alt={`Previsualizacao de ${post.title}`}
                        fill
                        placeholder={post.imageLink ? 'blur' : 'empty'}
                        blurDataURL={
                          post.imageLink ? getCloudinaryBlur(post.imageLink) : undefined
                        }
                        sizes="(max-width: 900px) 100vw, 33vw"
                        style={{
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  </Link>

                  <Box sx={{ p: 1.5 }}>
                    <Stack direction="row" justifyContent="space-between" gap={1} alignItems="center">
                      <Chip size="small" label={getContentTypeLabel(post.contentType)} />
                      <Typography fontSize={12} color="text.secondary">
                        Guardado {formatProfileDate(item.savedAt)}
                      </Typography>
                    </Stack>

                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1fr) auto',
                        gap: 0.8,
                        alignItems: 'start',
                        mt: 1.2,
                      }}
                    >
                      <Link
                        href={`/content/${post._id}`}
                        scroll={false}
                        style={{
                          color: 'inherit',
                          display: 'block',
                          minWidth: 0,
                          textDecoration: 'none',
                        }}
                        aria-label={`Abrir conteudo: ${post.title}`}
                      >
                        <Typography fontWeight={900} fontSize={15} lineHeight={1.35}>
                          {post.title}
                        </Typography>
                      </Link>

                      <SavePostButton
                        postId={post._id}
                        title={post.title}
                        initialSaved
                        sx={{
                          width: 34,
                          height: 34,
                          mt: -0.6,
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

                    <Typography color="text.secondary" fontSize={14} mt={0.4}>
                      {getSubjectLabels(post.subjectIds, post.subjectId)} - {getLevelLabel(post.level)}
                    </Typography>

                    <Typography color="text.secondary" fontSize={12} mt={0.8}>
                      Publicado {formatProfileDate(post.createdAt)}
                    </Typography>
                  </Box>
                </Paper>
              )
            })}
          </Box>
        </>
      )}

      {savedToques.length > 0 && (
        <>
          <Typography fontSize={18} fontWeight={900} mt={savedItems.length > 0 ? 3 : 2}>
            Toques
          </Typography>

          <Box
            sx={{
              mt: 1,
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                md: 'repeat(3, minmax(0, 1fr))',
                lg: 'repeat(4, minmax(0, 1fr))',
              },
              gap: 1.2,
            }}
          >
            {savedToques.map((item) => {
              const toque = item.toque

              return (
                <Paper
                  key={item.id}
                  elevation={0}
                  sx={{
                    border: '1px solid #e5e7eb',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <Link
                    href={`/toque/${toque._id}`}
                    scroll={false}
                    style={{ color: 'inherit', textDecoration: 'none' }}
                    aria-label={`Abrir toque: ${toque.title}`}
                  >
                    <ToquesCard
                      item={toque}
                      preload="metadata"
                      sx={{
                        borderRadius: 0,
                      }}
                    />
                  </Link>

                  <Box sx={{ p: 1.2 }}>
                    <Stack direction="row" justifyContent="space-between" gap={1} alignItems="center">
                      <Chip size="small" label={toque.mediaType === 'video' ? 'Video' : 'Imagem'} />
                      <Typography fontSize={12} color="text.secondary">
                        {formatProfileDate(item.savedAt)}
                      </Typography>
                    </Stack>

                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1fr) auto',
                        gap: 0.8,
                        alignItems: 'start',
                        mt: 1,
                      }}
                    >
                      <Link
                        href={`/toque/${toque._id}`}
                        scroll={false}
                        style={{
                          color: 'inherit',
                          display: 'block',
                          minWidth: 0,
                          textDecoration: 'none',
                        }}
                        aria-label={`Abrir toque: ${toque.title}`}
                      >
                        <Typography fontWeight={900} fontSize={14} lineHeight={1.35}>
                          {toque.title}
                        </Typography>
                      </Link>

                      <SaveToqueButton
                        toqueId={toque._id}
                        title={toque.title}
                        initialSaved
                        iconSize={18}
                        sx={{
                          width: 34,
                          height: 34,
                          mt: -0.6,
                          flexShrink: 0,
                          color: '#f97316',
                          bgcolor: 'transparent',
                          borderColor: 'transparent',
                          boxShadow: 'none',
                          backdropFilter: 'none',
                          '&:hover': {
                            bgcolor: '#fff7ed',
                          },
                          '&.Mui-disabled': {
                            color: '#f97316',
                            bgcolor: 'transparent',
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </Paper>
              )
            })}
          </Box>
        </>
      )}
    </Box>
  )
}

function formatProfileDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'recentemente'
  }

  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function CreatorApplicationDemo({
  authUser,
  onBack,
}: {
  authUser: AuthUser
  onBack: () => void
}) {
  const [application, setApplication] = useState<CreatorApplicationRecord | null>(null)
  const [verificationCode] = useState(() => createCreatorVerificationCode())
  const [formValues, setFormValues] = useState({
    workDescription: '',
    publicName: authUser.name,
    consentAccepted: false,
  })
  const [files, setFiles] = useState({
    verificationPhoto: null as File | null,
  })

  const canSubmit =
    formValues.workDescription.trim().length >= 3 &&
    formValues.publicName.trim().length >= 3 &&
    Boolean(files.verificationPhoto) &&
    formValues.consentAccepted

  const updateFile = (field: keyof typeof files, file: File | null) => {
    setFiles((current) => ({ ...current, [field]: file }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSubmit || !files.verificationPhoto) {
      return
    }

    setApplication({
      workDescription: formValues.workDescription.trim(),
      publicName: formValues.publicName.trim(),
      verificationCode,
      verificationPhotoName: files.verificationPhoto.name,
      submittedAt: 'Agora',
      status: 'pending',
    })
  }

  if (application) {
    return (
      <Box>
        <Button
          type="button"
          variant="text"
          size="small"
          startIcon={<ArrowLeft size={16} />}
          onClick={onBack}
          sx={{ mb: 1.2, borderRadius: 1.5, color: '#64748b', textTransform: 'none', fontWeight: 850 }}
        >
          Voltar ao perfil
        </Button>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          gap={1.5}
        >
          <Typography fontSize={22} fontWeight={900}>
            Pedido de conta de criador
          </Typography>

          <Chip
            icon={<Clock3 size={15} />}
            label="Em revisao"
            color="warning"
            sx={{ fontWeight: 900 }}
          />
        </Stack>

        <Box
          sx={{
            mt: 2,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.05fr .95fr' },
            gap: 1.5,
          }}
        >
          <Paper elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 2, p: 1.6 }}>
            <Stack direction="row" alignItems="center" gap={1} mb={1.4}>
              <GraduationCap size={21} color="#f97316" />
              <Typography fontWeight={900}>Dados do criador</Typography>
            </Stack>

            <Stack spacing={1.1}>
              <InfoRow label="Nome publico" value={application.publicName} />
              <InfoRow label="O que fazes" value={application.workDescription} />
              <InfoRow label="Estado" value="Pendente" />
              <InfoRow label="Enviado" value={application.submittedAt} />
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 2, p: 1.6 }}>
            <Stack direction="row" alignItems="center" gap={1} mb={1.4}>
              <ShieldCheck size={21} color="#16a34a" />
              <Typography fontWeight={900}>Validacao enviada</Typography>
            </Stack>

            <Stack spacing={1}>

              <DocumentPreview label="Codigo de verificacao" value={application.verificationCode} />
              <DocumentPreview label="Foto segurando o codigo" value={application.verificationPhotoName} />
            </Stack>
          </Paper>
        </Box>

        <Button
          variant="outlined"
          onClick={() => setApplication(null)}
          sx={{ mt: 2, borderRadius: 2, textTransform: 'none', fontWeight: 900 }}
        >
          Editar pedido
        </Button>
      </Box>
    )
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Button
        type="button"
        variant="text"
        size="small"
        startIcon={<ArrowLeft size={16} />}
        onClick={onBack}
        sx={{ mb: 1.2, borderRadius: 1.5, color: '#64748b', textTransform: 'none', fontWeight: 850 }}
      >
        Voltar ao perfil
      </Button>
      <Typography fontSize={22} fontWeight={900}>
        Pedido de conta de criador
      </Typography>

      <Box
        sx={{
          mt: 2,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 360px' },
          gap: 1.5,
        }}
      >
        <Paper elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 2, p: 1.6 }}>
          <Stack spacing={1.4}>
            <TextField
              label="O que fazes"
              value={formValues.workDescription}
              onChange={(event) =>
                setFormValues((current) => ({
                  ...current,
                  workDescription: event.target.value,
                }))
              }
              fullWidth
              multiline
              minRows={3}
              inputProps={{ maxLength: 240 }}
            />

            <TextField
              label="Nome publico"
              value={formValues.publicName}
              onChange={(event) =>
                setFormValues((current) => ({
                  ...current,
                  publicName: event.target.value,
                }))
              }
              fullWidth
              inputProps={{ maxLength: 100 }}
            />

          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 2, p: 1.6 }}>
          <Stack direction="row" alignItems="center" gap={1} mb={1.2}>
            <FileCheck2 size={21} color="#f97316" />
            <Typography fontWeight={900}>Validacao por codigo</Typography>
          </Stack>

          <Stack spacing={1}>
            <Box
              sx={{
                border: '1px solid #fed7aa',
                borderRadius: 2,
                p: 1.2,
                backgroundColor: '#fff7ed',
              }}
            >
              <Typography color="text.secondary" fontSize={12} fontWeight={800}>
                Codigo de verificacao Biishare
              </Typography>
              <Typography fontSize={22} fontWeight={950} letterSpacing={0} color="#9a3412">
                {verificationCode}
              </Typography>
              <Typography color="text.secondary" fontSize={12} lineHeight={1.45}>
                Escreva o codigo em papel e envie uma foto segurando-o com as maos.
              </Typography>
            </Box>

            <FileUploadField
              label="Foto segurando o codigo"
              file={files.verificationPhoto}
              onChange={(file) => updateFile('verificationPhoto', file)}
            />
          </Stack>
        </Paper>
      </Box>

      <FormControlLabel
        sx={{ mt: 1.4, alignItems: 'flex-start' }}
        control={
          <Checkbox
            checked={formValues.consentAccepted}
            onChange={(event) =>
              setFormValues((current) => ({
                ...current,
                consentAccepted: event.target.checked,
              }))
            }
          />
        }
        label={
          <Typography fontSize={14} color="text.secondary" lineHeight={1.45}>
            Confirmo que a verificacao enviada pertence a mim e aceito a revisao da conta de criador.
          </Typography>
        }
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} gap={1} mt={1.4}>
        <Button
          type="submit"
          variant="contained"
          disabled={!canSubmit}
          startIcon={<Send size={17} />}
          sx={{
            height: 44,
            px: 2.2,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 900,
            background: 'linear-gradient(135deg,#f59e0b,#f97316)',
            boxShadow: 'none',
          }}
        >
          Enviar pedido
        </Button>
      </Stack>
    </Box>
  )
}

function FileUploadField({
  label,
  file,
  onChange,
  optional = false,
}: {
  label: string
  file: File | null
  onChange: (file: File | null) => void
  optional?: boolean
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) auto' },
        gap: 1,
        alignItems: 'center',
        border: '1px solid #e5e7eb',
        borderRadius: 2,
        p: 1,
      }}
    >
      <Stack direction="row" alignItems="center" gap={1} minWidth={0}>
        <FileImage size={18} color="#64748b" />
        <Box minWidth={0}>
          <Typography fontWeight={850} fontSize={14} noWrap>
            {label}{optional ? ' (opcional)' : ''}
          </Typography>
          <Typography color="text.secondary" fontSize={12} noWrap>
            {file ? file.name : 'Nenhum ficheiro selecionado'}
          </Typography>
        </Box>
      </Stack>

      <Button
        component="label"
        variant="outlined"
        size="small"
        startIcon={<Upload size={15} />}
        sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 850 }}
      >
        Escolher
        <input
          hidden
          accept="image/*"
          type="file"
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        />
      </Button>
    </Box>
  )
}

function DocumentPreview({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" alignItems="center" gap={1} minWidth={0}>
      <FileImage size={17} color="#64748b" />
      <Box minWidth={0}>
        <Typography color="text.secondary" fontSize={12}>
          {label}
        </Typography>
        <Typography fontWeight={850} fontSize={14} noWrap>
          {value}
        </Typography>
      </Box>
    </Stack>
  )
}
