'use client'

import { useCallback, useMemo, useState } from 'react'
import imageCompression from 'browser-image-compression'
import Cropper, { Area } from 'react-easy-crop'
import { useDropzone } from 'react-dropzone'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slider,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { Camera, Image as ImageIcon } from 'lucide-react'

import {
  AuthUser,
  getApiErrorMessage,
  saveAuthUser,
  uploadProfileImages,
} from '../../../services/auth.service'

type ImageSlot = 'avatar' | 'cover'

type PendingCrop = {
  file: File
  imageUrl: string
}

const compressionOptions = {
  maxSizeMB: 0.7,
  maxWidthOrHeight: 1600,
  useWebWorker: true,
}

function readImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', reject)
    image.src = url
  })
}

async function cropImage(imageUrl: string, crop: Area, fileName: string) {
  const image = await readImage(imageUrl)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Nao foi possivel preparar o corte da imagem.')
  }

  canvas.width = crop.width
  canvas.height = crop.height
  context.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height,
  )

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Nao foi possivel gerar a imagem cortada.'))
          return
        }

        resolve(new File([blob], fileName, { type: 'image/jpeg' }))
      },
      'image/jpeg',
      0.88,
    )
  })
}

export default function ProfileImageUploader({
  onUserUpdated,
  slot,
}: {
  onUserUpdated: (user: AuthUser) => void
  slot: ImageSlot
}) {
  const [pendingCrop, setPendingCrop] = useState<PendingCrop | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState<Area | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isAvatar = slot === 'avatar'
  const cropAspect = isAvatar ? 1 : 16 / 5

  const slotLabel = useMemo(
    () => (isAvatar ? 'foto de perfil' : 'capa'),
    [isAvatar],
  )

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedArea(areaPixels)
  }, [])

  const uploadFile = useCallback(
    async (file: File) => {
      setIsUploading(true)
      setMessage(null)
      setErrorMessage(null)

      try {
        const response = await uploadProfileImages({
          avatar: isAvatar ? file : null,
          cover: isAvatar ? null : file,
        })

        saveAuthUser(response.user)
        onUserUpdated(response.user)
        setPendingCrop(null)
        setMessage(response.message)
      } catch (error) {
        setErrorMessage(
          getApiErrorMessage(error, 'Nao foi possivel guardar a imagem.'),
        )
      } finally {
        setIsUploading(false)
      }
    },
    [isAvatar, onUserUpdated],
  )

  const handleFile = useCallback(async (file: File) => {
    setMessage(null)
    setErrorMessage(null)

    try {
      const compressedFile = await imageCompression(file, compressionOptions)
      setPendingCrop({
        file: compressedFile,
        imageUrl: URL.createObjectURL(compressedFile),
      })
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setCroppedArea(null)
    } catch (error) {
      setErrorMessage('Nao foi possivel preparar a imagem.')
    }
  }, [])

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    disabled: isUploading,
    maxFiles: 1,
    multiple: false,
    onDrop: (files) => {
      const file = files[0]
      if (file) handleFile(file)
    },
  })
  const actionLabel = isAvatar
    ? isUploading
      ? 'A guardar foto de perfil'
      : 'Alterar foto de perfil'
    : isUploading
      ? 'A guardar capa'
      : isDragActive
        ? 'Soltar capa'
        : 'Alterar capa'

  const useOriginalImage = () => {
    if (!pendingCrop) return
    uploadFile(pendingCrop.file)
  }

  const applyCrop = async () => {
    if (!pendingCrop || !croppedArea) return

    try {
      const croppedFile = await cropImage(
        pendingCrop.imageUrl,
        croppedArea,
        pendingCrop.file.name,
      )
      const compressedFile = await imageCompression(croppedFile, compressionOptions)
      uploadFile(compressedFile)
    } catch (error) {
      setErrorMessage('Nao foi possivel cortar a imagem.')
    }
  }

  return (
    <>
      {isAvatar ? (
        <Tooltip title={actionLabel}>
          <IconButton
            {...getRootProps({ className: 'profile-avatar-action' })}
            aria-label={actionLabel}
            disabled={isUploading}
            sx={{
              position: 'absolute',
              right: { xs: -3, md: 4 },
              bottom: { xs: -3, md: 6 },
              zIndex: 3,
              width: { xs: 34, md: 36 },
              height: { xs: 34, md: 36 },
              border: '2px solid rgba(255,255,255,.95)',
              background: isDragActive
                ? 'rgba(249,115,22,.92)'
                : 'rgba(15,23,42,.72)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              boxShadow: '0 10px 22px rgba(15,23,42,.2)',
              opacity: { xs: 1, sm: 0 },
              pointerEvents: { xs: 'auto', sm: 'none' },
              transition:
                'opacity .18s ease, transform .18s ease, background-color .18s ease',

              '&:hover': {
                background: 'rgba(15,23,42,.86)',
                transform: 'translateY(-1px)',
              },

              '&:focus-visible': {
                opacity: 1,
                pointerEvents: 'auto',
                outline: '2px solid rgba(249,115,22,.55)',
                outlineOffset: 2,
              },
            }}
          >
            <input {...getInputProps()} />
            <Camera size={16} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title={actionLabel}>
          <IconButton
            {...getRootProps({ className: 'profile-cover-action' })}
            aria-label={actionLabel}
            disabled={isUploading}
            sx={{
              position: 'absolute',
              top: { xs: 12, md: 16 },
              right: { xs: 12, md: 16 },
              zIndex: 3,
              width: { xs: 38, md: 40 },
              height: { xs: 38, md: 40 },
              border: '1px solid rgba(255,255,255,.48)',
              color: '#fff',
              background: isDragActive
                ? 'rgba(249,115,22,.92)'
                : 'rgba(15,23,42,.48)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 22px rgba(15,23,42,.16)',
              opacity: { xs: 1, sm: 0 },
              pointerEvents: { xs: 'auto', sm: 'none' },
              transition:
                'opacity .18s ease, transform .18s ease, background-color .18s ease',

              '&:hover': {
                background: 'rgba(15,23,42,.72)',
                borderColor: 'rgba(255,255,255,.78)',
                transform: 'translateY(-1px)',
              },

              '&:focus-visible': {
                opacity: 1,
                pointerEvents: 'auto',
                outline: '2px solid rgba(249,115,22,.55)',
                outlineOffset: 2,
              },
            }}
          >
            <input {...getInputProps()} />
            <ImageIcon size={18} />
          </IconButton>
        </Tooltip>
      )}

      <Dialog
        open={Boolean(pendingCrop)}
        onClose={() => {
          if (!isUploading) setPendingCrop(null)
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 900 }}>
          Ajustar {slotLabel}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              position: 'relative',
              height: { xs: 320, md: 430 },
              borderRadius: 2,
              overflow: 'hidden',
              background: '#111827',
            }}
          >
            {pendingCrop && (
              <Cropper
                image={pendingCrop.imageUrl}
                crop={crop}
                zoom={zoom}
                aspect={cropAspect}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </Box>

          <Stack direction="row" alignItems="center" gap={2} mt={2}>
            <Typography fontSize={14} fontWeight={800}>
              Zoom
            </Typography>
            <Slider
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(_, value) => setZoom(value as number)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            disabled={isUploading}
            onClick={() => setPendingCrop(null)}
            sx={{ textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button
            disabled={isUploading}
            onClick={useOriginalImage}
            sx={{ textTransform: 'none', fontWeight: 800 }}
          >
            Usar sem corte
          </Button>
          <Button
            variant="contained"
            disabled={isUploading || !croppedArea}
            onClick={applyCrop}
            sx={{
              textTransform: 'none',
              fontWeight: 900,
              background: 'linear-gradient(135deg,#f59e0b,#f97316)',
            }}
          >
            {isUploading ? 'A guardar...' : 'Guardar corte'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(message || errorMessage)}
        autoHideDuration={4200}
        onClose={() => {
          setMessage(null)
          setErrorMessage(null)
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={message ? 'success' : 'error'}
          variant="filled"
          onClose={() => {
            setMessage(null)
            setErrorMessage(null)
          }}
        >
          {message || errorMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
