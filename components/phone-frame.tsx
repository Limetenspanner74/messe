import type { ReactNode } from 'react'

export function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-3 pb-1 font-mono text-[11px] tracking-tight text-muted-foreground">
      <span>9:41</span>
      <div className="flex items-center gap-1.5" aria-hidden="true">
        <span className="flex items-end gap-[2px]">
          <i className="block h-1 w-[3px] rounded-[1px] bg-current" />
          <i className="block h-1.5 w-[3px] rounded-[1px] bg-current" />
          <i className="block h-2 w-[3px] rounded-[1px] bg-current" />
          <i className="block h-2.5 w-[3px] rounded-[1px] bg-current opacity-40" />
        </span>
        <span>LTE</span>
        <span className="ml-1 flex h-2.5 w-5 items-center rounded-[3px] border border-current p-[1.5px]">
          <i className="block h-full w-3/4 rounded-[1px] bg-current" />
        </span>
      </div>
    </div>
  )
}

export function NavBar() {
  return (
    <div className="flex items-center justify-center gap-14 pb-2 pt-1" aria-hidden="true">
      <span className="h-2.5 w-2.5 rotate-45 border-b-2 border-l-2 border-muted-foreground/60" />
      <span className="h-3 w-3 rounded-[3px] border-2 border-muted-foreground/60" />
      <span className="h-3 w-3 rounded-full border-2 border-muted-foreground/60" />
    </div>
  )
}

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background sm:p-6">
      <div className="paper-grain relative flex h-dvh w-full flex-col overflow-hidden bg-background sm:h-[860px] sm:max-w-[420px] sm:rounded-[2.5rem] sm:raised">
        {children}
      </div>
    </div>
  )
}
