'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import {
  Bell,
  Bookmark,
  CheckCircle2,
  Clock3,
  Coins,
  Gift,
  LogOut,
  RotateCcw,
  Star,
} from 'lucide-react'

import {
  AuthUser,
  clearAuthSession,
  getCurrentUser,
  getAuthSession,
  logoutUser,
  saveAuthUser,
} from '../../../services/auth.service'
import ProfileImageUploader from './ProfileImageUploader'

type ProfileSection = 'saved' | 'history' | 'rewards'

type SavedPost = {
  id: string
  title: string
  subject: string
  type: 'Video' | 'Documento'
  savedAt: string
  progress: number
}

type PointsEvent = {
  id: string
  label: string
  source: string
  points: number
  date: string
}

type Reward = {
  id: string
  title: string
  amount: string
  cost: number
  available: boolean
}

type Redemption = {
  id: string
  rewardTitle: string
  amount: string
  cost: number
  code: string
  requestedAt: string
  status: 'pending' | 'used'
}

const DAILY_QUESTION_LIMIT = 20
const RESET_QUESTION_LIMIT_COST = 150
const INITIAL_POINTS = 0

const savedPosts: SavedPost[] = [
  {
    id: '1',
    title: 'Introducao a funcoes matematicas',
    subject: 'Matematica',
    type: 'Video',
    savedAt: 'Hoje',
    progress: 72,
  },
  {
    id: '2',
    title: 'Resumo de biologia celular',
    subject: 'Biologia',
    type: 'Documento',
    savedAt: 'Ontem',
    progress: 38,
  },
  {
    id: '3',
    title: 'Interpretacao de texto',
    subject: 'Portugues',
    type: 'Documento',
    savedAt: '28 maio',
    progress: 100,
  },
]

const pointsHistory: PointsEvent[] = [
  {
    id: 'p1',
    label: 'Resposta correta',
    source: 'Perguntas de Matematica',
    points: 25,
    date: 'Hoje, 10:42',
  },
  {
    id: 'p2',
    label: 'Sequencia de 5 acertos',
    source: 'Bonus diario',
    points: 40,
    date: 'Hoje, 10:38',
  },
  {
    id: 'p3',
    label: 'Resposta errada',
    source: 'Perguntas de Quimica',
    points: -5,
    date: 'Ontem, 19:10',
  },
]

const rewards: Reward[] = [
  {
    id: 'r1',
    title: 'Saldo movel',
    amount: '500 Kz',
    cost: 400,
    available: true,
  },
  {
    id: 'r2',
    title: 'Dinheiro',
    amount: '1.000 Kz',
    cost: 750,
    available: true,
  },
  {
    id: 'r3',
    title: 'Dinheiro',
    amount: '2.500 Kz',
    cost: 1600,
    available: false,
  },
]

const sectionCards = [
  {
    id: 'saved' as const,
    title: 'Posts Guardados',
    description: 'Ver todos os posts que guardou para mais tarde',
    icon: Bookmark,
  },
  {
    id: 'history' as const,
    title: 'Historico de Pontos',
    description: 'Veja como ganhou e usou seus pontos',
    icon: Clock3,
  },
  {
    id: 'rewards' as const,
    title: 'Recompensas',
    description: 'Troque seus pontos por recompensas incriveis',
    icon: Gift,
  },
]

