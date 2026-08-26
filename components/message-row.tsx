'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  Check,
  CheckCheck,
  ChevronDown,
  Copy,
  Download,
  FileText,
  Play,
  Plus,
  Reply,
  Trash2,
} from 'lucide-react'
import type { Message } from '@/lib/messenger-data'
import { quickReactions, moreReactions } from '@/lib/messenger-data'
import { VoiceMessage } from '@/components/voice-message'
import { cn } from '@/lib/utils'

export function MessageRow({
  message,
  onReact,
  onOpenEmojiMenu,
  onCopy,
  onReply,
  onDelete,
  onLongPress,
  selectionMode = false,
  selected = false,
}: {
  message: Message
  onReact: (emoji: string) => void
  onOpenEmojiMenu: () => void
  onCopy: () => void
  onReply: () => void
  onDelete: () => void
  onLongPress: () => void
  selectionMode?: boolean
  selected?: boolean
}) {
  const [tapMenu, setTapMenu] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const didLongPress = useRef(false)
  const mine = message.mine

  useEffect(() => {
    if (!tapMenu) {
      setExpanded(false)
      return
    }
    const close = () => setTapMenu(false)
    const id = setTimeout(() => document.addEventListener('pointerdown', close), 0)
    return () => {
      clearTimeout(id)
      document.removeEventListener('pointerdown', close)
    }
  }, [tapMenu])

  const beginPress = () => {
    didLongPress.current = false
    timer.current = setTimeout(() => {
      didLongPress.current = true
      setTapMenu(false)
      onLongPress()
    }, 420)
  }

  const endPress = () => {
    if (timer.current) clearTimeout(timer.current)
  }

  const handleClick = () => {
    if (didLongPress.current) {
      didLongPress.current = false
      return
    }
    if (selectionMode) onLongPress()
    else setTapMenu((open) => !open)
  }

  const timeMark = (
    <span
      className={cn(
        'flex items-center justify-end gap-1 font-mono text-[10px]',
        mine ? 'text-primary-foreground/70' : 'text-muted-foreground',
      )}
    >
      {message.time}
      {mine &&
        (message.read ? <CheckCheck className="size-3.5" /> : <Check className="size-3.5" />)}
    </span>
  )

  return (
    <div className={cn('flex flex-col gap-1', mine ? 'items-end' : 'items-start')}>
      <div className="relative">
        {tapMenu && !selectionMode && (
          <div
            className={cn(
              'rise-in absolute z-30 w-52 overflow-hidden rounded-2xl bg-popover p-1.5 raised',
              mine ? 'right-0 top-full mt-2' : 'left-0 top-full mt-2',
            )}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-1 border-b border-border/60 px-1 pb-1.5">
              {quickReactions.slice(0, 5).map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    onReact(emoji)
                    setTapMenu(false)
                  }}
                  className="grid size-8 place-items-center rounded-full text-lg hover:bg-accent active:scale-90"
                  aria-label={`React with ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-label={expanded ? 'Collapse reactions' : 'Expand more reactions'}
                className={cn(
                  'grid size-8 place-items-center rounded-full text-accent-foreground transition-all active:scale-90',
                  expanded ? 'bg-primary text-primary-foreground' : 'bg-accent',
                )}
              >
                <ChevronDown className={cn('size-4 transition-transform', expanded && 'rotate-180')} />
              </button>
            </div>
            {expanded && (
              <div className="rise-in grid grid-cols-6 gap-1 border-b border-border/60 px-1 py-1.5">
                {moreReactions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      onReact(emoji)
                      setTapMenu(false)
                      setExpanded(false)
                    }}
                    className="grid size-8 place-items-center rounded-full text-lg hover:bg-accent active:scale-90"
                    aria-label={`React with ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setTapMenu(false)
                    setExpanded(false)
                    onOpenEmojiMenu()
                  }}
                  className="grid size-8 place-items-center rounded-full bg-accent text-accent-foreground active:scale-90"
                  aria-label="Open full emoji picker"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            )}
            <div className="grid gap-0.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setTapMenu(false)
                  onReply()
                }}
                className="menu-action"
              >
                <Reply className="size-4" /> Reply
              </button>
              <button
                type="button"
                onClick={() => {
                  setTapMenu(false)
                  onCopy()
                }}
                className="menu-action"
              >
                <Copy className="size-4" /> Copy
              </button>
              <button
                type="button"
                onClick={() => {
                  setTapMenu(false)
                  onDelete()
                }}
                className="menu-action text-destructive"
              >
                <Trash2 className="size-4" /> Delete
              </button>
            </div>
          </div>
        )}

        <div
          onPointerDown={beginPress}
          onPointerUp={endPress}
          onPointerCancel={endPress}
          onPointerLeave={endPress}
          onClick={handleClick}
          data-bubble=""
          role="button"
          tabIndex={0}
          aria-label="Message — tap for actions, press and hold to select"
          className={cn(
            message.kind === 'video'
              ? 'select-none text-left'
              : 'block max-w-[17rem] select-none px-3.5 py-2.5 text-left text-[15px] leading-relaxed transition-shadow',
            selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
            message.kind !== 'video' &&
              (mine
                ? 'rounded-2xl rounded-br-md bg-primary text-primary-foreground raised-sm'
                : 'rounded-2xl rounded-bl-md bg-card text-card-foreground raised-sm'),
          )}
        >
          {message.kind === 'text' && <p className="text-pretty">{message.body}</p>}

          {message.kind === 'voice' && (
            <VoiceMessage seconds={message.seconds} waveform={message.waveform} mine={mine} />
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
            <span className="block w-44">
              <span className="relative block aspect-square overflow-hidden rounded-full raised-sm">
                <Image
                  src={message.poster || '/placeholder.svg'}
                  alt="Video message preview"
                  fill
                  sizes="176px"
                  className="object-cover"
                />
                <span className="absolute inset-0 grid place-items-center bg-foreground/10">
                  <span className="grid size-11 place-items-center rounded-full bg-background/85 text-primary backdrop-blur-sm">
                    <Play className="size-4 translate-x-[1px]" fill="currentColor" />
                  </span>
                </span>
              </span>
            </span>
          )}

          <span className="mt-1 block">{timeMark}</span>
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
                r.mine ? 'bg-accent text-accent-foreground pressed-sm' : 'bg-card text-card-foreground raised-sm',
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
