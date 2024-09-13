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
import {Button} from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {Input} from '@/components/ui/input'
import {useMessage} from '@/lib/store/messages'
import {supabaseBrowser} from '@/lib/supabase/browser'
import {useRef} from 'react'
import {toast} from 'sonner'

export function DeleteAlert() {
  const actionMessage = useMessage(state => state.actionMessage)
  const optimisticDeleteMessage = useMessage(
    state => state.optimisticDeleteMessage,
  )

  const handleDeleteMessage = async () => {
    if (!actionMessage?.id) {
      return
    }

    const supabase = supabaseBrowser()

    optimisticDeleteMessage(actionMessage.id)

    const {error} = await supabase
      .from('messages')
      .delete()
      .eq('id', actionMessage.id)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Delete Successfully.')
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

export function EditAlert() {
  const actionMessage = useMessage(state => state.actionMessage)
  const optimisticUpdateMessage = useMessage(
    state => state.optimisticUpdateMessage,
  )

  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleEdit = async () => {
    const supabase = supabaseBrowser()

    if (!actionMessage?.id) {
      return
    }

    const text = inputRef.current?.value.trim()

    if (!text) {
      document.getElementById('trigger-edit')?.click()
      document.getElementById('trigger-delete')?.click()
      return
    }

    optimisticUpdateMessage({...actionMessage, text, is_edit: true})

    const {error} = await supabase
      .from('messages')
      .update({text, is_edit: true})
      .eq('id', actionMessage.id)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Update Successfully.')
    }

    document.getElementById('trigger-edit')?.click()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button id="trigger-edit"></button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
        </DialogHeader>
        <Input id="name" defaultValue={actionMessage?.text} ref={inputRef} />
        <DialogFooter>
          <Button type="submit" onClick={handleEdit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
