'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { BellOff, PenLine, Search, X } from 'lucide-react'
import type { Chat } from '@/lib/messenger-data'
import { me } from '@/lib/messenger-data'
import { StatusBar } from '@/components/phone-frame'
import { cn } from '@/lib/utils'

export function ChatListScreen({
  chats,
  onOpenChat,
  onOpenMyProfile,
  variant = 'mobile',
  activeId,
}: {
  chats: Chat[]
  onOpenChat: (id: string) => void
  onOpenMyProfile: () => void
  variant?: 'mobile' | 'desktop'
  activeId?: string
}) {
  const [query, setQuery] = useState('')
  const desktop = variant === 'desktop'

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return chats
    return chats.filter(
      (c) => c.name.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q),
    )
  }, [chats, query])

  return (
    <div className="flex h-full flex-col">
      {desktop ? <div className="pt-4" /> : <StatusBar />}

      <header className={cn('px-4 pb-3 pt-1', desktop && 'pl-6')}>
        <div className="mb-3 flex items-baseline justify-between">
          <h1 className="text-2xl font-light tracking-[0.18em] uppercase">Paper</h1>
          <span className="font-mono text-[10px] text-muted-foreground">
            {chats.length} chats
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMyProfile}
            aria-label="Open my profile"
            className="relative size-11 shrink-0 overflow-hidden rounded-full raised-sm active-press"
          >
            <Image src={me.avatar || '/placeholder.svg'} alt="" fill sizes="44px" className="object-cover" />
          </button>
          <div className="flex h-11 flex-1 items-center gap-2 rounded-full bg-background px-4 pressed">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chats"
              aria-label="Search chats"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="grid size-6 place-items-center rounded-full text-muted-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto px-3 pb-6">
        {results.length === 0 && (
          <p className="mt-16 text-center text-sm text-muted-foreground">
            Nothing here. Try another name.
          </p>
        )}
        <ul className="flex flex-col gap-2">
          {results.map((chat) => (
            <li key={chat.id}>
              <button
                type="button"
                onClick={() => onOpenChat(chat.id)}
                aria-current={activeId === chat.id ? 'true' : undefined}
                className={cn(
                  'flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-shadow active-press',
                  activeId === chat.id
                    ? 'bg-accent text-accent-foreground pressed-sm'
                    : 'bg-card raised-sm',
                )}
              >
                <span className="relative size-13 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={chat.avatar || '/placeholder.svg'}
                    alt=""
                    fill
                    sizes="52px"
                    className="object-cover"
                  />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-[15px] font-medium">{chat.name}</span>
                    {chat.muted && <BellOff className="size-3 shrink-0 text-muted-foreground" />}
                  </span>
                  <span className="truncate text-[13px] text-muted-foreground">
                    {chat.preview}
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className="font-mono text-[10px] text-muted-foreground">{chat.date}</span>
                  {chat.unread ? (
                    <span className="grid min-w-5 place-items-center rounded-full bg-primary px-1.5 py-[2px] font-mono text-[10px] text-primary-foreground">
                      {chat.unread}
                    </span>
                  ) : (
                    <span className="h-4" />
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        aria-label="New message"
        className="absolute bottom-6 right-5 grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground raised active-press"
      >
        <PenLine className="size-5" />
      </button>
    </div>
  )
}
