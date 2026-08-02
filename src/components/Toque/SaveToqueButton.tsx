'use client'

import { useEffect, useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  CircularProgress,
  IconButton,
  Snackbar,
  Tooltip,
} from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import { Bookmark } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  getSavedToqueStatus,
  removeSavedToque,
  saveToque,
} from '../../../services/short.service'
import {
  AUTH_SESSION_CHANGED_EVENT,
  clearAuthSession,
  getAuthSession,
  getCurrentUser,
  saveAuthUser,
} from '../../../services/auth.service'

interface SaveToqueButtonProps {
  toqueId: string
  title?: string
  initialSaved?: boolean
  iconSize?: number
  sx?: SxProps<Theme>
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

export default function SaveToqueButton({
  toqueId,
  title,
  initialSaved,
  iconSize = 20,
  sx,
}: SaveToqueButtonProps) {
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const [hasSession, setHasSession] = useState(false)
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
    () => ['saved-toque-status', toqueId],
    [toqueId],
  )
  const { data, error: statusError, isFetching } = useQuery({
    queryKey: statusQueryKey,
    queryFn: () => getSavedToqueStatus(toqueId),
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
  const saveLabel = isSaved ? 'Guardado' : 'Guardar'

  const mutation = useMutation({
    mutationFn: (nextSaved: boolean) =>
      nextSaved ? saveToque(toqueId) : removeSavedToque(toqueId),
    onMutate: async (nextSaved) => {
      await queryClient.cancelQueries({ queryKey: statusQueryKey })
      const previousStatus = queryClient.getQueryData<{ saved: boolean }>(
        statusQueryKey,
      )

      queryClient.setQueryData(statusQueryKey, { saved: nextSaved })

      return { previousStatus }
    },
    onSuccess: (response) => {
      queryClient.setQueryData(statusQueryKey, response)
      queryClient.invalidateQueries({ queryKey: ['saved-toques'] })
      setFeedback({
        open: true,
        message: response.saved
          ? 'Toque guardado.'
          : 'Toque removido dos guardados.',
      })
    },
    onError: (error, _nextSaved, context) => {
      queryClient.setQueryData(statusQueryKey, context?.previousStatus)

      if (isUnauthorizedError(error)) {
        clearAuthSession()
        setHasSession(false)
        router.push(
          `/login?redirect=${encodeURIComponent(getCurrentRedirectPath(pathname))}`,
        )
        return
      }

      setFeedback({
        open: true,
        message: 'Nao foi possivel guardar este toque. Tente novamente.',
      })
    },
  })

  const isBusy = mutation.isPending || (hasSession && isFetching)

  const handleToggleSaved = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (!hasSession) {
      router.push(
        `/login?redirect=${encodeURIComponent(getCurrentRedirectPath(pathname))}`,
      )
      return
    }

    if (!isBusy) {
      mutation.mutate(!isSaved)
    }
  }

  return (
    <>
      <Tooltip title={`${saveLabel}${title ? ` ${title}` : ''}`}>
        <span>
          <IconButton
            type="button"
            aria-label={isSaved ? 'Remover toque dos guardados' : 'Guardar toque'}
            disabled={isBusy}
            onClick={handleToggleSaved}
            sx={[
              {
                width: 44,
                height: 44,
                color: '#fff',
                bgcolor: isSaved
                  ? 'rgba(249,115,22,.88)'
                  : 'rgba(0,0,0,.48)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  bgcolor: isSaved
                    ? 'rgba(249,115,22,.98)'
                    : 'rgba(0,0,0,.68)',
                },
                '&.Mui-disabled': {
                  color: '#fff',
                  bgcolor: 'rgba(0,0,0,.34)',
                },
              },
              ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
            ]}
          >
            {isBusy ? (
              <CircularProgress size={18} color="inherit" />
            ) : isSaved ? (
              <Bookmark size={iconSize} fill="currentColor" />
            ) : (
              <Bookmark size={iconSize} />
            )}
          </IconButton>
        </span>
      </Tooltip>

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
