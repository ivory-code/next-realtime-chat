'use client'

import {ArrowDown} from 'lucide-react'
import {useEffect, useRef, useState} from 'react'
import {toast} from 'sonner'

import LoadMoreMessages from '@/components/LoadMoreMessages'
import Message from '@/components/Message'
import {DeleteAlert, EditAlert} from '@/components/MessageActions'
import {type Imessage, useMessage} from '@/lib/store/messages'
import {supabaseBrowser} from '@/lib/supabase/browser'

export default function ListMessages() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [notification, setNotification] = useState(0)

  const {
    messages,
    optimisticAddMessage,
    optimisticIds,
    optimisticDeleteMessage,
    optimisticUpdateMessage,
  } = useMessage(state => state)
  const supabase = supabaseBrowser()

  const handleOnScroll = () => {
    const scrollContainer = scrollRef.current

    if (scrollContainer) {
      const isScroll =
        scrollContainer.scrollTop <
        scrollContainer.scrollHeight - scrollContainer.clientHeight - 10

      setHasScrolled(isScroll)

      if (
        scrollContainer.scrollTop ===
        scrollContainer.scrollHeight - scrollContainer.clientHeight - 10
      ) {
        setNotification(0)
      }
    }
  }

  const scrollDown = () => {
    if (scrollRef.current?.scrollTop !== undefined) {
      setNotification(0)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  useEffect(() => {
    const channel = supabase
      .channel('chat-room')
      .on(
        'postgres_changes',
        {event: 'INSERT', schema: 'public', table: 'messages'},
        async payload => {
          if (!optimisticIds.includes(payload.new.id)) {
            const {error, data} = await supabase
              .from('users')
              .select('*')
              .eq('id', payload.new.send_by)
              .single()

            if (error) {
              toast.error(error.message)
            } else {
              const newMessage = {
                ...payload.new,
                users: data,
              }

              optimisticAddMessage(newMessage as Imessage)
            }
            const scrollContainer = scrollRef.current
            const isScroll =
              scrollContainer &&
              scrollContainer.scrollTop <
                scrollContainer.scrollHeight - scrollContainer.clientHeight - 10

            if (isScroll) {
              setNotification(current => current + 1)
            }
          }
        },
      )
      .on(
        'postgres_changes',
        {event: 'DELETE', schema: 'public', table: 'messages'},
        payload => {
          optimisticDeleteMessage(payload.old.id)
        },
      )
      .on(
        'postgres_changes',
        {event: 'UPDATE', schema: 'public', table: 'messages'},
        payload => {
          optimisticUpdateMessage(payload.new as Imessage)
        },
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [
    messages,
    optimisticAddMessage,
    optimisticDeleteMessage,
    optimisticIds,
    optimisticUpdateMessage,
    supabase,
  ])

  useEffect(() => {
    const scrollContainer = scrollRef.current

    if (scrollContainer && !hasScrolled) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  }, [hasScrolled, messages])

  return (
    <>
      <div
        className="flex-1 flex flex-col p-5 h-full overflow-y-auto gap-5"
        ref={scrollRef}
        onScroll={handleOnScroll}>
        <div className="flex-1">
          <LoadMoreMessages />
        </div>
        <div className="space-y-7">
          {messages.map((value, index) => {
            return <Message key={index} message={value} />
          })}
        </div>
        <DeleteAlert />
        <EditAlert />
      </div>
      {hasScrolled && (
        <div className="absolute bottom-20 w-full">
          {notification ? (
            <div
              className="w-36 mx-auto bg-indigo-500 p-1 rounded-md cursor-pointer"
              onClick={scrollDown}>
              <h1>New {notification} messages</h1>
            </div>
          ) : (
            <div
              className="w-10 h-10 bg-blue-500 rounded-full justify-center items-center flex mx-auto border cursor-pointer hover:scale-110 transition-all"
              onClick={scrollDown}>
              <ArrowDown />
            </div>
          )}
        </div>
      )}
    </>
  )
}
