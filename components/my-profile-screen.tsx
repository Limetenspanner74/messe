'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  ArrowLeft,
  AtSign,
  Camera,
  Check,
  ChevronRight,
  LogOut,
  MonitorSmartphone,
  Pencil,
  Phone,
} from 'lucide-react'
import { me } from '@/lib/messenger-data'

export function MyProfileScreen({
  onBack,
  onOpenSessions,
  onLogOut,
}: {
  onBack: () => void
  onOpenSessions: () => void
  onLogOut: () => void
}) {
  const [status, setStatus] = useState(me.status)
  const [editing, setEditing] = useState(false)
  const [avatar, setAvatar] = useState(me.avatar)
  const avatars = ['/avatars/me.png', '/avatars/contact-1.png', '/avatars/contact-2.png']
  const [pickerOpen, setPickerOpen] = useState(false)

  return (
    <div className="relative flex h-full flex-col">
      <div className="relative h-1/2 shrink-0 overflow-hidden">
        <Image
          src={avatar || '/placeholder.svg'}
          alt="My profile photo"
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
            aria-label="Back to chats"
            className="grid size-10 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur-sm raised-sm active-press"
          >
            <ArrowLeft className="size-4" />
          </button>
          <span className="rounded-full bg-background/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur-sm">
            My profile
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-5 pb-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-medium text-balance">{me.name}</h1>
            <p className="font-mono text-[11px] text-muted-foreground">{me.username}</p>
          </div>
          <button
            type="button"
            onClick={() => setPickerOpen((v) => !v)}
            aria-label="Change avatar"
            className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground raised active-press"
          >
            <Camera className="size-5" />
          </button>
        </div>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-4">
        {pickerOpen && (
          <div className="rise-in mb-3 flex items-center gap-3 rounded-2xl bg-card p-3 raised-sm">
            {avatars.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => {
                  setAvatar(a)
                  setPickerOpen(false)
                }}
                aria-label="Use this photo"
                className="relative size-14 overflow-hidden rounded-full raised-sm active-press"
              >
                <Image src={a || '/placeholder.svg'} alt="" fill sizes="56px" className="object-cover" />
              </button>
            ))}
            <span className="ml-auto text-xs text-muted-foreground text-pretty">
              Pick a new photo
            </span>
          </div>
        )}

        <ul className="flex flex-col gap-2">
          <li className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3 raised-sm">
            <Phone className="size-4 shrink-0 text-primary" />
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-[15px]">{me.phone}</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                My phone
              </span>
            </span>
          </li>

          <li className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3 raised-sm">
            <AtSign className="size-4 shrink-0 text-primary" />
            <span className="flex min-w-0 flex-1 flex-col">
              {editing ? (
                <input
                  autoFocus
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                      setEditing(false)
                    }
                  }}
                  aria-label="My status"
                  className="w-full bg-transparent text-[15px] outline-none"
                />
              ) : (
                <span className="truncate text-[15px]">{status}</span>
              )}
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                My status
              </span>
            </span>
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              aria-label={editing ? 'Save status' : 'Edit status'}
              className="grid size-9 shrink-0 place-items-center rounded-full bg-background text-muted-foreground pressed-sm"
            >
              {editing ? <Check className="size-4 text-primary" /> : <Pencil className="size-4" />}
            </button>
          </li>
        </ul>

        <div className="mt-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3.5 text-left raised-sm active-press"
          >
            <Camera className="size-4 shrink-0 text-primary" />
            <span className="flex-1 text-[15px]">Change avatar</span>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>

          <button
            type="button"
            onClick={onOpenSessions}
            className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3.5 text-left raised-sm active-press"
          >
            <MonitorSmartphone className="size-4 shrink-0 text-primary" />
            <span className="flex-1 text-[15px]">Active sessions</span>
            <span className="font-mono text-[10px] text-muted-foreground">3</span>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>

          <button
            type="button"
            onClick={onLogOut}
            className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3.5 text-left raised-sm active-press"
          >
            <LogOut className="size-4 shrink-0 text-destructive" />
            <span className="flex-1 text-[15px] text-destructive">Log out</span>
          </button>
        </div>

        <p className="mt-5 px-2 pb-4 text-xs leading-relaxed text-muted-foreground text-pretty">
          {me.bio}
        </p>
      </div>
    </div>
  )
}
