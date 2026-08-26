'use client'

import { useState } from 'react'
import { ArrowRight, Check, Copy, KeyRound, LockKeyhole, UserRound } from 'lucide-react'

const token = 'paper://join/olegd-7f4c-91a2'

export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  const [copied, setCopied] = useState(false)

  const copyToken = async () => {
    await navigator.clipboard.writeText(token)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="paper-grain flex min-h-dvh items-center justify-center bg-background px-4 py-6 sm:px-6">
      <div className="relative flex min-h-[calc(100dvh-3rem)] w-full max-w-[420px] flex-col overflow-hidden rounded-[2.5rem] bg-background px-5 py-6 raised sm:min-h-[860px]">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span>Paper messenger</span>
          <span>01 / 01</span>
        </div>

        <div className="flex flex-1 flex-col justify-center pb-8 pt-12">
          <div className="mb-7 grid size-20 place-items-center rounded-[1.75rem] bg-primary text-primary-foreground raised">
            <KeyRound className="size-8" />
          </div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
            A quieter way to talk
          </p>
          <h1 className="max-w-xs text-4xl font-light leading-[1.05] tracking-tight">
            Welcome to Paper.
          </h1>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
            Keep your conversations close, beautifully simple, and ready wherever you open them.
          </p>

          <div className="mt-9 rounded-[1.5rem] bg-card p-4 raised-sm">
            <div className="mb-3 flex items-center gap-2 text-xs font-medium">
              <LockKeyhole className="size-4 text-primary" />
              <span>Your personal token link</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-background px-3 py-3 pressed-sm">
              <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-muted-foreground">
                {token}
              </span>
              <button
                type="button"
                onClick={copyToken}
                className="grid size-9 shrink-0 place-items-center rounded-full bg-card text-primary raised-sm active-press"
                aria-label={copied ? 'Token copied' : 'Copy personal token link'}
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              </button>
            </div>
            <p className="mt-2 px-1 text-[11px] leading-relaxed text-muted-foreground">
              Share this link only with people you trust.
            </p>
          </div>

          <div className="mt-4 grid gap-2">
            <label className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3 raised-sm">
              <UserRound className="size-4 shrink-0 text-primary" />
              <input
                placeholder="Your name"
                aria-label="Your name"
                className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
              />
            </label>
            <label className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3 raised-sm">
              <LockKeyhole className="size-4 shrink-0 text-primary" />
              <input
                type="password"
                placeholder="Create a password"
                aria-label="Create a password"
                className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
              />
            </label>
          </div>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="flex w-full items-center justify-between rounded-2xl bg-primary px-5 py-4 text-[15px] text-primary-foreground raised active-press"
        >
          <span>Start using Paper</span>
          <ArrowRight className="size-5" />
        </button>
      </div>
    </div>
  )
}
