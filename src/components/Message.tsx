import {Imessage} from '@/lib/store/messages'
import Image from 'next/image'
import {IMAGES} from '../../public/assets/images'

interface Props {
  message: Imessage
}

export default function Message({message}: Props) {
  return (
    <div className="flex gap-2">
      <div>
        <Image
          src={message.users?.avatar_url || IMAGES.OGU}
          alt={message.users?.display_name || 'avatar_url'}
          width={40}
          height={40}
          className="rounded-full ring-2"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1">
          <h1 className="font-bold">{message.users?.display_name}</h1>
          <h1 className="text-sm text-gray-400">
            {new Date(message.created_at).toDateString()}
          </h1>
        </div>
        <p className="text-gray-300">{message.text}</p>
      </div>
    </div>
  )
}
