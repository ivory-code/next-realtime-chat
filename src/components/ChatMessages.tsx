import {Suspense} from 'react'

import ListMessages from '@/components/ListMessage'
import {LIMIT_MESSAGE} from '@/lib/constant'
import InitMessages from '@/lib/store/InitMessages'
import {supabaseServer} from '@/lib/supabase/server'

export default async function ChatMessages() {
  const supabase = await supabaseServer()

  const {data} = await supabase
    .from('messages')
    .select('*,users(*)')
    .range(0, LIMIT_MESSAGE)
    .order('created_at', {ascending: false})

  return (
    <Suspense fallback={'loading...'}>
      <ListMessages />
      <InitMessages messages={data?.reverse() || []} />
    </Suspense>
  )
}
