'use client'

import { useEffect, useRef, useState } from 'react'
import { Mic, Paperclip, SendHorizontal, Smile, Trash2, Video } from 'lucide-react'
import { cn } from '@/lib/utils'
import { makeWaveform } from '@/lib/messenger-data'

function fmt(s: number) {
  const m = Math.floor(s / 60)
  const r = Math.floor(s % 60)
  return `${m}:${r.toString().padStart(2, '0')}`
}

export function Composer({
  onSendText,
  onSendVoice,
  onSendFile,
  onSendVideo,
  onOpenEmoji,
}: {
  onSendText: (text: string) => void
  onSendVoice: (seconds: number) => void
  onSendFile: () => void
  onSendVideo: () => void
  onOpenEmoji: () => void
}) {
  const [text, setText] = useState('')
  const [recording, setRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!recording) return
    const id = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(id)
  }, [recording])

  const stop = (send: boolean) => {
    if (send && elapsed > 0) onSendVoice(elapsed)
    setRecording(false)
    setElapsed(0)
  }

  const submit = () => {
    const value = text.trim()
    if (!value) return
    onSendText(value)
    setText('')
  }

  if (recording) {
    const bars = makeWaveform(elapsed, 28)
    return (
      <div className="flex items-center gap-3 border-t border-border/60 bg-background px-3 py-3">
        <button
          type="button"
          onClick={() => stop(false)}
          aria-label="Cancel recording"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-card text-destructive raised-sm active-press"
        >
          <Trash2 className="size-4" />
        </button>
        <div className="flex h-11 flex-1 items-center gap-2 rounded-full bg-background px-4 pressed">
          <span className="size-2 shrink-0 animate-pulse rounded-full bg-destructive" />
          <span className="font-mono text-xs text-muted-foreground">{fmt(elapsed)}</span>
          <span className="flex h-5 flex-1 items-center gap-[2px] overflow-hidden">
            {bars.map((h, i) => (
              <i
                key={i}
                style={{ height: `${Math.round(h * 100)}%` }}
                className="w-[3px] shrink-0 rounded-full bg-primary/60"
              />
            ))}
          </span>
        </div>
        <button
          type="button"
          onClick={() => stop(true)}
          aria-label="Send voice message"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground raised-sm active-press"
        >
          <SendHorizontal className="size-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-end gap-2 border-t border-border/60 bg-background px-3 py-3">
      <input
        ref={fileInput}
        type="file"
        className="hidden"
        onChange={() => onSendFile()}
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="flex flex-1 items-end gap-1 rounded-3xl bg-background px-2 py-1.5 pressed">
        <button
          type="button"
          onClick={onOpenEmoji}
          aria-label="Open emoji menu"
          className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:text-primary"
        >
          <Smile className="size-5" />
        </button>
        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing &&
              e.keyCode !== 229
            ) {
              e.preventDefault()
              submit()
            }
          }}
          placeholder="Message"
          aria-label="Message"
          className="max-h-24 min-h-9 flex-1 resize-none bg-transparent py-2 text-[15px] leading-tight outline-none placeholder:text-muted-foreground"
        />
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          aria-label="Attach file"
          className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:text-primary"
        >
          <Paperclip className="size-[18px]" />
        </button>
        <button
          type="button"
          onClick={onSendVideo}
          aria-label="Send video message"
          className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:text-primary"
        >
          <Video className="size-[18px]" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => (text.trim() ? submit() : setRecording(true))}
        aria-label={text.trim() ? 'Send message' : 'Record voice message'}
        className={cn(
          'grid size-12 shrink-0 place-items-center rounded-full transition-shadow active-press',
          text.trim()
            ? 'bg-primary text-primary-foreground raised'
            : 'bg-card text-primary raised',
        )}
      >
        {text.trim() ? <SendHorizontal className="size-5" /> : <Mic className="size-5" />}
      </button>
    </div>
  )
}
