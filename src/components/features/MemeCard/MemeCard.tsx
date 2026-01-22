import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUIStore } from '../../../store/uiStore'
import {
  Globe,
  Twitter,
  Github,
  Users,
  Flame,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { MemeToken } from '../../../domain/meme'
import {
  getCreatedDays,
  formatUSD,
  getFundsAmount,
  getParticipants,
} from '../../../services/utils/memeUtils'
import FundingBar from '../FundingBar/FundingBar'

interface MemeCardProps {
  token: MemeToken
}

const getPhaseColor = (p?: string) => {
  switch (p) {
    case 'P1':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    case 'P2':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    case 'P3':
      return 'bg-orange-500/10 text-orange-600 border-orange-500/20'
    default:
      return 'bg-stripe-50 text-stripe-500 border-gray-200'
  }
}

const formatSignedPercent = (value: number) => {
  const abs = Math.abs(value)
  const fixed = abs >= 10 ? abs.toFixed(1) : abs.toFixed(2)
  return `${value >= 0 ? '+' : ''}${fixed}%`
}

type UseVideoPreviewParams = {
  id: string
  activeId: string | null
  setActiveId: (id: string | null) => void
  intersectionThreshold?: number
}

type UseVideoPreviewReturn = {
  videoRef: React.RefObject<HTMLVideoElement>
  isInView: boolean
  isCoarsePointer: boolean
  isActive: boolean
  play: () => void
  stop: (opts?: { clearActive?: boolean; rewind?: boolean }) => void
  toggle: () => void
}

function useVideoPreview({
  id,
  activeId,
  setActiveId,
  intersectionThreshold = 0.25,
}: UseVideoPreviewParams): UseVideoPreviewReturn {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [isInView, setIsInView] = React.useState(false)
  const [isCoarsePointer, setIsCoarsePointer] = React.useState(false)

  const isActive = activeId === id

  React.useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    )
      return

    const mq = window.matchMedia('(pointer: coarse)')
    const update = () => setIsCoarsePointer(mq.matches)

    update()

    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', update)
      return () => mq.removeEventListener('change', update)
    }

    mq.addListener(update)
    return () => mq.removeListener(update)
  }, [])

  React.useEffect(() => {
    const el = videoRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const obs = new IntersectionObserver(
      entries => {
        const entry = entries[0]
        const inView =
          Boolean(entry?.isIntersecting) &&
          (entry?.intersectionRatio ?? 0) >= intersectionThreshold
        setIsInView(inView)
      },
      { threshold: [0, intersectionThreshold, 1] }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [intersectionThreshold])

  const safePauseAndRewind = React.useCallback((rewind: boolean) => {
    const v = videoRef.current
    if (!v) return

    try {
      v.pause()
    } catch (error) {
      console.warn('Failed to pause video:', error)
    }

    if (!rewind) return

    try {
      v.currentTime = 0
    } catch {
      // ignore
    }
  }, [])

  const stop = React.useCallback(
    (opts?: { clearActive?: boolean; rewind?: boolean }) => {
      const clearActive = opts?.clearActive ?? false
      const rewind = opts?.rewind ?? true

      safePauseAndRewind(rewind)

      if (clearActive && activeId === id) setActiveId(null)
    },
    [activeId, id, safePauseAndRewind, setActiveId]
  )

  const play = React.useCallback(() => {
    const v = videoRef.current
    if (!v) return

    if (!isInView) {
      stop({ clearActive: true, rewind: true })
      return
    }

    if (activeId !== id) setActiveId(id)

    const p = v.play()
    if (p && typeof p.catch === 'function') {
      p.catch(() => {
        stop({ clearActive: true, rewind: true })
      })
    }
  }, [activeId, id, isInView, setActiveId, stop])

  const toggle = React.useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (!isInView) return

    if (!v.paused && !v.ended) {
      stop({ clearActive: true, rewind: true })
    } else {
      play()
    }
  }, [isInView, play, stop])

  React.useEffect(() => {
    if (isInView) return
    stop({ clearActive: true, rewind: true })
  }, [isInView, stop])

  React.useEffect(() => {
    if (activeId === null) return
    if (activeId === id) return
    stop({ clearActive: false, rewind: true })
  }, [activeId, id, stop])

  React.useEffect(() => {
    return () => {
      stop({ clearActive: true, rewind: true })
    }
  }, [stop])

  return { videoRef, isInView, isCoarsePointer, isActive, play, stop, toggle }
}

