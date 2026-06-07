'use client'

import { useMemo, useState } from 'react'
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
  ArrowRight,
  Bell,
  Bookmark,
  CheckCircle2,
  Clock3,
  Coins,
  Gift,
  RotateCcw,
  Star,
} from 'lucide-react'

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

const user = {
  name: 'Antonio Marques',
  points: 1250,
  usedPoints: 0,
  totalEarned: 1250,
}

const DAILY_QUESTION_LIMIT = 20
const RESET_QUESTION_LIMIT_COST = 150

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

export default function ProfileClient() {
  const [activeSection, setActiveSection] = useState<ProfileSection>('saved')
  const [selectedRewardId, setSelectedRewardId] = useState(rewards[1].id)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [resetLimitOpen, setResetLimitOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [availablePoints, setAvailablePoints] = useState(user.points)
  const [usedPoints, setUsedPoints] = useState(user.usedPoints)
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

  const canRedeem = selectedReward.available && availablePoints >= selectedReward.cost
  const remainingQuestions = Math.max(DAILY_QUESTION_LIMIT - answeredToday, 0)
  const canResetQuestionLimit =
    remainingQuestions === 0 && availablePoints >= RESET_QUESTION_LIMIT_COST

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

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
      <ProfileHero points={availablePoints} />

      <Box
        sx={{
          mt: 3,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: { xs: 1.6, md: 2.5 },
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

      <QuickSummary
        answeredToday={answeredToday}
        availablePoints={availablePoints}
        canResetQuestionLimit={canResetQuestionLimit}
        onOpenResetLimit={() => setResetLimitOpen(true)}
        remainingQuestions={remainingQuestions}
        usedPoints={usedPoints}
      />

      <Paper
        elevation={0}
        sx={{
          mt: 3,
          border: '1px solid #e5e7eb',
          borderRadius: 3,
          p: { xs: 2, md: 3 },
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
              background: 'linear-gradient(135deg,#7c5ce6,#6247d9)',
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
              background: 'linear-gradient(135deg,#7c5ce6,#6247d9)',
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
              border: '1px dashed #7c5ce6',
              background: '#f4f0ff',
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

function ProfileHero({ points }: { points: number }) {
  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: 220, md: 250 },
        borderRadius: 4,
        p: { xs: 3, md: 5 },
        border: '1px solid #e7ddff',
        background:
          'linear-gradient(135deg, #eee7ff 0%, #fbfaff 48%, #e5dcff 100%)',

        '&::before': {
          content: '""',
          position: 'absolute',
          width: 520,
          height: 220,
          right: -70,
          bottom: -80,
          borderRadius: '50%',
          background: 'rgba(124,92,230,.12)',
          transform: 'rotate(-8deg)',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          width: 360,
          height: 180,
          right: 20,
          bottom: -110,
          borderRadius: '50%',
          background: 'rgba(124,92,230,.08)',
        },
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        gap={{ xs: 2, md: 4 }}
        sx={{ position: 'relative', zIndex: 1 }}
      >
        <Avatar
          sx={{
            width: { xs: 112, md: 156 },
            height: { xs: 112, md: 156 },
            background: 'linear-gradient(145deg,#7c5ce6,#6247d9)',
            boxShadow: '0 18px 38px rgba(98,71,217,.24)',
          }}
        >
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
        </Avatar>

        <Box>
          <Typography
            sx={{
              fontSize: { xs: 30, md: 38 },
              fontWeight: 900,
              lineHeight: 1.05,
              color: '#111827',
            }}
          >
            {user.name}
          </Typography>

          <Paper
            elevation={0}
            sx={{
              mt: 2.5,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.4,
              px: 2,
              py: 1.3,
              borderRadius: 2,
              border: '1px solid rgba(124,92,230,.16)',
              background: 'rgba(255,255,255,.78)',
              boxShadow: '0 14px 30px rgba(31,41,55,.08)',
            }}
          >
            <Star size={25} fill="#fbbf24" color="#fbbf24" />
            <Typography fontSize={28} fontWeight={900} color="#1f1b4d">
              {points.toLocaleString('pt-PT')}
            </Typography>
            <Typography color="text.secondary">Pontos</Typography>
          </Paper>
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
        minHeight: 220,
        width: '100%',
        border: active ? '2px solid #7c5ce6' : '1px solid #e5e7eb',
        borderRadius: 3,
        p: 2.5,
        cursor: 'pointer',
        background: active ? '#fbfaff' : '#fff',
        textAlign: 'center',
        transition: 'all .2s ease',

        '&:hover': {
          borderColor: '#7c5ce6',
          transform: 'translateY(-3px)',
          boxShadow: '0 18px 34px rgba(31,41,55,.08)',
        },
      }}
    >
      <Stack alignItems="center" justifyContent="center" height="100%">
        <Box
          sx={{
            width: 48,
            height: 48,
            display: 'grid',
            placeItems: 'center',
            color: '#6d50dc',
            mb: 2,
          }}
        >
          <Icon size={43} fill="rgba(124,92,230,.2)" />
        </Box>

        <Typography fontWeight={900} fontSize={18} color="#111827">
          {title}
        </Typography>

        <Typography
          mt={1.2}
          color="text.secondary"
          fontSize={14}
          lineHeight={1.55}
          maxWidth={220}
        >
          {description}
        </Typography>

        <ArrowRight size={22} color="#64748b" style={{ marginTop: 18 }} />
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
  usedPoints,
}: {
  answeredToday: number
  availablePoints: number
  canResetQuestionLimit: boolean
  onOpenResetLimit: () => void
  remainingQuestions: number
  usedPoints: number
}) {
  const limitReached = remainingQuestions === 0

  return (
    <Box mt={4}>
      <Typography fontSize={22} fontWeight={900} mb={1.6}>
        Resumo rapido
      </Typography>

      <Paper
        elevation={0}
        sx={{
          border: '1px solid #e5e7eb',
          borderRadius: 3,
          p: { xs: 2, md: 2.5 },
          background: '#fff',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: { xs: 2, md: 0 },
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
            value={user.totalEarned.toLocaleString('pt-PT')}
            bordered
          />
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          mt: 1.5,
          border: limitReached ? '1px solid #fbbf24' : '1px solid #e5e7eb',
          borderRadius: 3,
          p: { xs: 2, md: 2.5 },
          background: limitReached ? '#fffbeb' : '#fff',
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', md: 'center' }}
          gap={2}
        >
          <Stack direction="row" alignItems="center" gap={1.4}>
            <Clock3 size={26} color={limitReached ? '#d97706' : '#7c5ce6'} />
            <Box>
              <Typography fontWeight={900}>Perguntas diarias</Typography>
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
                backgroundColor: '#ede9fe',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: limitReached ? '#f59e0b' : '#7c5ce6',
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
              height: 42,
              px: 2,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 900,
              whiteSpace: 'nowrap',
              background: limitReached
                ? 'linear-gradient(135deg,#7c5ce6,#6247d9)'
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
        borderLeft: {
          xs: 'none',
          md: bordered ? '1px solid #e5e7eb' : 'none',
        },
      }}
    >
      {icon}
      <Box>
        <Typography fontSize={25} fontWeight={900} lineHeight={1}>
          {value}
        </Typography>
        <Typography color="text.secondary" mt={0.8}>
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
          gap: 1.5,
        }}
      >
        {savedPosts.map((post) => (
          <Paper
            key={post.id}
            elevation={0}
            sx={{
              border: '1px solid #e5e7eb',
              borderRadius: 2,
              p: 2,
            }}
          >
            <Stack direction="row" justifyContent="space-between" gap={1}>
              <Chip size="small" label={post.type} />
              <Typography fontSize={12} color="text.secondary">
                {post.savedAt}
              </Typography>
            </Stack>

            <Typography mt={1.4} fontWeight={900}>
              {post.title}
            </Typography>

            <Typography color="text.secondary" fontSize={14} mt={0.4}>
              {post.subject}
            </Typography>

            <LinearProgress
              variant="determinate"
              value={post.progress}
              sx={{
                mt: 1.6,
                height: 7,
                borderRadius: 99,
                backgroundColor: '#ede9fe',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#7c5ce6',
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
            py={1.7}
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
            background: 'linear-gradient(135deg,#7c5ce6,#6247d9)',
            boxShadow: 'none',
          }}
        >
          Resgatar
        </Button>
      </Stack>

      <Box
        sx={{
          mt: 2,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 1.5,
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
                border: active ? '2px solid #7c5ce6' : '1px solid #e5e7eb',
                borderRadius: 2,
                p: 2,
                cursor: 'pointer',
                background: active ? '#fbfaff' : '#fff',
              }}
            >
              <Stack direction="row" alignItems="center" gap={1}>
                <Gift size={20} color="#7c5ce6" />
                <Typography fontWeight={900}>{reward.title}</Typography>
              </Stack>

              <Typography mt={1.2} fontSize={28} fontWeight={900}>
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

      <Divider sx={{ my: 3 }} />

      <Typography fontSize={20} fontWeight={900}>
        Registos de resgate
      </Typography>

      <Stack spacing={1.2} mt={1.5}>
        {redemptions.map((redemption) => (
          <Paper
            key={redemption.id}
            elevation={0}
            sx={{
              border: '1px solid #e5e7eb',
              borderRadius: 2,
              p: 2,
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
