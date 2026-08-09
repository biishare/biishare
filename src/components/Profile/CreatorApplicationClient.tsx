'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Alert,
  Box,
  Button,
  Chip,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileImage,
  GraduationCap,
  Send,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react'

import {
  applyCreatorApplication,
  AuthUser,
  getApiErrorMessage,
  saveAuthUser,
} from '../../../services/auth.service'

const CONTENT_DESCRIPTION_LIMIT = 500
const FAST_TRACK_CREATOR_EMAIL = 'tonymarques116@gmail.com'

type CreatorApplicationRecord = {
  workDescription: string
  publicName: string
  verificationCode?: string
  verificationPhotoName?: string
  submittedAt: string
}

function createCreatorVerificationCode() {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `BII-${random.slice(0, 3)}-${random.slice(3)}`
}

export default function CreatorApplicationClient({
  authUser,
  profileHref,
}: {
  authUser: AuthUser
  profileHref: string
}) {
  const [currentUser, setCurrentUser] = useState(authUser)
  const [application, setApplication] = useState<CreatorApplicationRecord | null>(
    normalizeCreatorApplication(authUser.creatorApplication)
  )
  const [verificationCode] = useState(() => createCreatorVerificationCode())
  const [formValues, setFormValues] = useState({
    workDescription: '',
    publicName: authUser.name,
    consentAccepted: false,
  })
  const [files, setFiles] = useState({
    verificationPhoto: null as File | null,
  })
  const [verificationPhotoPreviewUrl, setVerificationPhotoPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!files.verificationPhoto) {
      setVerificationPhotoPreviewUrl(null)
      return
    }

    const previewUrl = URL.createObjectURL(files.verificationPhoto)
    setVerificationPhotoPreviewUrl(previewUrl)

    return () => URL.revokeObjectURL(previewUrl)
  }, [files.verificationPhoto])

  const creatorStatus = currentUser.creatorStatus ?? 'none'
  const isFastTrackUser = currentUser.email.toLowerCase() === FAST_TRACK_CREATOR_EMAIL
  const canSubmit =
    formValues.workDescription.trim().length >= 3 &&
    formValues.publicName.trim().length >= 3 &&
    Boolean(files.verificationPhoto) &&
    formValues.consentAccepted

  const updateFile = (field: keyof typeof files, file: File | null) => {
    setFiles((current) => ({ ...current, [field]: file }))
  }

  const updateUserFromResponse = (user: AuthUser) => {
    saveAuthUser(user)
    setCurrentUser(user)
    setApplication(normalizeCreatorApplication(user.creatorApplication))
  }

  const handleFastTrackActivation = async () => {
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await applyCreatorApplication()
      updateUserFromResponse(response.user)
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Nao foi possivel ativar a conta de criador.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSubmit || !files.verificationPhoto) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await applyCreatorApplication({
        publicName: formValues.publicName.trim(),
        workDescription: formValues.workDescription.trim(),
        verificationCode,
        verificationPhoto: files.verificationPhoto,
        consentAccepted: formValues.consentAccepted,
      })
      updateUserFromResponse(response.user)

      if (response.creatorStatus === 'pending') {
        setApplication({
          publicName: formValues.publicName.trim(),
          workDescription: formValues.workDescription.trim(),
          verificationCode,
          verificationPhotoName: files.verificationPhoto.name,
          submittedAt: 'Agora',
        })
      }
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Nao foi possivel enviar o pedido de criador.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (creatorStatus === 'approved') {
    return (
      <Box>
        <CreatorPageHeader profileHref={profileHref} status="Ativa" />
        <Box sx={cardSx}>
          <Stack spacing={1.6} alignItems="flex-start">
            <CheckCircle2 size={34} color="#16a34a" />
            <Box>
              <Typography fontSize={20} fontWeight={950}>
                Conta de criador ativa
              </Typography>
              <Typography color="text.secondary" fontSize={14} lineHeight={1.5} mt={0.5}>
                A tua conta continua a mesma. Agora tens permissao para publicar posts, documentos, videos e Toques na Biishare.
              </Typography>
            </Box>
            <Button
              component={Link}
              href={profileHref}
              variant="contained"
              sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 900, boxShadow: 'none' }}
            >
              Voltar ao perfil
            </Button>
          </Stack>
        </Box>
      </Box>
    )
  }

  if (creatorStatus === 'pending' || application) {
    return (
      <PendingCreatorApplication
        application={application}
        errorMessage={errorMessage}
        isSubmitting={isSubmitting}
        onEdit={() => setCurrentUser((user) => ({ ...user, creatorStatus: 'none' }))}
        profileHref={profileHref}
      />
    )
  }

  if (isFastTrackUser) {
    return (
      <Box>
        <CreatorPageHeader profileHref={profileHref} />
        <Box sx={cardSx}>
          <Stack spacing={1.6}>
            <CreatorAccountNotice />
            <StepTitle number={1} title="Ativar criador" />
            <Typography color="text.secondary" fontSize={14} lineHeight={1.5}>
              Esta conta esta autorizada para ativacao imediata. Nao precisas de enviar fotografia nem aguardar revisao.
            </Typography>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <Button
              type="button"
              variant="contained"
              startIcon={isSubmitting ? <CircularProgress size={17} color="inherit" /> : <GraduationCap size={17} />}
              disabled={isSubmitting}
              onClick={handleFastTrackActivation}
              sx={{ height: 44, borderRadius: 1.5, textTransform: 'none', fontWeight: 900, boxShadow: 'none' }}
            >
              Ativar conta de criador
            </Button>
          </Stack>
        </Box>
      </Box>
    )
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <CreatorPageHeader profileHref={profileHref} />

      <Box sx={cardSx}>
        <Stack spacing={2}>
          <CreatorAccountNotice />
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          <StepTitle number={1} title="Dados do criador" />

          <Stack spacing={1.35}>
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
              size="small"
              helperText="O nome continua ligado a esta conta. Alteracoes de nome ficam limitadas a uma vez a cada 30 dias."
              FormHelperTextProps={{ sx: { mx: 0 } }}
            />

            <TextField
              label="Fala-nos sobre o conteudo que pretendes criar"
              value={formValues.workDescription}
              onChange={(event) =>
                setFormValues((current) => ({
                  ...current,
                  workDescription: event.target.value,
                }))
              }
              fullWidth
              multiline
              minRows={4}
              placeholder="Ex.: Produzo conteudos educativos de Matematica e Fisica para estudantes do ensino secundario."
              inputProps={{ maxLength: CONTENT_DESCRIPTION_LIMIT }}
              helperText={`${formValues.workDescription.length} / ${CONTENT_DESCRIPTION_LIMIT}`}
              FormHelperTextProps={{ sx: { mx: 0, textAlign: 'right' } }}
            />
          </Stack>

          <Divider />

          <StepTitle number={2} title="Verificacao de identidade" />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'minmax(0, .9fr) minmax(220px, .75fr)' },
              gap: 1.3,
              alignItems: 'stretch',
            }}
          >
            <Box>
              <Typography color="text.secondary" fontSize={13} lineHeight={1.45}>
                Escreve este codigo num papel e tira uma fotografia segurando-o com as maos.
              </Typography>

              <Box
                sx={{
                  mt: 1,
                  border: '1px dashed #fdba74',
                  borderRadius: 2,
                  px: 1.4,
                  py: 1.2,
                  backgroundColor: '#fff7ed',
                  textAlign: 'center',
                }}
              >
                <Typography fontSize={24} fontWeight={950} letterSpacing={3} color="#ea580c">
                  {verificationCode}
                </Typography>
              </Box>

              <Box mt={1}>
                <FileUploadField
                  label="Escolher fotografia"
                  file={files.verificationPhoto}
                  onChange={(file) => updateFile('verificationPhoto', file)}
                />
              </Box>
            </Box>

            <VerificationPhotoPreview
              fileName={files.verificationPhoto?.name}
              previewUrl={verificationPhotoPreviewUrl}
              onClear={() => updateFile('verificationPhoto', null)}
            />
          </Box>

          <FormControlLabel
            sx={{ alignItems: 'flex-start', m: 0 }}
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
              <Typography fontSize={13} color="text.secondary" lineHeight={1.45} pt={0.8}>
                Confirmo que sou a pessoa presente na fotografia e aceito que a Biishare reveja esta candidatura.
              </Typography>
            }
          />

          <Button
            type="submit"
            variant="contained"
            disabled={!canSubmit || isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={17} color="inherit" /> : <Send size={17} />}
            sx={{
              height: 44,
              borderRadius: 1.5,
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

      <Stack direction="row" justifyContent="center" alignItems="center" gap={0.7} mt={1.4}>
        <ShieldCheck size={14} color="#94a3b8" />
        <Typography color="text.secondary" fontSize={12}>
          As tuas informacoes sao usadas apenas para verificacao.
        </Typography>
      </Stack>
    </Box>
  )
}

