'use client'

import placeholder from './placeholder.jpg'

import Video from 'next-video'
import Image from 'next/image'

import {
  Paper,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  SxProps,
  Theme,
} from '@mui/material'

import {
  useRef,
  useEffect,
  useState,
  memo,
} from 'react'

import {
  Check,
  Image as ImageIcon,
  Play,
  Share2,
  Volume2,
  VolumeX,
} from 'lucide-react'

import { Toque } from '../../../types/Toque'
import { CURIOSITY_AREAS } from '../../../constants/shorts/subjects.shorts'

let activeVideo: HTMLVideoElement | null = null
let globalMuted = true

function setActiveVideo(video: HTMLVideoElement) {
  if (activeVideo && activeVideo !== video) {
    activeVideo.pause()
  }

  activeVideo = video
  video.muted = globalMuted
}

function clearActiveVideo(video: HTMLVideoElement) {
  if (activeVideo === video) {
    activeVideo = null
  }
}

function getAreaLabel(area: Toque['area']) {
  return CURIOSITY_AREAS.find(a => a.id === area)?.label ?? area
}

function isTouchDevice() {
  if (typeof window === 'undefined') return false

  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  )
}

function getShareUrl(id: string) {
  if (typeof window === 'undefined') {
    return `/toque/${id}`
  }

  return `${window.location.origin}/toque/${id}`
}

interface Props {
  item: Toque
  pageToque?: boolean
  active?: boolean
  preload?: 'none' | 'metadata' | 'auto'
  sx?: SxProps<Theme>
}

