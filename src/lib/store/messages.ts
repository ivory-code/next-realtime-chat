import {create} from 'zustand'

import {LIMIT_MESSAGE} from '@/lib/constant'

export type Imessage = {
  id: string
  is_edit: boolean
  send_by: string
  text: string
  created_at: string
  users: {
    avatar_url: string
    created_at: string
    display_name: string
    id: string
  } | null
}

interface MessageState {
  page: number
  hasMore: boolean
  messages: Imessage[]
  actionMessage?: Imessage
  optimisticIds: string[]
  optimisticAddMessage: (message: Imessage) => void
  setActionMessage: (message?: Imessage) => void
  optimisticDeleteMessage: (messageId: string) => void
  optimisticUpdateMessage: (message: Imessage) => void
  setOptimisticIds: (id: string) => void
  setMessages: (message: Imessage[]) => void
}

export const useMessage = create<MessageState>()(set => ({
  page: 1,
  hasMore: true,
  messages: [],
  actionMessage: undefined,
  optimisticIds: [],
  setOptimisticIds: (id: string) =>
    set(state => ({optimisticIds: [...state.optimisticIds, id]})),
  optimisticAddMessage: newMessage =>
    set(state => ({messages: [...state.messages, newMessage]})),
  setActionMessage: message => set(() => ({actionMessage: message})),
  optimisticDeleteMessage: messageId =>
    set(state => {
      return {
        messages: state.messages.filter(message => message.id !== messageId),
      }
    }),
  optimisticUpdateMessage: updateMessage =>
    set(state => {
      return {
        messages: state.messages.filter(message => {
          if (message.id === updateMessage.id) {
            message.text = updateMessage.text
            message.is_edit = updateMessage.is_edit
          }
          return message
        }),
      }
    }),
  setMessages: messages =>
    set(state => ({
      messages: [...messages, ...state.messages],
      page: state.page + 1,
      hasMore: messages.length >= LIMIT_MESSAGE,
    })),
}))