function createRedemptionCode(rewardId: string) {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `BII-${rewardId.toUpperCase()}-${Date.now().toString().slice(-5)}-${random}`
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
  const [selectedRewardId, setSelectedRewardId] = useState(rewards[1].id)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [resetLimitOpen, setResetLimitOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [availablePoints, setAvailablePoints] = useState(INITIAL_POINTS)
  const [usedPoints, setUsedPoints] = useState(0)
  const [answeredToday, setAnsweredToday] = useState(DAILY_QUESTION_LIMIT)
  const [lastRedemption, setLastRedemption] = useState<Redemption | null>(null)
  const [redemptions, setRedemptions] = useState<Redemption[]>([
    {
      id: 'demo-used',
      rewardTitle: 'Saldo movel',
      amount: '500 Kz',
      cost: 400,
      code: 'BII-R1-10422-AX91KQ',
      requestedAt: '31 maio, 14:20',
      status: 'used',
    },
  ])

  const selectedReward = useMemo(
    () => rewards.find((reward) => reward.id === selectedRewardId) ?? rewards[0],
    [selectedRewardId],
  )

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
        router.replace('/login')
      })
      .finally(() => setIsCheckingSession(false))
  }, [expectedUsername, initialUser, redirectToUsername, router])

  const canRedeem = selectedReward.available && availablePoints >= selectedReward.cost
  const remainingQuestions = Math.max(DAILY_QUESTION_LIMIT - answeredToday, 0)
  const canResetQuestionLimit =
    remainingQuestions === 0 && availablePoints >= RESET_QUESTION_LIMIT_COST
  const totalEarned = availablePoints + usedPoints

  const handleRedeem = () => {
    if (!canRedeem) return

    setConfirmOpen(true)
  }

  const confirmRedeem = () => {
    const redemption: Redemption = {
      id: crypto.randomUUID(),
      rewardTitle: selectedReward.title,
      amount: selectedReward.amount,
      cost: selectedReward.cost,
      code: createRedemptionCode(selectedReward.id),
      requestedAt: 'Agora',
      status: 'pending',
    }

    setRedemptions((current) => [redemption, ...current])
    setAvailablePoints((current) => current - selectedReward.cost)
    setUsedPoints((current) => current + selectedReward.cost)
    setLastRedemption(redemption)
    setConfirmOpen(false)
    setSuccessOpen(true)
  }

  const resetQuestionLimit = () => {
    if (!canResetQuestionLimit) return

    setAvailablePoints((current) => current - RESET_QUESTION_LIMIT_COST)
    setUsedPoints((current) => current + RESET_QUESTION_LIMIT_COST)
    setAnsweredToday(0)
    setResetLimitOpen(false)
  }

  const markAsUsed = (redemptionId: string) => {
    setRedemptions((current) =>
      current.map((redemption) =>
        redemption.id === redemptionId
          ? { ...redemption, status: 'used' }
          : redemption,
      ),
    )
  }

  const handleLogout = () => {
    logoutUser()
      .catch(() => undefined)
      .finally(() => {
        clearAuthSession()
        setAuthUser(null)
        router.replace('/login')
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
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, .92fr) minmax(360px, 1.08fr)' },
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
          points={availablePoints}
          username={authUser.username}
        />

        <QuickSummary
          answeredToday={answeredToday}
          availablePoints={availablePoints}
          canResetQuestionLimit={canResetQuestionLimit}
          onOpenResetLimit={() => setResetLimitOpen(true)}
          remainingQuestions={remainingQuestions}
          totalEarned={totalEarned}
          usedPoints={usedPoints}
        />
      </Box>

      <Box
        sx={{
          mt: 2,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: { xs: 1, md: 1.2 },
        }}
      >
        {sectionCards.map((card) => (
          <SectionCard
            key={card.id}
            active={activeSection === card.id}
            description={card.description}
            icon={card.icon}
            title={card.title}
            onClick={() => setActiveSection(card.id)}
          />
        ))}
      </Box>

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
        {activeSection === 'history' && <PointsHistory />}
        {activeSection === 'rewards' && (
          <Rewards
            availablePoints={availablePoints}
            selectedRewardId={selectedRewardId}
            redemptions={redemptions}
            onMarkAsUsed={markAsUsed}
            onRedeem={handleRedeem}
            onSelect={setSelectedRewardId}
          />
        )}
      </Paper>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 900 }}>Confirmar resgate</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Depois de confirmar, sera criado um registo pendente para o admin
            validar e enviar a recompensa.
          </Alert>

          <Stack spacing={1.2}>
            <InfoRow label="Recompensa" value={selectedReward.title} />
            <InfoRow label="Valor" value={selectedReward.amount} />
            <InfoRow label="Custo" value={`${selectedReward.cost} pontos`} />
            <InfoRow
              label="Pontos depois"
              value={`${availablePoints - selectedReward.cost} pontos`}
            />
            <InfoRow label="Estado inicial" value="Pendente" />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={confirmRedeem}
            sx={{
              textTransform: 'none',
              fontWeight: 800,
              background: 'linear-gradient(135deg,#f59e0b,#f97316)',
            }}
          >
            Confirmar resgate
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={resetLimitOpen}
        onClose={() => setResetLimitOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 900 }}>Restabelecer limite diario</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Ao confirmar, o limite de perguntas de hoje volta a ficar disponivel e
            serao descontados {RESET_QUESTION_LIMIT_COST} pontos.
          </Alert>

          <Stack spacing={1.2}>
            <InfoRow label="Limite diario" value={`${DAILY_QUESTION_LIMIT} perguntas`} />
            <InfoRow label="Respondidas hoje" value={`${answeredToday} perguntas`} />
            <InfoRow label="Custo" value={`${RESET_QUESTION_LIMIT_COST} pontos`} />
            <InfoRow
              label="Pontos depois"
              value={`${availablePoints - RESET_QUESTION_LIMIT_COST} pontos`}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setResetLimitOpen(false)} sx={{ textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            disabled={!canResetQuestionLimit}
            onClick={resetQuestionLimit}
            sx={{
              textTransform: 'none',
              fontWeight: 800,
              background: 'linear-gradient(135deg,#f59e0b,#f97316)',
            }}
          >
            Restabelecer limite
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={successOpen} onClose={() => setSuccessOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 900 }}>Resgate registado</DialogTitle>
        <DialogContent>
          <Alert icon={<Bell size={18} />} severity="success" sx={{ mb: 2 }}>
            O admin recebera uma notificacao com este pedido.
          </Alert>

          <Typography color="text.secondary" mb={1}>
            Codigo unico
          </Typography>

          <Paper
            elevation={0}
            sx={{
              border: '1px dashed #fdba74',
              background: '#fffaf3',
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography fontWeight={900} sx={{ wordBreak: 'break-all' }}>
              {lastRedemption?.code}
            </Typography>
          </Paper>

          <Typography mt={2} fontSize={14} color="text.secondary">
            Estado: pendente ate o admin confirmar o envio.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setSuccessOpen(false)} sx={{ textTransform: 'none' }}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
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
  points,
  username,
}: {
  avatarUrl?: string
  coverUrl?: string
  email: string
  name: string
  onLogout: () => void
  onUserUpdated: (user: AuthUser) => void
  points: number
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
            <Paper
              elevation={0}
              sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.4,
              px: 1.4,
              py: 0.9,
              borderRadius: 2,
              border: '1px solid #e5e7eb',
              background: '#fff',
              boxShadow: '0 10px 22px rgba(31,41,55,.08)',
            }}
            >
              <Star size={20} fill="#fbbf24" color="#fbbf24" />
              <Typography fontSize={21} fontWeight={900} color="#111827">
                {points.toLocaleString('pt-PT')}
              </Typography>
              <Typography color="text.secondary" fontSize={13}>
                pontos
              </Typography>
            </Paper>

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
  description,
  icon: Icon,
  title,
  onClick,
}: {
  active: boolean
  description: string
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
        border: active ? '1px solid #fb923c' : '1px solid #e5e7eb',
        borderRadius: 2,
        p: 1.4,
        cursor: 'pointer',
        background: active ? '#fffaf3' : '#fff',
        textAlign: 'left',
        boxShadow: active
          ? '0 0 0 3px rgba(249,115,22,.08)'
          : 'none',
        transition: 'all .2s ease',

        '&:hover': {
          borderColor: '#fdba74',
          transform: 'translateY(-1px)',
          boxShadow: active
            ? '0 12px 24px rgba(31,41,55,.07), 0 0 0 3px rgba(249,115,22,.08)'
            : '0 12px 24px rgba(31,41,55,.07)',
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
            background: active ? '#ffedd5' : '#f8fafc',
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

          <Typography color="text.secondary" fontSize={13} lineHeight={1.35} noWrap>
            {description}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  )
}

