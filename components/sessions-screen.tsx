'use client'

import { useState } from 'react'
import { ArrowLeft, Laptop, Smartphone, Tablet, X } from 'lucide-react'
import { sessions as initial } from '@/lib/messenger-data'
import { StatusBar } from '@/components/phone-frame'

const icons = [Smartphone, Laptop, Tablet]

export function SessionsScreen({ onBack }: { onBack: () => void }) {
  const [list, setList] = useState(initial)

  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      <header className="flex items-center gap-3 px-4 pb-4 pt-1">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to my profile"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-card raised-sm active-press"
        >
          <ArrowLeft className="size-4" />
        </button>
        <h1 className="text-lg font-medium">Active sessions</h1>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-6">
        <ul className="flex flex-col gap-2">
          {list.map((s, i) => {
            const Icon = icons[i % icons.length]
            return (
              <li
                key={s.id}
                className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3.5 raised-sm"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-primary">
                  <Icon className="size-4" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-[15px]">{s.device}</span>
                    {s.current && (
                      <span className="rounded-full bg-primary px-2 py-[1px] font-mono text-[9px] uppercase text-primary-foreground">
                        this device
                      </span>
                    )}
                  </span>
                  <span className="truncate text-[13px] text-muted-foreground">{s.app}</span>
                  <span className="truncate font-mono text-[10px] text-muted-foreground">
                    {s.location} · {s.last}
                  </span>
                </span>
                {!s.current && (
                  <button
                    type="button"
                    onClick={() => setList((l) => l.filter((x) => x.id !== s.id))}
                    aria-label={`End session on ${s.device}`}
                    className="grid size-9 shrink-0 place-items-center rounded-full bg-background text-destructive pressed-sm"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </li>
            )
          })}
        </ul>

        {list.length > 1 && (
          <button
            type="button"
            onClick={() => setList((l) => l.filter((x) => x.current))}
            className="mt-4 w-full rounded-2xl bg-card px-4 py-3.5 text-[15px] text-destructive raised-sm active-press"
          >
            Terminate all other sessions
          </button>
        )}
      </div>
    </div>
  )
}
