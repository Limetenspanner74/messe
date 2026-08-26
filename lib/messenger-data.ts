export type Reaction = { emoji: string; count: number; mine?: boolean }

export type Message =
  | {
      id: string
      kind: 'text'
      body: string
      time: string
      mine: boolean
      reactions?: Reaction[]
      read?: boolean
    }
  | {
      id: string
      kind: 'voice'
      seconds: number
      waveform: number[]
      time: string
      mine: boolean
      played?: boolean
      reactions?: Reaction[]
      read?: boolean
    }
  | {
      id: string
      kind: 'file'
      name: string
      size: string
      time: string
      mine: boolean
      reactions?: Reaction[]
      read?: boolean
    }
  | {
      id: string
      kind: 'video'
      length: string
      poster: string
      time: string
      mine: boolean
      reactions?: Reaction[]
      read?: boolean
    }

export type Chat = {
  id: string
  name: string
  phone: string
  status: string
  presence: string
  avatar: string
  date: string
  unread?: number
  muted?: boolean
  preview: string
  messages: Message[]
}

const wave = (seed: number, n = 34) =>
  Array.from({ length: n }, (_, i) => {
    const v = Math.sin((i + seed) * 1.7) * Math.cos((i + seed) * 0.63)
    return 0.28 + Math.abs(v) * 0.72
  })

export const me = {
  name: 'Oleg Danilov',
  phone: '+7 921 480 55 12',
  username: '@olegd',
  status: 'Reading, will reply slowly',
  avatar: '/avatars/me.png',
  bio: 'Bookbinder. Collecting paper textures and long voice notes.',
}

export const sessions = [
  {
    id: 's1',
    device: 'Pixel 8 Pro',
    app: 'Paper Android 4.2.1',
    location: 'Saint Petersburg, RU',
    last: 'online',
    current: true,
  },
  {
    id: 's2',
    device: 'MacBook Air',
    app: 'Paper Desktop 3.0',
    location: 'Saint Petersburg, RU',
    last: '2 hours ago',
  },
  {
    id: 's3',
    device: 'iPad mini',
    app: 'Paper iOS 4.1',
    location: 'Tbilisi, GE',
    last: 'Aug 12',
  },
]

export const chats: Chat[] = [
  {
    id: 'igor',
    name: 'Igor',
    phone: '+7 911 204 71 03',
    status: 'Father. Sends links, never opens them.',
    presence: 'last seen 12 minutes ago',
    avatar: '/avatars/contact-1.png',
    date: '23.08',
    unread: 2,
    preview: 'Voice message · 0:14',
    messages: [
      {
        id: 'm1',
        kind: 'text',
        body: 'Did the paper for the covers arrive? The warm one, not the grey.',
        time: '10:02',
        mine: false,
      },
      {
        id: 'm2',
        kind: 'text',
        body: 'Arrived this morning. Two rolls, both warm.',
        time: '10:05',
        mine: true,
        read: true,
        reactions: [{ emoji: '👍', count: 1 }],
      },
      {
        id: 'm3',
        kind: 'voice',
        seconds: 14,
        waveform: wave(3),
        time: '10:07',
        mine: false,
        reactions: [{ emoji: '🔥', count: 2, mine: true }],
      },
      {
        id: 'm4',
        kind: 'file',
        name: 'binding-guide.pdf',
        size: '2.4 MB',
        time: '10:09',
        mine: false,
      },
      {
        id: 'm5',
        kind: 'text',
        body: 'Read it before you glue anything.',
        time: '10:09',
        mine: false,
      },
      {
        id: 'm6',
        kind: 'voice',
        seconds: 8,
        waveform: wave(11),
        time: '10:21',
        mine: true,
        read: true,
      },
    ],
  },
  {
    id: 'junaa',
    name: 'Junaa',
    phone: '+995 555 12 88 40',
    status: 'somewhere between two cities',
    presence: 'online',
    avatar: '/avatars/contact-3.png',
    date: '18.08',
    preview: 'You: Guess who?',
    messages: [
      {
        id: 'j1',
        kind: 'text',
        body: 'Guess who?',
        time: '21:40',
        mine: true,
        read: true,
        reactions: [{ emoji: '😂', count: 1 }],
      },
      {
        id: 'j2',
        kind: 'voice',
        seconds: 21,
        waveform: wave(7),
        time: '21:44',
        mine: false,
      },
      {
        id: 'j3',
        kind: 'video',
        length: '0:37',
        poster: '/avatars/contact-3.png',
        time: '21:46',
        mine: false,
        reactions: [{ emoji: '❤️', count: 3, mine: true }],
      },
      {
        id: 'j4',
        kind: 'text',
        body: 'The light there is unfair. Send more.',
        time: '21:52',
        mine: true,
        read: true,
      },
    ],
  },
  {
    id: 'marta',
    name: 'Marta Ilyina',
    phone: '+7 903 771 09 22',
    status: 'Typesetter at Verso Press',
    presence: 'last seen yesterday',
    avatar: '/avatars/contact-2.png',
    date: '16.08',
    unread: 5,
    preview: 'Proofs are on your desk, third shelf',
    messages: [
      {
        id: 'k1',
        kind: 'text',
        body: 'Proofs are on your desk, third shelf.',
        time: '09:12',
        mine: false,
      },
      {
        id: 'k2',
        kind: 'voice',
        seconds: 33,
        waveform: wave(19),
        time: '09:15',
        mine: false,
      },
      {
        id: 'k3',
        kind: 'text',
        body: 'Found them. The kerning on page 40 is still fighting me.',
        time: '11:48',
        mine: true,
        read: false,
        reactions: [{ emoji: '👀', count: 1 }],
      },
    ],
  },
  {
    id: 'workshop',
    name: 'Workshop · 6',
    phone: 'group',
    status: 'Group of six binders',
    presence: '2 online',
    avatar: '/avatars/contact-1.png',
    date: '14.08',
    muted: true,
    preview: 'Marta: glue delivery moved to Friday',
    messages: [
      {
        id: 'w1',
        kind: 'text',
        body: 'Glue delivery moved to Friday.',
        time: '13:00',
        mine: false,
      },
      {
        id: 'w2',
        kind: 'text',
        body: 'Noted. I will keep the press free.',
        time: '13:14',
        mine: true,
        read: true,
      },
    ],
  },
]

export const emojiRows = [
  ['❤️', '😂', '👍', '🔥', '👀', '🙏'],
  ['😮', '😢', '🎉', '🤝', '☕️', '📖'],
  ['✍️', '🌿', '🕯', '🧵', '💡', '🐈'],
]

export const quickReactions = ['❤️', '😂', '👍', '🔥', '😮', '🙏']

export const makeWaveform = wave
