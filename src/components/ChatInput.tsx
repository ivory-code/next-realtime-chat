'use client'

import {toast} from 'sonner'
import {v4 as uuidv4} from 'uuid'

import {Input} from '@/components/ui/input'
import {useMessage} from '@/lib/store/messages'
import {useUser} from '@/lib/store/user'
import {supabaseBrowser} from '@/lib/supabase/browser'

export default function ChatInput() {
  const user = useUser(state => state.user)
  const optimisticAddMessage = useMessage(state => state.optimisticAddMessage)
  const setOptimisticIds = useMessage(state => state.setOptimisticIds)
  const supabase = supabaseBrowser()

  const handleSendMessage = async (text: string) => {
    if (text.trim()) {
      const newMessage = {
        id: uuidv4(),
        text,
        send_by: user?.id || '',
        is_edit: false,
        created_at: new Date().toISOString(),
        users: {
          id: user?.id || '',
          avatar_url: user?.user_metadata.avatar_url || '',
          created_at: new Date().toISOString(),
          display_name: user?.user_metadata.user_name || '',
        },
      }

      optimisticAddMessage(newMessage)
      setOptimisticIds(newMessage.id)

      const {error} = await supabase.from('messages').insert({text})

      if (error) {
        toast.error(error.message)
      }
    } else {
      toast.error('Message can not be empty!!')
    }
  }

  return (
    <div className="p-5">
      <Input
        placeholder="send message"
        onKeyDown={e => {
          if (e.key === 'Enter') {
            handleSendMessage(e.currentTarget.value)
            e.currentTarget.value = ''
          }
        }}
      />
    </div>
  )
}