function PendingCreatorApplication({
  application,
  errorMessage,
  isSubmitting,
  onEdit,
  profileHref,
}: {
  application: CreatorApplicationRecord | null
  errorMessage: string | null
  isSubmitting: boolean
  onEdit: () => void
  profileHref: string
}) {
  return (
    <Box>
      <CreatorPageHeader profileHref={profileHref} status="Em revisao" />
      <Box sx={cardSx}>
        <Stack spacing={2}>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <StepTitle number={1} title="Dados do criador" />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '160px minmax(0, 1fr)' },
              gap: 1.1,
            }}
          >
            <InfoRow label="Nome publico" value={application?.publicName || 'Em revisao'} />
            <InfoRow label="Conteudo" value={application?.workDescription || 'Pedido enviado'} />
            <InfoRow label="Estado" value="Pendente" />
            <InfoRow label="Enviado" value={application?.submittedAt || 'Recentemente'} />
          </Box>

          <Divider />

          <StepTitle number={2} title="Verificacao de identidade" />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'minmax(0, .9fr) minmax(220px, .75fr)' },
              gap: 1.3,
              alignItems: 'start',
            }}
          >
            <DocumentPreview label="Codigo de verificacao" value={application?.verificationCode || 'Enviado'} />
            <DocumentPreview label="Foto segurando o codigo" value={application?.verificationPhotoName || 'Enviada'} />
          </Box>
        </Stack>
      </Box>

      <Stack direction="row" justifyContent="flex-end" mt={1.5}>
        <Button
          type="button"
          variant="outlined"
          disabled={isSubmitting}
          onClick={onEdit}
          sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 900 }}
        >
          Editar pedido
        </Button>
      </Stack>
    </Box>
  )
}

