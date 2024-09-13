'use client'

import Message from '@/components/Message'
import {useMessage} from '@/lib/store/messages'

export default function ListMessages() {
  const messages = useMessage(state => state.messages)

  return (
    <div className="flex-1 flex flex-col p-5">
      <div className="flex-1 flex flex-col p-5 h-full overflow-y-auto"></div>
      <div className="flex-1"></div>
      <div className="space-y-7">
        {messages.map((value, index) => {
          return <Message key={index} message={value} />
        })}
      </div>
    </div>
  )
}
