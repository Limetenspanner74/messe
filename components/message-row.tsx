'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Check, CheckCheck, FileText, Play, Plus, Download } from 'lucide-react'
import type { Message } from '@/lib/messenger-data'
import { quickReactions } from '@/lib/messenger-data'
import { VoiceMessage } from '@/components/voice-message'
import { cn } from '@/lib/utils'

export function MessageRow({
  message,
  onReact,
  onOpenEmojiMenu,
}: {
  message: Message
  onReact: (emoji: string) => void
  onOpenEmojiMenu: () => void
}) {
  const [picker, setPicker] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mine = message.mine

  useEffect(() => {
    if (!picker) return
    const close = () => setPicker(false)
    const id = setTimeout(() => document.addEventListener('pointerdown', close), 0)
    return () => {
      clearTimeout(id)
      document.removeEventListener('pointerdown', close)
    }
  }, [picker])

  const hold = {
    onPointerDown: () => {
      timer.current = setTimeout(() => setPicker(true), 320)
    },
    onPointerUp: () => {
      if (timer.current) clearTimeout(timer.current)
    },
    onPointerLeave: () => {
      if (timer.current) clearTimeout(timer.current)
    },
  }

  return (
    <div className={cn('flex flex-col gap-1', mine ? 'items-end' : 'items-start')}>
      <div className="relative">
        {picker && (
          <div
            className={cn(
              'rise-in absolute -top-13 z-20 flex items-center gap-1 rounded-full bg-popover px-2 py-1.5 raised',
              mine ? 'right-0' : 'left-0',
            )}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {quickReactions.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => {
                  onReact(e)
                  setPicker(false)
                }}
                className="grid size-8 place-items-center rounded-full text-lg transition-transform active:scale-90 hover:bg-accent"
                aria-label={`React with ${e}`}
              >
                {e}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setPicker(false)
                onOpenEmojiMenu()
              }}
              aria-label="Open all reactions"
              className="grid size-8 place-items-center rounded-full bg-accent text-accent-foreground"
            >
              <Plus className="size-4" />
            </button>
          </div>
        )}

        <div
          {...hold}
          data-bubble=""
          onDoubleClick={() => onReact('❤️')}
          role="group"
          aria-label="Message — press and hold to react"
          className={cn(
            'block max-w-[17rem] select-none px-3.5 py-2.5 text-left text-[15px] leading-relaxed transition-shadow',
            mine
              ? 'rounded-2xl rounded-br-md bg-primary text-primary-foreground raised-sm'
              : 'rounded-2xl rounded-bl-md bg-card text-card-foreground raised-sm',
          )}
        >
          {message.kind === 'text' && <p className="text-pretty">{message.body}</p>}

          {message.kind === 'voice' && (
            <VoiceMessage
              seconds={message.seconds}
              waveform={message.waveform}
              mine={mine}
            />
          )}

          {message.kind === 'file' && (
            <span className="flex w-[13rem] items-center gap-3">
              <span
                className={cn(
                  'grid size-10 shrink-0 place-items-center rounded-xl',
                  mine ? 'bg-primary-foreground/15' : 'bg-accent',
                )}
              >
                <FileText className={cn('size-5', mine ? '' : 'text-primary')} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm">{message.name}</span>
                <span
                  className={cn(
                    'font-mono text-[10px]',
                    mine ? 'text-primary-foreground/70' : 'text-muted-foreground',
                  )}
                >
                  {message.size} · PDF
                </span>
              </span>
              <Download
                className={cn(
                  'size-4 shrink-0',
                  mine ? 'text-primary-foreground/80' : 'text-muted-foreground',
                )}
              />
            </span>
          )}

          {message.kind === 'video' && (
            <span className="block w-[13rem] overflow-hidden rounded-xl">
              <span className="relative block aspect-[4/3]">
                <Image
                  src={message.poster || '/placeholder.svg'}
                  alt="Video message preview"
                  fill
                  sizes="216px"
                  className="object-cover"
                />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid size-11 place-items-center rounded-full bg-background/80 backdrop-blur-sm">
                    <Play className="size-4 translate-x-[1px] text-primary" fill="currentColor" />
                  </span>
                </span>
                <span className="absolute bottom-1.5 left-1.5 rounded-full bg-background/80 px-2 py-[2px] font-mono text-[10px] text-foreground">
                  {message.length}
                </span>
              </span>
            </span>
          )}

          <span
            className={cn(
              'mt-1 flex items-center justify-end gap-1 font-mono text-[10px]',
              mine ? 'text-primary-foreground/70' : 'text-muted-foreground',
            )}
          >
            {message.time}
            {mine &&
              (message.read ? (
                <CheckCheck className="size-3" />
              ) : (
                <Check className="size-3" />
              ))}
          </span>
        </div>
      </div>

      {message.reactions && message.reactions.length > 0 && (
        <div className={cn('flex flex-wrap gap-1', mine ? 'justify-end pr-1' : 'pl-1')}>
          {message.reactions.map((r) => (
            <button
              key={r.emoji}
              type="button"
              onClick={() => onReact(r.emoji)}
              className={cn(
                'flex items-center gap-1 rounded-full px-2 py-[3px] text-xs transition-transform active:scale-95',
                r.mine
                  ? 'bg-accent text-accent-foreground pressed-sm'
                  : 'bg-card text-card-foreground raised-sm',
              )}
            >
              <span className="text-[13px] leading-none">{r.emoji}</span>
              <span className="font-mono text-[10px] text-muted-foreground">{r.count}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
