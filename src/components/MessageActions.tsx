'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alertDialog'
import {useMessage} from '@/lib/store/messages'
import {supabaseBrowser} from '@/lib/supabase/browser'
import {toast} from 'sonner'

export function DeleteAlert() {
  const actionMessage = useMessage(state => state.actionMessage)
  const deleteMessage = useMessage(state => state.optimisticDeleteMessage)

  const handleDeleteMessage = async () => {
    if (!actionMessage?.id) {
      return
    }

    const supabase = supabaseBrowser()
    const {data, error} = await supabase
      .from('messages')
      .delete()
      .eq('id', actionMessage.id)

    deleteMessage(actionMessage.id)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Successfully delete a message.')
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button id="trigger-delete"></button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteMessage}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
