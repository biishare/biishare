'use client'

import placeholder from './placeholder.jpg'

import Video from 'next-video'
import Image from 'next/image'

import {
  Paper,
  Box,
  Typography,
  CircularProgress,
  SxProps,
  Theme,
} from '@mui/material'

import { useRef, useEffect, useState, memo } from 'react'

import {
  Play,
  Image as ImageIcon,
} from 'lucide-react'

import { Toque } from '../../../types/Toque'
import { CURIOSITY_AREAS } from '../../../constants/shorts/subjects.shorts'

/**
 * =========================================================
 * GLOBAL VIDEO CONTROL
 * =========================================================
 */

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

/**
 * =========================================================
 * HELPERS
 * =========================================================
 */

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

/**
 * =========================================================
 * COMPONENT
 * =========================================================
 */

interface Props {
  item: Toque
  pageToque?: boolean
  active?: boolean
  sx?: SxProps<Theme>
}

export const ToquesCard = memo(function ToquesCard({
  item,
  pageToque = false,
  active = false,
  sx,
}: Props) {

  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<any>(null)

  const [expanded, setExpanded] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [muted, setMuted] = useState(true)

  const isVideo = item.mediaType === 'video'

  /**
   * =========================================================
   * INTERACTIONS
   * =========================================================
   */

  const handleClick = () => {
    if (!pageToque) return

    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      setActiveVideo(video)
      video.play()
    } else {
      video.pause()
    }
  }

  const handleDoubleClick = () => {
    if (!pageToque) return

    const video = videoRef.current
    if (!video) return

    globalMuted = !globalMuted
    video.muted = globalMuted
    setMuted(globalMuted)
  }

  /**
   * =========================================================
   * DESKTOP HOVER PREVIEW
   * =========================================================
   */

  const handleMouseEnter = async () => {
    if (pageToque || isTouchDevice()) return

    const video = videoRef.current
    if (!video) return

    video.currentTime = 0
    video.muted = true

    try {
      await video.play()
    } catch { }
  }

  const handleMouseLeave = () => {
    if (pageToque) return

    const video = videoRef.current
    if (!video) return

    video.pause()
    video.currentTime = 0
  }

  /**
   * =========================================================
   * AUTOPLAY (SHORTS)
   * =========================================================
   */

  useEffect(() => {
    if (!pageToque || !isVideo) return

    const container = containerRef.current
    const video = videoRef.current

    if (!container || !video) return

    const observer = new IntersectionObserver(
      async ([entry]) => {
        const visible =
          entry.isIntersecting &&
          entry.intersectionRatio >= 0.8

        if (visible) {
          setActiveVideo(video)

          try {
            await video.play()
          } catch { }
        } else {
          video.pause()
        }
      },
      { threshold: [0.8] }
    )

    observer.observe(container)

    return () => {
      observer.disconnect()
      video.pause()
      clearActiveVideo(video)
    }
  }, [pageToque, isVideo])

  /**
   * ACTIVE CONTROL (EXTERNAL)
   */

  useEffect(() => {
    if (!pageToque) return

    const video = videoRef.current
    if (!video) return

    if (active) {
      setActiveVideo(video)
      video.play().catch(() => { })
    } else {
      video.pause()
    }
  }, [active, pageToque])

  /**
   * TAB VISIBILITY
   */

  useEffect(() => {
    const handleVisibility = () => {
      const video = videoRef.current
      if (!video) return

      if (document.hidden) {
        video.pause()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  /**
   * =========================================================
   * RENDER
   * =========================================================
   */

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
        borderRadius: 2,
        background: '#000',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        contentVisibility: 'auto',

        cursor: 'pointer',
        transition: 'transform .25s ease',

        '&:hover': pageToque
          ? {}
          : { transform: 'translateY(-4px)' },

        ...sx,
      }}
    >

      {/* ICON */}
      <Box sx={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 5,
      }}>
        {isVideo ? (
          <Play size={16} fill="white" />
        ) : (
          <ImageIcon size={16} color="white" />
        )}
      </Box>

      {/* AREA */}
      {!pageToque && (
        <Box sx={{
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
        }}>
          {getAreaLabel(item.area)}
        </Box>
      )}

      {/* MEDIA */}
      <Box sx={{
        position: 'absolute',
        inset: 0,
      }}>
        {isVideo ? (
          <Video
            ref={videoRef}
            src={item.videoUrl}
            poster={item.imageUrl}
            onLoadedData={() => setLoaded(true)}
            loop
            playsInline
            muted={muted}
            preload={active ? 'auto' : 'metadata'}
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
            style={{ objectFit: 'contain' }}
          />
        )}

        {isVideo && !loaded && (
          <Box sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0,0,0,.4)',
          }}>
            <CircularProgress size={26} />
          </Box>
        )}
      </Box>

      {/* GRADIENT */}
      <Box sx={{
        position: 'absolute',
        inset: 0,
        background: `
          linear-gradient(
            to top,
            rgba(0,0,0,.9),
            transparent
          )
        `,
      }} />

      {/* CONTENT */}
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        p: 2,
        color: '#fff',
      }}>
        <Typography
          fontWeight={800}
          fontSize={15}
          onClick={() => setExpanded(v => !v)}
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
          fontSize={13}
          onClick={() => setExpanded(v => !v)}
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

    </Paper>
  )
})