function QuickSummary({
  answeredToday,
  availablePoints,
  canResetQuestionLimit,
  onOpenResetLimit,
  remainingQuestions,
  totalEarned,
  usedPoints,
}: {
  answeredToday: number
  availablePoints: number
  canResetQuestionLimit: boolean
  onOpenResetLimit: () => void
  remainingQuestions: number
  totalEarned: number
  usedPoints: number
}) {
  const limitReached = remainingQuestions === 0

  return (
    <Box sx={{ display: 'grid', gap: 1.2, height: '100%' }}>
      <Paper
        elevation={0}
        sx={{
          border: '1px solid #e5e7eb',
          borderRadius: 2,
          p: { xs: 1.5, md: 1.8 },
          background: '#fff',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.3}>
          <Box>
            <Typography fontSize={18} fontWeight={900}>
              Resumo
            </Typography>
            <Typography color="text.secondary" fontSize={13}>
              Pontos e atividade de hoje
            </Typography>
          </Box>
          <Chip size="small" label="Hoje" sx={{ fontWeight: 800 }} />
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: { xs: 1, md: 1 },
          }}
        >
          <SummaryItem
            icon={<Star size={25} fill="#fbbf24" color="#fbbf24" />}
            label="Pontos disponiveis"
            value={availablePoints.toLocaleString('pt-PT')}
          />
          <SummaryItem
            icon={<Clock3 size={24} color="#22c55e" />}
            label="Pontos usados"
            value={usedPoints.toLocaleString('pt-PT')}
            bordered
          />
          <SummaryItem
            icon={<CheckCircle2 size={24} color="#22c55e" />}
            label="Pontos totais ganhos"
            value={totalEarned.toLocaleString('pt-PT')}
            bordered
          />
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          border: limitReached ? '1px solid #fbbf24' : '1px solid #e5e7eb',
          borderRadius: 2,
          p: { xs: 1.5, md: 1.8 },
          background: limitReached ? '#fffbeb' : '#fff',
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', md: 'center' }}
          gap={1.5}
        >
          <Stack direction="row" alignItems="center" gap={1.4}>
            <Clock3 size={22} color={limitReached ? '#d97706' : '#f97316'} />
            <Box>
              <Typography fontWeight={900} fontSize={15}>
                Perguntas diarias
              </Typography>
              <Typography color="text.secondary" fontSize={14}>
                {answeredToday}/{DAILY_QUESTION_LIMIT} respondidas hoje
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ flex: 1, minWidth: { md: 220 } }}>
            <LinearProgress
              variant="determinate"
              value={(answeredToday / DAILY_QUESTION_LIMIT) * 100}
              sx={{
                height: 9,
                borderRadius: 99,
                backgroundColor: '#e5e7eb',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: limitReached ? '#f59e0b' : '#f97316',
                },
              }}
            />
            <Typography mt={0.7} fontSize={13} color="text.secondary">
              {limitReached
                ? canResetQuestionLimit
                  ? `Limite atingido. Use ${RESET_QUESTION_LIMIT_COST} pontos para repor.`
                  : `Limite atingido. Precisa de ${RESET_QUESTION_LIMIT_COST} pontos para repor.`
                : `${remainingQuestions} perguntas restantes hoje.`}
            </Typography>
          </Box>

          <Button
            variant={limitReached ? 'contained' : 'outlined'}
            disabled={!canResetQuestionLimit}
            onClick={onOpenResetLimit}
            startIcon={<RotateCcw size={17} />}
            sx={{
              height: 38,
              px: 1.6,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 900,
              whiteSpace: 'nowrap',
              background: limitReached
                ? 'linear-gradient(135deg,#f59e0b,#f97316)'
                : undefined,
            }}
          >
            Restabelecer limite
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}