const MemeCard: React.FC<MemeCardProps> = ({ token }) => {
  const navigate = useNavigate()

  const activePreviewVideoId = useUIStore(s => s.activePreviewVideoId)
  const setActivePreviewVideoId = useUIStore(s => s.setActivePreviewVideoId)

  const preview = useVideoPreview({
    id: token.id,
    activeId: activePreviewVideoId,
    setActiveId: setActivePreviewVideoId,
  })

  const hasPreviewVideo = Boolean(token.previewVideoUrl)
  const previewDurationSec = token.previewDurationSec ?? 10

  const handleCardClick = () => {
    navigate(`/accelerator/meme-project/${token.id}`)
  }

  const change24h = token.change ?? 0
  const showChange = Number.isFinite(change24h) && change24h !== 0
  const isHot = (token.heatScore ?? 0) >= 70

  const onMediaClick: React.MouseEventHandler<HTMLDivElement> = e => {
    e.stopPropagation()
    if (preview.isCoarsePointer) preview.toggle()
  }

  const onMediaKeyDown: React.KeyboardEventHandler<HTMLDivElement> = e => {
    e.stopPropagation()

    const isEnter = e.key === 'Enter'
    const isSpace = e.key === ' ' || e.key === 'Spacebar'

    if (!isEnter && !isSpace) return

    e.preventDefault()
    preview.toggle()
  }

  const onMediaPointerEnter: React.PointerEventHandler<HTMLDivElement> = e => {
    e.stopPropagation()
    if (preview.isCoarsePointer) return
    preview.play()
  }

  const onMediaPointerLeave: React.PointerEventHandler<HTMLDivElement> = e => {
    e.stopPropagation()
    if (preview.isCoarsePointer) return
    preview.stop({ clearActive: true, rewind: true })
  }

  return (
    <div
      onClick={handleCardClick}
      className='group relative bg-white hover:bg-stripe-50 transition-all duration-300 rounded-[18px] border border-gray-200 shadow-stripe hover:shadow-lg cursor-pointer hover:-translate-y-1 overflow-hidden'
    >
      <div className='flex gap-0 h-full'>
        <div
          role='button'
          tabIndex={0}
          aria-label={preview.isActive ? 'Pause preview' : 'Play preview'}
          className='relative flex-shrink-0 w-[120px] bg-gray-100 overflow-hidden'
          onClick={onMediaClick}
          onKeyDown={onMediaKeyDown}
          onPointerEnter={onMediaPointerEnter}
          onPointerLeave={onMediaPointerLeave}
          onPointerDown={e => e.stopPropagation()}
        >
          {hasPreviewVideo ? (
            <video
              ref={preview.videoRef}
              className='w-full h-full object-cover'
              muted
              playsInline
              preload='metadata'
              poster={token.previewPosterUrl ?? token.image}
            >
              <source src={token.previewVideoUrl} type='video/mp4' />
              {token.previewVideoWebmUrl && (
                <source src={token.previewVideoWebmUrl} type='video/webm' />
              )}
            </video>
          ) : (
            <img
              src={token.image}
              alt={token.name}
              className='w-full h-full object-cover'
            />
          )}

          <div className='pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent to-black/25' />

          {token.isLive && (
            <div className='absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center shadow-sm'>
              LIVE
            </div>
          )}
          {isHot && (
            <div className='absolute bottom-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center shadow-sm'>
              HOT
            </div>
          )}

          <div className='absolute inset-0 hidden sm:flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
            <div className='flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-sm'>
              <span aria-hidden>▶</span>
              <span>{previewDurationSec}s</span>
            </div>
          </div>

          <div className='absolute bottom-2 right-2 sm:hidden'>
            <span className='inline-flex items-center rounded-md bg-black/35 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm'>
              {preview.isActive ? 'Playing' : 'Tap'}
            </span>
          </div>
        </div>

        <div className='flex flex-col flex-1 min-w-0 justify-between p-3'>
          <div>
            <div className='flex items-start justify-between gap-2'>
              <div className='min-w-0'>
                <h3 className='text-stripe-900 font-bold text-sm leading-tight truncate pr-2 group-hover:text-indigo-600 transition-colors'>
                  {token.name}
                </h3>
                <div className='flex items-center gap-2 mt-1'>
                  <span className='text-[10px] font-mono text-stripe-500 bg-stripe-50 px-1.5 py-0.5 rounded'>
                    {token.ticker}
                  </span>
                  {token.phase && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getPhaseColor(token.phase)}`}
                    >
                      {token.phase}
                    </span>
                  )}

                  {showChange && (
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        change24h >= 0
                          ? 'bg-green-500/10 text-green-600 border-green-500/20'
                          : 'bg-red-500/10 text-red-600 border-red-500/20'
                      }`}
                    >
                      {change24h >= 0 ? (
                        <TrendingUp className='w-3 h-3' />
                      ) : (
                        <TrendingDown className='w-3 h-3' />
                      )}
                      {formatSignedPercent(change24h)}
                    </span>
                  )}
                </div>
              </div>

              {/* Heat Score */}
              {token.heatScore !== undefined && (
                <div className='flex flex-col items-end shrink-0'>
                  <div className='flex items-center gap-1 text-orange-600 bg-orange-500/10 px-1.5 py-0.5 rounded-full border border-orange-500/20'>
                    <Flame
                      className='w-3 h-3'
                      fill='currentColor'
                      fillOpacity={0.6}
                    />
                    <span className='text-[10px] font-bold'>
                      {token.heatScore.toFixed(0)}
                    </span>
                  </div>
                  {token.heatDelta24h !== undefined && (
                    <span
                      className={`text-[9px] font-mono mt-0.5 ${token.heatDelta24h >= 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {formatSignedPercent(token.heatDelta24h)}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className='mt-2 flex items-center gap-2 text-[11px] text-stripe-500'>
              <span className='text-pink-600 font-semibold bg-pink-500/10 px-1.5 rounded-sm'>
                {getCreatedDays(token.createdAt, token.createdDays)}d
              </span>
              <div
                className='flex gap-1.5 ml-auto opacity-60 hover:opacity-100 transition-opacity'
                onClick={e => e.stopPropagation()}
              >
                {token.website && (
                  <a
                    href={token.website}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Globe className='w-3 h-3 hover:text-stripe-900' />
                  </a>
                )}
                {token.twitter && (
                  <a
                    href={token.twitter}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Twitter className='w-3 h-3 hover:text-blue-500' />
                  </a>
                )}
                {token.github && (
                  <a
                    href={token.github}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Github className='w-3 h-3 hover:text-stripe-900' />
                  </a>
                )}
              </div>
            </div>

            <p className='mt-1.5 text-[11px] text-stripe-500/80 line-clamp-2 leading-relaxed h-[34px]'>
              {token.description}
            </p>
          </div>

          <div className='mt-2'>
            {/* Stats Row */}
            <div className='flex items-center justify-between text-xs mb-1'>
              <span className='text-stripe-500 text-[10px]'>Raised</span>
              <div className='flex items-center gap-3'>
                <span className='font-semibold text-stripe-900'>
                  {formatUSD(getFundsAmount(token))}
                </span>
                <div className='flex items-center gap-1 text-stripe-500'>
                  <Users className='w-3 h-3' />
                  <span className='text-[10px]'>{getParticipants(token)}</span>
                </div>
              </div>
            </div>
            <FundingBar amount={getFundsAmount(token)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemeCard
