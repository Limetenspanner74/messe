'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

function fmt(s: number) {
  const m = Math.floor(s / 60)
  const r = Math.floor(s % 60)
  return `${m}:${r.toString().padStart(2, '0')}`
}

export function VoiceMessage({
  seconds,
  waveform,
  mine,
}: {
  seconds: number
  waveform: number[]
  mine: boolean
}) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [rate, setRate] = useState(1)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    if (!playing) return
    let last = performance.now()
    const tick = (now: number) => {
      const dt = ((now - last) / 1000) * rate
      last = now
      setProgress((p) => {
        const next = p + dt / seconds
        if (next >= 1) {
          setPlaying(false)
          return 0
        }
        return next
      })
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [playing, rate, seconds])

  const elapsed = playing || progress > 0 ? progress * seconds : seconds

  return (
    <div className="flex w-[13.5rem] items-center gap-3">
      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        aria-label={playing ? 'Pause voice message' : 'Play voice message'}
        className={cn(
          'grid size-10 shrink-0 place-items-center rounded-full transition-shadow active-press',
          mine ? 'bg-primary text-primary-foreground raised-sm' : 'bg-card text-primary raised-sm',
        )}
      >
        {playing ? (
          <Pause className="size-4" fill="currentColor" />
        ) : (
          <Play className="size-4 translate-x-[1px]" fill="currentColor" />
        )}
      </button>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div
          className="flex h-7 items-center gap-[2px]"
          role="progressbar"
          aria-label="Voice message progress"
          aria-valuenow={Math.round(progress * 100)}
        >
          {waveform.map((h, i) => {
            const active = i / waveform.length <= progress
            return (
              <span
                key={i}
                style={{ height: `${Math.round(h * 100)}%` }}
                className={cn(
                  'w-[3px] shrink-0 rounded-full transition-colors duration-150',
                  active
                    ? mine
                      ? 'bg-primary-foreground'
                      : 'bg-primary'
                    : mine
                      ? 'bg-primary-foreground/35'
                      : 'bg-foreground/25',
                )}
              />
            )
          })}
        </div>
        <div className="flex items-center justify-between font-mono text-[10px]">
          <span className={mine ? 'text-primary-foreground/80' : 'text-muted-foreground'}>
            {fmt(elapsed)}
          </span>
          <button
            type="button"
            onClick={() => setRate((r) => (r === 1 ? 1.5 : r === 1.5 ? 2 : 1))}
            className={cn(
              'rounded-full px-1.5 py-[1px] text-[10px] leading-tight',
              mine
                ? 'bg-primary-foreground/15 text-primary-foreground/90'
                : 'bg-foreground/8 text-muted-foreground',
            )}
          >
            {rate}x
          </button>
        </div>
      </div>
    </div>
  )
}
