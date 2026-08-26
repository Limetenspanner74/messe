'use client'

import { useState } from 'react'
import { LogIn } from 'lucide-react'
import { chats as seed, type Message } from '@/lib/messenger-data'
import { WelcomeScreen } from '@/components/welcome-screen'
import { NavBar, PhoneFrame } from '@/components/phone-frame'
import { ChatListScreen } from '@/components/chat-list-screen'
import { ChatScreen } from '@/components/chat-screen'
import { ProfileScreen } from '@/components/profile-screen'
import { MyProfileScreen } from '@/components/my-profile-screen'
import { SessionsScreen } from '@/components/sessions-screen'
import { DesktopShell, type Screen } from '@/components/desktop-shell'

export function MessengerApp() {
  const [data, setData] = useState(seed)
  const [started, setStarted] = useState(false)
  const [screen, setScreen] = useState<Screen>({ name: 'chats' })

  if (!started) return <WelcomeScreen onStart={() => setStarted(true)} />

  const update = (id: string, messages: Message[]) =>
    setData((list) =>
      list.map((c) => {
        if (c.id !== id) return c
        const last = messages[messages.length - 1]
        const preview =
          last?.kind === 'text'
            ? `${last.mine ? 'You: ' : ''}${last.body}`
            : last?.kind === 'voice'
              ? `${last.mine ? 'You: ' : ''}Voice message · 0:${String(last.seconds).padStart(2, '0')}`
              : last?.kind === 'file'
                ? `${last.mine ? 'You: ' : ''}${last.name}`
                : `${last?.mine ? 'You: ' : ''}Video message`
        return { ...c, messages, preview, unread: 0 }
      }),
    )

  return (
    <>
      {/* desktop: two panes, side by side */}
      <div className="hidden md:block">
        <DesktopShell chats={data} screen={screen} onScreen={setScreen} onUpdate={update} />
      </div>

      {/* mobile: single phone screen */}
      <div className="md:hidden">
        <MobilePhone data={data} screen={screen} setScreen={setScreen} update={update} />
      </div>
    </>
  )
}

function MobilePhone({
  data,
  screen,
  setScreen,
  update,
}: {
  data: typeof seed
  screen: Screen
  setScreen: (screen: Screen) => void
  update: (id: string, messages: Message[]) => void
}) {
  const chat = 'id' in screen ? data.find((c) => c.id === screen.id) : undefined

  return (
    <PhoneFrame>
      <div className="relative flex-1 overflow-hidden">
        <div key={screen.name + ('id' in screen ? screen.id : '')} className="rise-in h-full">
          {screen.name === 'chats' && (
            <ChatListScreen
              chats={data}
              onOpenChat={(id) => setScreen({ name: 'chat', id })}
              onOpenMyProfile={() => setScreen({ name: 'me' })}
            />
          )}

          {screen.name === 'chat' && chat && (
            <ChatScreen
              chat={chat}
              onBack={() => setScreen({ name: 'chats' })}
              onOpenProfile={() => setScreen({ name: 'profile', id: chat.id })}
              onUpdate={(messages) => update(chat.id, messages)}
            />
          )}

          {screen.name === 'profile' && chat && (
            <ProfileScreen chat={chat} onBack={() => setScreen({ name: 'chat', id: chat.id })} />
          )}

          {screen.name === 'me' && (
            <MyProfileScreen
              onBack={() => setScreen({ name: 'chats' })}
              onOpenSessions={() => setScreen({ name: 'sessions' })}
              onLogOut={() => setScreen({ name: 'loggedOut' })}
            />
          )}

          {screen.name === 'sessions' && (
            <SessionsScreen onBack={() => setScreen({ name: 'me' })} />
          )}

          {screen.name === 'loggedOut' && (
            <div className="flex h-full flex-col items-center justify-center gap-6 px-10 text-center">
              <h1 className="text-2xl font-light tracking-[0.18em] uppercase">Paper</h1>
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                You are logged out. Your chats stay folded until you come back.
              </p>
              <button
                type="button"
                onClick={() => setScreen({ name: 'chats' })}
                className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm text-primary-foreground raised active-press"
              >
                <LogIn className="size-4" />
                Log back in
              </button>
            </div>
          )}
        </div>
      </div>
      <NavBar />
    </PhoneFrame>
  )
}
