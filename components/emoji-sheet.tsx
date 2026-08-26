'use client'

import { useState } from 'react'
import { Clock, Leaf, Smile, X } from 'lucide-react'
import { emojiRows } from '@/lib/messenger-data'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'recent', icon: Clock, label: 'Recent' },
  { id: 'smileys', icon: Smile, label: 'Smileys' },
  { id: 'objects', icon: Leaf, label: 'Objects' },
]

export function EmojiSheet({
  open,
  title,
  onPick,
  onClose,
}: {
  open: boolean
  title: string
  onPick: (emoji: string) => void
  onClose: () => void
}) {
  const [tab, setTab] = useState('recent')
  if (!open) return null

  const index = tabs.findIndex((t) => t.id === tab)
  const grid = emojiRows.slice(index).concat(emojiRows.slice(0, index)).flat()

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close emoji menu"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/15 backdrop-blur-[1px]"
      />
      <div className="rise-in paper-grain relative rounded-t-[1.75rem] bg-popover px-4 pb-5 pt-3 raised">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-foreground/15" />
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-8 place-items-center rounded-full bg-card text-muted-foreground raised-sm active-press"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-label={t.label}
              className={cn(
                'grid size-9 place-items-center rounded-xl transition-shadow',
                tab === t.id
                  ? 'bg-accent text-primary pressed-sm'
                  : 'bg-card text-muted-foreground raised-sm',
              )}
            >
              <t.icon className="size-4" />
            </button>
          ))}
        </div>

        <div className="grid grid-cols-6 gap-2">
          {grid.map((e, i) => (
            <button
              key={`${e}-${i}`}
              type="button"
              onClick={() => onPick(e)}
              className="grid aspect-square place-items-center rounded-xl bg-card text-2xl raised-sm transition-transform active:scale-90"
              aria-label={`Emoji ${e}`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