function SummaryItem({
  bordered,
  icon,
  label,
  value,
}: {
  bordered?: boolean
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      gap={1.4}
      sx={{
        minHeight: 70,
        border: '1px solid #f1f5f9',
        borderRadius: 2,
        p: 1.2,
        background: '#fff',
        borderLeft: {
          xs: 'none',
          md: bordered ? '1px solid #f1f5f9' : '1px solid #f1f5f9',
        },
      }}
    >
      {icon}
      <Box>
        <Typography fontSize={22} fontWeight={900} lineHeight={1}>
          {value}
        </Typography>
        <Typography color="text.secondary" mt={0.6} fontSize={13}>
          {label}
        </Typography>
      </Box>
    </Stack>
  )
}

function SavedPosts() {
  return (
    <Box>
      <Typography fontSize={22} fontWeight={900}>
        Posts guardados
      </Typography>

      <Box
        sx={{
          mt: 2,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 1.2,
        }}
      >
        {savedPosts.map((post) => (
          <Paper
            key={post.id}
            elevation={0}
            sx={{
              border: '1px solid #e5e7eb',
              borderRadius: 2,
              p: 1.5,
            }}
          >
            <Stack direction="row" justifyContent="space-between" gap={1}>
              <Chip size="small" label={post.type} />
              <Typography fontSize={12} color="text.secondary">
                {post.savedAt}
              </Typography>
            </Stack>

            <Typography mt={1.2} fontWeight={900} fontSize={15} lineHeight={1.35}>
              {post.title}
            </Typography>

            <Typography color="text.secondary" fontSize={14} mt={0.4}>
              {post.subject}
            </Typography>

            <LinearProgress
              variant="determinate"
              value={post.progress}
              sx={{
                mt: 1.2,
                height: 7,
                borderRadius: 99,
                backgroundColor: '#e5e7eb',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#f97316',
                },
              }}
            />
          </Paper>
        ))}
      </Box>
    </Box>
  )
}

