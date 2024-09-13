import ListMessages from '@/components/ListMessage'
import InitMessages from '@/lib/store/InitMessages'
import {supabaseServer} from '@/lib/supabase/server'
import {Suspense} from 'react'

export default async function ChatMessages() {
  const supabase = await supabaseServer()

  const {data} = await supabase.from('messages').select('*,users(*)')

  return (
    <Suspense fallback={'loading...'}>
      <ListMessages />
      <InitMessages messages={data || []} />
    </Suspense>
  )
}
