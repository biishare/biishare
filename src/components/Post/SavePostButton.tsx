'use client'

import { useEffect, useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  CircularProgress,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar,
  Tooltip,
} from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import {
  Bookmark,
  Check,
  MoreVertical,
  Share2,
} from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  getSavedPostStatus,
  removeSavedPost,
  savePost,
} from '../../../services/post.service'
import {
  AUTH_SESSION_CHANGED_EVENT,
  clearAuthSession,
  getAuthSession,
  getCurrentUser,
  saveAuthUser,
} from '../../../services/auth.service'

interface SavePostButtonProps {
  postId: string
  title?: string
  initialSaved?: boolean
  sx?: SxProps<Theme>
  iconSize?: number
}

type FeedbackState = {
  open: boolean
  message: string
}

function isUnauthorizedError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    (error as { response?: { status?: number } }).response?.status === 401
  )
}

function getCurrentRedirectPath(pathname: string) {
  if (typeof window === 'undefined') {
    return pathname
  }

  return `${window.location.pathname}${window.location.search}`
}

function getShareUrl(postId: string) {
  if (typeof window === 'undefined') {
    return `/content/${postId}`
  }

  return new URL(`/content/${postId}`, window.location.origin).toString()
}

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  const textArea = document.createElement('textarea')
  textArea.value = value
  textArea.setAttribute('readonly', '')
  textArea.style.position = 'fixed'
  textArea.style.opacity = '0'
  document.body.appendChild(textArea)
  textArea.select()
  document.execCommand('copy')
  document.body.removeChild(textArea)
}

