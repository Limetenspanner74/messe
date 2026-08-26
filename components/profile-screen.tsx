'use client'

import Image from 'next/image'
import { ArrowLeft, AtSign, BellOff, Ban, Images, MoreVertical, Phone } from 'lucide-react'
import type { Chat } from '@/lib/messenger-data'

export function ProfileScreen({ chat, onBack }: { chat: Chat; onBack: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="relative h-1/2 shrink-0 overflow-hidden">
        <Image
          src={chat.avatar || '/placeholder.svg'}
          alt={`${chat.name} profile photo`}
          fill
          sizes="420px"
          priority
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/70 to-transparent" />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="grid size-10 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur-sm raised-sm active-press"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="More options"
            className="grid size-10 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur-sm raised-sm active-press"
          >
            <MoreVertical className="size-4" />
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 px-5 pb-4">
          <h1 className="text-2xl font-medium text-balance">{chat.name}</h1>
          <p className="font-mono text-[11px] text-muted-foreground">{chat.presence}</p>
        </div>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-4">
        <ul className="flex flex-col gap-2">
          {[
            { icon: Phone, label: chat.phone, hint: 'mobile' },
            { icon: AtSign, label: chat.status, hint: 'status' },
          ].map((row) => (
            <li
              key={row.hint}
              className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3 raised-sm"
            >
              <row.icon className="size-4 shrink-0 text-primary" />
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-[15px]">{row.label}</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {row.hint}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { icon: Images, label: 'Media' },
            { icon: BellOff, label: 'Mute' },
            { icon: Ban, label: 'Block' },
          ].map((a) => (
            <button
              key={a.label}
              type="button"
              className="flex flex-col items-center gap-2 rounded-2xl bg-card px-2 py-4 raised-sm active-press"
            >
              <a.icon className="size-4 text-muted-foreground" />
              <span className="text-xs">{a.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-3 rounded-2xl bg-card px-4 py-3 raised-sm">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Shared
          </p>
          <p className="mt-1 text-sm text-pretty text-muted-foreground">
            48 photos · 12 files · 31 voice messages
          </p>
        </div>
      </div>
    </div>
  )
}
