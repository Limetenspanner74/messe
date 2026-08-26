'use client'

import { LogIn, MessagesSquare } from 'lucide-react'
import type { Chat, Message } from '@/lib/messenger-data'
import { ChatListScreen } from '@/components/chat-list-screen'
import { ChatScreen } from '@/components/chat-screen'
import { ProfileScreen } from '@/components/profile-screen'
import { MyProfileScreen } from '@/components/my-profile-screen'
import { SessionsScreen } from '@/components/sessions-screen'

export type Screen =
  | { name: 'chats' }
  | { name: 'chat'; id: string }
  | { name: 'profile'; id: string }
  | { name: 'me' }
  | { name: 'sessions' }
  | { name: 'loggedOut' }

/** A framed sheet of paper for the panel screens that were designed phone-width. */
function Sheet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full justify-center overflow-hidden py-6">
      <div className="relative h-full w-full max-w-md overflow-hidden rounded-[2rem] bg-background raised">
        {children}
      </div>
    </div>
  )
}

export function DesktopShell({
  chats,
  screen,
  onScreen,
  onUpdate,
}: {
  chats: Chat[]
  screen: Screen
  onScreen: (screen: Screen) => void
  onUpdate: (id: string, messages: Message[]) => void
}) {
  const chat = 'id' in screen ? chats.find((c) => c.id === screen.id) : undefined
  const activeId = 'id' in screen ? screen.id : undefined

  return (
    <div className="paper-grain flex h-dvh w-full overflow-hidden bg-background">
      <aside className="relative flex w-[21rem] shrink-0 flex-col overflow-hidden border-r border-border/60 xl:w-[23rem]">
        <ChatListScreen
          variant="desktop"
          activeId={activeId}
          chats={chats}
          onOpenChat={(id) => onScreen({ name: 'chat', id })}
          onOpenMyProfile={() => onScreen({ name: 'me' })}
        />
      </aside>

      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <div
          key={screen.name + (activeId ?? '')}
          className="rise-in relative flex h-full flex-col overflow-hidden"
        >
          {screen.name === 'chat' && chat && (
            <ChatScreen
              variant="desktop"
              chat={chat}
              onBack={() => onScreen({ name: 'chats' })}
              onOpenProfile={() => onScreen({ name: 'profile', id: chat.id })}
              onUpdate={(messages) => onUpdate(chat.id, messages)}
            />
          )}

          {screen.name === 'profile' && chat && (
            <Sheet>
              <ProfileScreen chat={chat} onBack={() => onScreen({ name: 'chat', id: chat.id })} />
            </Sheet>
          )}

          {screen.name === 'me' && (
            <Sheet>
              <MyProfileScreen
                onBack={() => onScreen({ name: 'chats' })}
                onOpenSessions={() => onScreen({ name: 'sessions' })}
                onLogOut={() => onScreen({ name: 'loggedOut' })}
              />
            </Sheet>
          )}

          {screen.name === 'sessions' && (
            <Sheet>
              <SessionsScreen onBack={() => onScreen({ name: 'me' })} />
            </Sheet>
          )}

          {screen.name === 'chats' && (
            <div className="flex h-full flex-col items-center justify-center gap-5 px-10 text-center">
              <span className="grid size-20 place-items-center rounded-full bg-card text-primary raised">
                <MessagesSquare className="size-8" />
              </span>
              <h2 className="text-lg font-light uppercase tracking-[0.2em]">Paper</h2>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground text-pretty">
                Pick a conversation on the left to unfold it here.
              </p>
            </div>
          )}

          {screen.name === 'loggedOut' && (
            <div className="flex h-full flex-col items-center justify-center gap-6 px-10 text-center">
              <h1 className="text-2xl font-light uppercase tracking-[0.18em]">Paper</h1>
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground text-pretty">
                You are logged out. Your chats stay folded until you come back.
              </p>
              <button
                type="button"
                onClick={() => onScreen({ name: 'chats' })}
                className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm text-primary-foreground raised active-press"
              >
                <LogIn className="size-4" />
                Log back in
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