function CreatorPageHeader({
  profileHref,
  status,
}: {
  profileHref: string
  status?: string
}) {
  return (
    <Box sx={{ mb: 1.6 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1.5}>
        <Button
          variant="text"
          size="small"
          startIcon={<ArrowLeft size={16} />}
          component={Link}
          href={profileHref}
          sx={{ borderRadius: 1.5, color: '#64748b', textTransform: 'none', fontWeight: 850 }}
        >
          Voltar ao perfil
        </Button>

        {status && (
          <Chip
            icon={status === 'Ativa' ? <CheckCircle2 size={15} /> : <Clock3 size={15} />}
            label={status}
            color={status === 'Ativa' ? 'success' : 'warning'}
            sx={{ fontWeight: 900 }}
          />
        )}
      </Stack>

      <Typography fontSize={{ xs: 25, md: 30 }} fontWeight={950} lineHeight={1.05} mt={1.1}>
        Pedido de conta de criador
      </Typography>
      <Typography color="text.secondary" fontSize={14} lineHeight={1.45} mt={0.7} maxWidth={560}>
        Torna-te criador e comeca a publicar conteudos educativos, documentos, videos e Toques na Biishare.
      </Typography>
    </Box>
  )
}

function CreatorAccountNotice() {
  return (
    <Alert severity="info" sx={{ borderRadius: 1.5 }}>
      Na Biishare, isto nao cria uma pagina separada como no Facebook. Continua a ser a tua conta; ao seres aprovado, ganhas permissao para publicar. O nome publico so pode ser alterado uma vez a cada 30 dias.
    </Alert>
  )
}

function StepTitle({ number, title }: { number: number; title: string }) {
  return (
    <Stack direction="row" alignItems="center" gap={1.1}>
      <Box
        sx={{
          width: 24,
          height: 24,
          display: 'grid',
          placeItems: 'center',
          borderRadius: '50%',
          background: '#f97316',
          color: '#fff',
          fontSize: 13,
          fontWeight: 950,
          flexShrink: 0,
        }}
      >
        {number}
      </Box>
      <Typography fontWeight={900}>{title}</Typography>
    </Stack>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <Typography color="text.secondary" fontSize={14}>
        {label}
      </Typography>
      <Typography fontWeight={900}>{value}</Typography>
    </>
  )
}

function FileUploadField({
  label,
  file,
  onChange,
}: {
  label: string
  file: File | null
  onChange: (file: File | null) => void
}) {
  return (
    <Button
      component="label"
      variant="outlined"
      startIcon={<Upload size={15} />}
      sx={{
        width: '100%',
        height: 38,
        borderRadius: 1.5,
        textTransform: 'none',
        fontWeight: 850,
        background: '#fff',
      }}
    >
      {file ? 'Alterar fotografia' : label}
      <input
        hidden
        accept="image/*"
        type="file"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
    </Button>
  )
}

function VerificationPhotoPreview({
  fileName,
  onClear,
  previewUrl,
}: {
  fileName?: string
  onClear: () => void
  previewUrl: string | null
}) {
  return (
    <Box
      sx={{
        minHeight: 150,
        border: '1px solid #e5e7eb',
        borderRadius: 2,
        overflow: 'hidden',
        background: '#f8fafc',
      }}
    >
      {previewUrl ? (
        <>
          <Box
            component="img"
            src={previewUrl}
            alt="Previsualizacao da fotografia de verificacao"
            sx={{
              display: 'block',
              width: '100%',
              height: 118,
              objectFit: 'cover',
              background: '#e2e8f0',
            }}
          />
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} px={1} py={0.75}>
            <Stack direction="row" alignItems="center" gap={0.6} minWidth={0}>
              <CheckCircle2 size={14} color="#16a34a" />
              <Typography fontSize={12} fontWeight={850} noWrap>
                {fileName}
              </Typography>
            </Stack>
            <Button
              type="button"
              size="small"
              startIcon={<X size={13} />}
              onClick={onClear}
              sx={{ minWidth: 0, color: '#ef4444', textTransform: 'none', fontWeight: 850 }}
            >
              Remover
            </Button>
          </Stack>
        </>
      ) : (
        <Stack alignItems="center" justifyContent="center" gap={0.7} sx={{ height: '100%', minHeight: 150, px: 2 }}>
          <FileImage size={22} color="#94a3b8" />
          <Typography color="text.secondary" fontSize={13} textAlign="center">
            A fotografia selecionada aparece aqui.
          </Typography>
        </Stack>
      )}
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

function normalizeCreatorApplication(
  application: AuthUser['creatorApplication']
): CreatorApplicationRecord | null {
  if (!application) {
    return null
  }

  return {
    publicName: application.publicName,
    workDescription: application.workDescription,
    verificationCode: application.verificationCode,
    verificationPhotoName: application.verificationPhotoName,
    submittedAt: formatCreatorDate(application.submittedAt),
  }
}

function formatCreatorDate(value?: string) {
  if (!value) {
    return 'Recentemente'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Recentemente'
  }

  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

const cardSx = {
  mt: 2,
  border: '1px solid #e5e7eb',
  borderRadius: 2,
  p: { xs: 1.5, sm: 2, md: 2.2 },
  background: '#fff',
  boxShadow: '0 16px 40px rgba(15,23,42,.06)',
}