export default function SavePostButton({
  postId,
  title,
  initialSaved,
  sx,
  iconSize = 22,
}: SavePostButtonProps) {
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const [hasSession, setHasSession] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [feedback, setFeedback] = useState<FeedbackState>({
    open: false,
    message: '',
  })

  useEffect(() => {
    const updateSessionState = () => {
      setHasSession(Boolean(getAuthSession()))
    }

    updateSessionState()
    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, updateSessionState)

    return () => {
      window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, updateSessionState)
    }
  }, [])

  const sessionQuery = useQuery({
    queryKey: ['auth-session'],
    queryFn: getCurrentUser,
    enabled: !hasSession,
    retry: false,
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (!sessionQuery.data) {
      return
    }

    saveAuthUser(sessionQuery.data)
    setHasSession(true)
  }, [sessionQuery.data])

  useEffect(() => {
    if (!isUnauthorizedError(sessionQuery.error)) {
      return
    }

    clearAuthSession()
    setHasSession(false)
  }, [sessionQuery.error])

  const statusQueryKey = useMemo(
    () => ['saved-post-status', postId],
    [postId]
  )
  const { data, error: statusError, isFetching } = useQuery({
    queryKey: statusQueryKey,
    queryFn: () => getSavedPostStatus(postId),
    enabled: hasSession,
    retry: false,
    staleTime: 1000 * 60 * 5,
    initialData:
      initialSaved === undefined ? undefined : { saved: initialSaved },
  })

  useEffect(() => {
    if (!isUnauthorizedError(statusError)) {
      return
    }

    clearAuthSession()
    setHasSession(false)
    queryClient.removeQueries({ queryKey: statusQueryKey })
  }, [queryClient, statusError, statusQueryKey])

  const isSaved = data?.saved ?? initialSaved ?? false
  const shareUrl = useMemo(() => getShareUrl(postId), [postId])

  const mutation = useMutation({
    mutationFn: (nextSaved: boolean) =>
      nextSaved ? savePost(postId) : removeSavedPost(postId),
    onMutate: async (nextSaved) => {
      await queryClient.cancelQueries({ queryKey: statusQueryKey })
      const previousStatus = queryClient.getQueryData<{ saved: boolean }>(
        statusQueryKey
      )

      queryClient.setQueryData(statusQueryKey, { saved: nextSaved })

      return { previousStatus }
    },
    onSuccess: (response) => {
      queryClient.setQueryData(statusQueryKey, response)
      queryClient.invalidateQueries({ queryKey: ['saved-posts'] })
      setFeedback({
        open: true,
        message: response.saved
          ? 'Post guardado.'
          : 'Post removido dos guardados.',
      })
    },
    onError: (error, _nextSaved, context) => {
      queryClient.setQueryData(statusQueryKey, context?.previousStatus)

      if (isUnauthorizedError(error)) {
        clearAuthSession()
        setHasSession(false)
        router.push(
          `/login?redirect=${encodeURIComponent(getCurrentRedirectPath(pathname))}`
        )
        return
      }

      setFeedback({
        open: true,
        message: 'Nao foi possivel guardar este post. Tente novamente.',
      })
    },
  })

  const isBusy = mutation.isPending || (hasSession && isFetching)
  const menuOpen = Boolean(anchorEl)

  const handleOpenMenu = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleToggleSaved = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    handleCloseMenu()

    if (!hasSession) {
      router.push(
        `/login?redirect=${encodeURIComponent(getCurrentRedirectPath(pathname))}`
      )
      return
    }

    if (!isBusy) {
      mutation.mutate(!isSaved)
    }
  }

  const handleShare = async (event: MouseEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    handleCloseMenu()

    try {
      if (navigator.share) {
        await navigator.share({
          title: title || 'Biishare',
          url: shareUrl,
        })
        return
      }

      await copyToClipboard(shareUrl)
      setFeedback({
        open: true,
        message: 'Ligacao copiada.',
      })
    } catch (error) {
      if ((error as { name?: string })?.name === 'AbortError') {
        return
      }

      setFeedback({
        open: true,
        message: 'Nao foi possivel partilhar. Tente novamente.',
      })
    }
  }

  const saveLabel = isSaved ? 'Guardado' : 'Guardar'

  return (
    <>
      <Tooltip title="Mais opcoes">
        <span>
          <IconButton
            type="button"
            aria-label="Mais opcoes do post"
            aria-controls={menuOpen ? `post-actions-${postId}` : undefined}
            aria-expanded={menuOpen ? 'true' : undefined}
            aria-haspopup="menu"
            onClick={handleOpenMenu}
            sx={[
              {
                position: 'relative',
                width: 42,
                height: 42,
                bgcolor: 'rgba(255,255,255,0.96)',
                color: '#334155',
                border: '1px solid rgba(226,232,240,0.95)',
                boxShadow: '0 8px 22px rgba(15,23,42,0.14)',
                '&:hover': {
                  bgcolor: '#fff',
                  color: '#111827',
                },
                '&::after': isSaved
                  ? {
                      content: '""',
                      position: 'absolute',
                      right: 8,
                      bottom: 8,
                      width: 7,
                      height: 7,
                      borderRadius: '999px',
                      bgcolor: '#f97316',
                      border: '1px solid #fff',
                    }
                  : undefined,
              },
              ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
            ]}
          >
            <MoreVertical size={iconSize} strokeWidth={2.4} />
          </IconButton>
        </span>
      </Tooltip>

      <Menu
        id={`post-actions-${postId}`}
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              mt: 0.8,
              minWidth: 202,
              border: '1px solid #e2e8f0',
              borderRadius: 2,
              boxShadow: '0 18px 45px rgba(15,23,42,0.16)',
              overflow: 'hidden',
            },
          },
        }}
      >
        <MenuItem
          onClick={handleToggleSaved}
          disabled={isBusy}
          sx={{
            minHeight: 48,
            gap: 1,
            color: isSaved ? '#ea580c' : '#111827',
            '&.Mui-disabled': {
              opacity: 0.72,
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: '28px !important',
              color: isSaved ? '#f97316' : '#475569',
            }}
          >
            {isBusy ? (
              <CircularProgress size={18} color="inherit" />
            ) : isSaved ? (
              <Bookmark size={18} fill="currentColor" />
            ) : (
              <Bookmark size={18} />
            )}
          </ListItemIcon>
          <ListItemText
            primary={saveLabel}
            secondary={isSaved ? 'Clique para remover' : undefined}
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: 850,
            }}
            secondaryTypographyProps={{
              fontSize: 12,
              color: '#94a3b8',
            }}
          />
          {isSaved ? <Check size={16} /> : null}
        </MenuItem>

        <MenuItem
          onClick={handleShare}
          sx={{
            minHeight: 48,
            gap: 1,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: '28px !important',
              color: '#475569',
            }}
          >
            <Share2 size={18} />
          </ListItemIcon>
          <ListItemText
            primary="Partilhar"
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: 850,
            }}
          />
        </MenuItem>
      </Menu>

      <Snackbar
        open={feedback.open}
        autoHideDuration={2200}
        message={feedback.message}
        onClose={(_event, reason) => {
          if (reason === 'clickaway') {
            return
          }

          setFeedback((current) => ({
            ...current,
            open: false,
          }))
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        ContentProps={{
          sx: {
            bgcolor: '#111827',
            color: '#fff',
            borderRadius: 2,
            boxShadow: '0 18px 50px rgba(15,23,42,.22)',
            fontWeight: 800,
          },
        }}
      />
    </>
  )
}