function PointsHistory() {
  return (
    <Box>
      <Typography fontSize={22} fontWeight={900}>
        Historico de pontos
      </Typography>

      <Stack divider={<Divider />} spacing={0} mt={1}>
        {pointsHistory.map((event) => (
          <Stack
            key={event.id}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            gap={2}
            py={1.25}
          >
            <Box>
              <Typography fontWeight={900}>{event.label}</Typography>
              <Typography color="text.secondary" fontSize={14}>
                {event.source} - {event.date}
              </Typography>
            </Box>

            <Typography
              fontWeight={900}
              color={event.points >= 0 ? '#16a34a' : '#dc2626'}
              whiteSpace="nowrap"
            >
              {event.points > 0 ? '+' : ''}
              {event.points}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}

function Rewards({
  availablePoints,
  redemptions,
  selectedRewardId,
  onMarkAsUsed,
  onRedeem,
  onSelect,
}: {
  availablePoints: number
  redemptions: Redemption[]
  selectedRewardId: string
  onMarkAsUsed: (redemptionId: string) => void
  onRedeem: () => void
  onSelect: (rewardId: string) => void
}) {
  const selectedReward =
    rewards.find((reward) => reward.id === selectedRewardId) ?? rewards[0]
  const canRedeem = selectedReward.available && availablePoints >= selectedReward.cost

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        gap={1.5}
      >
        <Box>
          <Typography fontSize={22} fontWeight={900}>
            Recompensas
          </Typography>
          <Typography color="text.secondary" mt={0.5}>
            Escolha uma recompensa para trocar pelos seus pontos.
          </Typography>
        </Box>

        <Button
          variant="contained"
          disabled={!canRedeem}
          onClick={onRedeem}
          startIcon={<Coins size={18} />}
          sx={{
            height: 44,
            px: 2.4,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 900,
            background: 'linear-gradient(135deg,#f59e0b,#f97316)',
            boxShadow: 'none',
          }}
        >
          Resgatar
        </Button>
      </Stack>

      <Box
        sx={{
          mt: 1.5,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 1.2,
        }}
      >
        {rewards.map((reward) => {
          const active = reward.id === selectedRewardId

          return (
            <Paper
              key={reward.id}
              elevation={0}
              onClick={() => onSelect(reward.id)}
              sx={{
                border: active ? '1px solid #fb923c' : '1px solid #e5e7eb',
                borderRadius: 2,
                p: 1.5,
                cursor: 'pointer',
                background: active ? '#fffaf3' : '#fff',
                boxShadow: active
                  ? '0 0 0 3px rgba(249,115,22,.08)'
                  : 'none',
              }}
            >
              <Stack direction="row" alignItems="center" gap={1}>
                <Gift size={20} color={active ? '#f97316' : '#64748b'} />
                <Typography fontWeight={900}>{reward.title}</Typography>
              </Stack>

              <Typography mt={1} fontSize={24} fontWeight={900}>
                {reward.amount}
              </Typography>

              <Typography color="text.secondary" fontSize={14}>
                {reward.cost} pontos
              </Typography>

              <Chip
                sx={{ mt: 1.5 }}
                size="small"
                label={reward.available ? 'Disponivel' : 'Bloqueada'}
                color={reward.available ? 'success' : 'default'}
              />
            </Paper>
          )
        })}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography fontSize={20} fontWeight={900}>
        Registos de resgate
      </Typography>

      <Stack spacing={1} mt={1.2}>
        {redemptions.map((redemption) => (
          <Paper
            key={redemption.id}
            elevation={0}
            sx={{
              border: '1px solid #e5e7eb',
              borderRadius: 2,
              p: 1.5,
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              gap={1.5}
            >
              <Box>
                <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                  <Typography fontWeight={900}>
                    {redemption.rewardTitle} - {redemption.amount}
                  </Typography>
                  <Chip
                    size="small"
                    label={redemption.status === 'pending' ? 'Pendente' : 'Codigo usado'}
                    color={redemption.status === 'pending' ? 'warning' : 'success'}
                  />
                </Stack>

                <Typography mt={0.7} fontSize={13} color="text.secondary">
                  Codigo: {redemption.code}
                </Typography>
                <Typography fontSize={13} color="text.secondary">
                  Pedido: {redemption.requestedAt} - {redemption.cost} pontos
                </Typography>
              </Box>

              {redemption.status === 'pending' && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onMarkAsUsed(redemption.id)}
                  sx={{ alignSelf: { xs: 'flex-start', sm: 'center' }, textTransform: 'none' }}
                >
                  Simular confirmacao admin
                </Button>
              )}
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  )
}
