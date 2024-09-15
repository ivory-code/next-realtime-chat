'use client'

import {useEffect, useRef} from 'react'

import {LIMIT_MESSAGE} from '@/lib/constant'
import {type Imessage, useMessage} from '@/lib/store/messages'

interface Props {
  messages: Imessage[]
}

export default function InitMessages({messages}: Props) {
  const hasMore = messages.length >= LIMIT_MESSAGE
  const initState = useRef(false)

  useEffect(() => {
    if (!initState.current) {
      useMessage.setState({messages, hasMore})
    }

    initState.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <></>
}
