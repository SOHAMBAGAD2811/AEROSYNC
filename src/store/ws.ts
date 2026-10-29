import { create } from 'zustand'

type WSStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

interface WSMessage {
  type: string
  payload: unknown
  timestamp: string
}

interface WSState {
  status: WSStatus
  socket: WebSocket | null
  lastMessage: WSMessage | null
  messageHistory: WSMessage[]
  connect: (url: string) => void
  disconnect: () => void
  send: (message: unknown) => void
}

export const useWSStore = create<WSState>((set, get) => ({
  status: 'disconnected',
  socket: null,
  lastMessage: null,
  messageHistory: [],

  connect: (url: string) => {
    if (typeof window === 'undefined') return
    const existing = get().socket
    if (existing) {
      existing.close()
    }

    set({ status: 'connecting' })

    try {
      const ws = new WebSocket(url)

      ws.onopen = () => {
        set({ status: 'connected' })
      }

      ws.onmessage = (event) => {
        try {
          const msg: WSMessage = JSON.parse(event.data as string)
          set((state) => ({
            lastMessage: msg,
            messageHistory: [...state.messageHistory.slice(-99), msg],
          }))
        } catch {
          // ignore
        }
      }

      ws.onerror = () => {
        set({ status: 'error' })
      }

      ws.onclose = () => {
        set({ status: 'disconnected', socket: null })
      }

      set({ socket: ws })
    } catch {
      set({ status: 'error' })
    }
  },

  disconnect: () => {
    const socket = get().socket
    if (socket) {
      socket.close()
    }
    set({ status: 'disconnected', socket: null })
  },

  send: (message: unknown) => {
    const socket = get().socket
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message))
    }
  },
}))