export const ToquesCard = memo(function ToquesCard({
  item,
  pageToque = false,
  active,
  preload,
  sx,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<any>(null)

  const [expanded, setExpanded] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [muted, setMuted] = useState(globalMuted)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [shareDone, setShareDone] = useState(false)

  const isVideo = item.mediaType === 'video'
  const videoPreload =
    preload ?? (active ? 'auto' : pageToque ? 'metadata' : 'metadata')

  const playVideo = async () => {
    const video = videoRef.current
    if (!video) return

    setActiveVideo(video)
    video.muted = globalMuted
    setMuted(globalMuted)

    try {
      await video.play()
      setPlaying(true)
    } catch {
      setPlaying(false)
    }
  }

  const pauseVideo = () => {
    const video = videoRef.current
    if (!video) return

    video.pause()
    setPlaying(false)
  }

  const handleClick = () => {
    if (!pageToque || !isVideo) return

    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      playVideo()
    } else {
      pauseVideo()
    }
  }

  const handleMute = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation()

    const video = videoRef.current
    const nextMuted = !globalMuted

    globalMuted = nextMuted
    setMuted(nextMuted)

    if (video) {
      video.muted = nextMuted
    }
  }

  const handleShare = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation()

    const shareUrl = getShareUrl(item._id)

    try {
      if (navigator.share) {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: shareUrl,
        })
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
      }

      setShareDone(true)
      window.setTimeout(() => setShareDone(false), 1600)
    } catch {
      setShareDone(false)
    }
  }

  const handleDoubleClick = () => {
    if (!pageToque || !isVideo) return

    const video = videoRef.current
    if (!video) return

    globalMuted = !globalMuted
    video.muted = globalMuted
    setMuted(globalMuted)
  }

  const handleMouseEnter = async () => {
    if (pageToque || isTouchDevice() || !isVideo) return

    const video = videoRef.current
    if (!video) return

    video.currentTime = 0
    video.muted = true

    try {
      await video.play()
    } catch { }
  }

  const handleMouseLeave = () => {
    if (pageToque || !isVideo) return

    const video = videoRef.current
    if (!video) return

    video.pause()
    video.currentTime = 0
  }

  useEffect(() => {
    setLoaded(!isVideo)
    setPlaying(false)
    setProgress(0)
    setExpanded(false)
  }, [item._id, isVideo])

  useEffect(() => {
    if (!pageToque || !isVideo || typeof active === 'boolean') return

    const container = containerRef.current
    const video = videoRef.current

    if (!container || !video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible =
          entry.isIntersecting &&
          entry.intersectionRatio >= 0.8

        if (visible) {
          playVideo()
        } else {
          pauseVideo()
        }
      },
      { threshold: [0.8] },
    )

    observer.observe(container)

    return () => {
      observer.disconnect()
      video.pause()
      clearActiveVideo(video)
    }
  }, [pageToque, isVideo, active, item._id])

  useEffect(() => {
    if (!pageToque || !isVideo || typeof active !== 'boolean') return

    const video = videoRef.current
    if (!video) return

    if (active) {
      playVideo()
    } else {
      pauseVideo()
    }

    return () => {
      if (!active) return
      video.pause()
      clearActiveVideo(video)
    }
  }, [active, pageToque, isVideo, item._id])

  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) return
      pauseVideo()
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return (
    <Paper
      ref={containerRef}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        position: 'relative',
        width: '100%',
        aspectRatio: '9 / 16',
        overflow: 'hidden',
        borderRadius: pageToque
          ? { xs: 0, sm: 2 }
          : 2,
        background: '#000',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        contentVisibility: pageToque ? 'visible' : 'auto',
        containIntrinsicSize: pageToque ? undefined : '240px 426px',

        cursor: pageToque && isVideo ? 'pointer' : 'default',
        transition: 'transform .25s ease',

        '&:hover': pageToque
          ? {}
          : { transform: 'translateY(-4px)' },

        ...sx,
      }}
    >
      {!pageToque && (
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 5,
          }}
        >
          {isVideo ? (
            <Play size={16} fill="white" color="white" />
          ) : (
            <ImageIcon size={16} color="white" />
          )}
        </Box>
      )}

      {!pageToque && (
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            px: 1,
            py: 0.3,
            borderRadius: 1,
            fontSize: 11,
            fontWeight: 700,
            bgcolor: 'rgba(255,255,255,.9)',
            zIndex: 5,
          }}
        >
          {getAreaLabel(item.area)}
        </Box>
      )}

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
        }}
      >
        {isVideo ? (
          <Video
            ref={videoRef}
            src={item.videoUrl}
            poster={item.imageUrl}
            onLoadedData={() => setLoaded(true)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(event: any) => {
              const video = event.currentTarget
              if (!video?.duration) return
              setProgress((video.currentTime / video.duration) * 100)
            }}
            loop
            playsInline
            muted={muted}
            preload={videoPreload}
            controls={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            placeholder="blur"
            blurDataURL={placeholder.blurDataURL}
            sizes={pageToque
              ? '(max-width: 600px) 100vw, 520px'
              : '(max-width: 600px) 50vw, 240px'}
            style={{
              objectFit: pageToque ? 'contain' : 'cover',
            }}
          />
        )}

        {isVideo && !loaded && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0,0,0,.4)',
            }}
          >
            <CircularProgress size={26} />
          </Box>
        )}
      </Box>

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(0,0,0,.9), rgba(0,0,0,.18) 42%, transparent)',
          pointerEvents: 'none',
        }}
      />

      {pageToque && isVideo && !playing && loaded && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              bgcolor: 'rgba(0,0,0,.45)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Play size={34} fill="white" color="white" />
          </Box>
        </Box>
      )}

      {pageToque && (
        <Box
          sx={{
            position: 'absolute',
            right: 12,
            bottom: { xs: 104, sm: 96 },
            zIndex: 6,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {isVideo && (
            <IconButton
              aria-label={muted ? 'Ativar som' : 'Desativar som'}
              onClick={handleMute}
              sx={{
                width: 44,
                height: 44,
                color: '#fff',
                bgcolor: 'rgba(0,0,0,.48)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,.68)',
                },
              }}
            >
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </IconButton>
          )}

          <IconButton
            aria-label="Partilhar toque"
            onClick={handleShare}
            sx={{
              width: 44,
              height: 44,
              color: '#fff',
              bgcolor: shareDone
                ? 'rgba(34,197,94,.78)'
                : 'rgba(0,0,0,.48)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                bgcolor: shareDone
                  ? 'rgba(34,197,94,.9)'
                  : 'rgba(0,0,0,.68)',
              },
            }}
          >
            {shareDone ? <Check size={20} /> : <Share2 size={20} />}
          </IconButton>
        </Box>
      )}

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 5,
          p: pageToque ? { xs: 2.4, sm: 2.6 } : 2,
          pr: pageToque ? { xs: 9, sm: 9 } : 2,
          color: '#fff',
        }}
      >
        <Typography
          fontWeight={800}
          fontSize={pageToque ? 17 : 15}
          lineHeight={1.25}
          onClick={(event) => {
            event.stopPropagation()
            setExpanded(v => !v)
          }}
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: expanded ? 'unset' : 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.title}
        </Typography>

        <Typography
          fontSize={pageToque ? 14 : 13}
          lineHeight={1.35}
          mt={0.5}
          onClick={(event) => {
            event.stopPropagation()
            setExpanded(v => !v)
          }}
          sx={{
            opacity: 0.9,
            display: '-webkit-box',
            WebkitLineClamp: expanded ? 'unset' : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.description}
        </Typography>
      </Box>

      {pageToque && isVideo && (
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 7,
            height: 3,
            bgcolor: 'rgba(255,255,255,.18)',
          }}
        >
          <Box
            sx={{
              width: `${progress}%`,
              height: '100%',
              bgcolor: '#F4A300',
              transition: 'width .12s linear',
            }}
          />
        </Box>
      )}
    </Paper>
  )
})
