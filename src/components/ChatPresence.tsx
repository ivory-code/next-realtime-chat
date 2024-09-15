'use client'

import {useEffect, useState} from 'react'

import {useUser} from '@/lib/store/user'
import {supabaseBrowser} from '@/lib/supabase/browser'

export default function ChatPresence() {
  const user = useUser(state => state.user)
  const supabase = supabaseBrowser()

  const [onlineUser, setOnlineUser] = useState(0)

  useEffect(() => {
    const channel = supabase.channel('room1')
    channel
      .on('presence', {event: 'sync'}, () => {
        const userIds = []
        for (const id in channel.presenceState()) {
          // @ts-expect-error
          userIds.push(channel.presenceState()[id][0].user_id)
        }

        setOnlineUser([...new Set(userIds)].length)
      })
      .subscribe(async status => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            online_at: new Date().toISOString(),
            user_id: user?.id,
          })
        }
      })
  }, [supabase, user?.id])

  if (!user) {
    return <div className="h-3 w-1" />
  }

  return (
    <div className="flex items-center gap-1">
      <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse" />
      <h1 className="text-sm text-gray-400">{onlineUser} onlines</h1>
    </div>
  )
}
