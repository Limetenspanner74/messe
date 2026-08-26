'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, MoreVertical, Phone, Search, X } from 'lucide-react'
import type { Chat, Message } from '@/lib/messenger-data'
import { makeWaveform } from '@/lib/messenger-data'
import { MessageRow } from '@/components/message-row'
import { Composer } from '@/components/composer'
import { EmojiSheet } from '@/components/emoji-sheet'
import { StatusBar } from '@/components/phone-frame'

const now = () =>
  new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

export function ChatScreen({
  chat,
  onBack,
  onOpenProfile,
  onUpdate,
  variant = 'mobile',
}: {
  chat: Chat
  onBack: () => void
  onOpenProfile: () => void
  onUpdate: (messages: Message[]) => void
  variant?: 'mobile' | 'desktop'
}) {
  const desktop = variant === 'desktop'
  const [searching, setSearching] = useState(false)
  const [query, setQuery] = useState('')
  const [emoji, setEmoji] = useState<{ target: 'composer' | string } | null>(null)
  const scroller = useRef<HTMLDivElement>(null)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return chat.messages
    return chat.messages.filter((m) => m.kind === 'text' && m.body.toLowerCase().includes(q))
  }, [chat.messages, query])

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight })
  }, [chat.messages.length])

  const react = (id: string, e: string) => {
    onUpdate(
      chat.messages.map((m) => {
        if (m.id !== id) return m
        const list = m.reactions ? [...m.reactions] : []
        const i = list.findIndex((r) => r.emoji === e)
        if (i === -1) return { ...m, reactions: [...list, { emoji: e, count: 1, mine: true }] }
        const found = list[i]
        if (found.mine) {
          if (found.count <= 1) list.splice(i, 1)
          else list[i] = { ...found, count: found.count - 1, mine: false }
        } else {
          list[i] = { ...found, count: found.count + 1, mine: true }
        }
        return { ...m, reactions: list }
      }),
    )
  }

  const append = (m: Message) => onUpdate([...chat.messages, m])
  const id = () => `n${Date.now()}`

  return (
    <div className="relative flex h-full flex-col">
      {desktop ? <div className="pt-4" /> : <StatusBar />}

      <header className="flex items-center gap-2 border-b border-border/60 px-3 pb-3 pt-1">
        {searching ? (
          <>
            <div className="flex h-11 flex-1 items-center gap-2 rounded-full bg-background px-4 pressed">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search in ${chat.name}`}
                aria-label="Search in chat"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setSearching(false)
                setQuery('')
              }}
              aria-label="Close search"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-card text-muted-foreground raised-sm active-press"
            >
              <X className="size-4" />
            </button>
          </>
        ) : (
          <>
            {!desktop && (
              <button
                type="button"
                onClick={onBack}
                aria-label="Back to chats"
                className="grid size-10 shrink-0 place-items-center rounded-full bg-card text-foreground raised-sm active-press"
              >
                <ArrowLeft className="size-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onOpenProfile}
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
            >
              <span className="relative size-10 shrink-0 overflow-hidden rounded-full raised-sm">
                <Image
                  src={chat.avatar || '/placeholder.svg'}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-[15px] font-medium">{chat.name}</span>
                <span className="truncate font-mono text-[10px] text-muted-foreground">
                  {chat.presence}
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setSearching(true)}
              aria-label="Search in chat"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-card text-muted-foreground raised-sm active-press"
            >
              <Search className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Call"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-card text-muted-foreground raised-sm active-press"
            >
              <Phone className="size-4" />
            </button>
            <button
              type="button"
              aria-label="More options"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-card text-muted-foreground raised-sm active-press"
            >
              <MoreVertical className="size-4" />
            </button>
          </>
        )}
      </header>

      <div
        ref={scroller}
        className={
          desktop
            ? 'thin-scrollbar wide-bubbles flex-1 overflow-y-auto px-6 py-6'
            : 'no-scrollbar flex-1 overflow-y-auto px-4 py-4'
        }
        aria-label="Messages"
      >
        <div className={desktop ? 'mx-auto w-full max-w-3xl' : undefined}>
          <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Today
          </p>
          <div className="flex flex-col gap-3">
            {visible.map((m) => (
              <MessageRow
                key={m.id}
                message={m}
                onReact={(e) => react(m.id, e)}
                onOpenEmojiMenu={() => setEmoji({ target: m.id })}
              />
            ))}
          </div>
          {visible.length === 0 && (
            <p className="mt-10 text-center text-sm text-muted-foreground">No messages found.</p>
          )}
        </div>
      </div>

      <Composer
        onOpenEmoji={() => setEmoji({ target: 'composer' })}
        onSendText={(body) =>
          append({ id: id(), kind: 'text', body, time: now(), mine: true, read: false })
        }
        onSendVoice={(seconds) =>
          append({
            id: id(),
            kind: 'voice',
            seconds: Math.max(seconds, 1),
            waveform: makeWaveform(seconds + 5),
            time: now(),
            mine: true,
            read: false,
          })
        }
        onSendFile={() =>
          append({
            id: id(),
            kind: 'file',
            name: 'attachment.pdf',
            size: '1.1 MB',
            time: now(),
            mine: true,
            read: false,
          })
        }
        onSendVideo={() =>
          append({
            id: id(),
            kind: 'video',
            length: '0:12',
            poster: chat.avatar,
            time: now(),
            mine: true,
            read: false,
          })
        }
      />

      <EmojiSheet
        open={emoji !== null}
        title={emoji?.target === 'composer' ? 'Emoji' : 'Add reaction'}
        onClose={() => setEmoji(null)}
        onPick={(e) => {
          if (!emoji) return
          if (emoji.target === 'composer') {
            append({ id: id(), kind: 'text', body: e, time: now(), mine: true, read: false })
          } else {
            react(emoji.target, e)
          }
          setEmoji(null)
        }}
      />
    </div>
  )
}
