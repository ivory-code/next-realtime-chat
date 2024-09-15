import {toast} from 'sonner'

import {Button} from '@/components/ui/button'
import {LIMIT_MESSAGE} from '@/lib/constant'
import {useMessage} from '@/lib/store/messages'
import {supabaseBrowser} from '@/lib/supabase/browser'
import {getFromAndTo} from '@/lib/utils'

export default function LoadMoreMessages() {
  const page = useMessage(state => state.page)
  const setMessages = useMessage(state => state.setMessages)
  const hasMore = useMessage(state => state.hasMore)

  const fetchMore = async () => {
    const {from, to} = getFromAndTo(page, LIMIT_MESSAGE)
    const supabase = supabaseBrowser()

    const {error, data} = await supabase
      .from('messages')
      .select('*,users(*)')
      .range(from, to)
      .order('created_at', {ascending: false})

    if (error) {
      toast.error(error.message)
    } else {
      setMessages(data.reverse())
    }
  }

  if (hasMore) {
    return (
      <Button variant="outline" className="w-full" onClick={fetchMore}>
        Load More
      </Button>
    )
  }
  return <></>
}
