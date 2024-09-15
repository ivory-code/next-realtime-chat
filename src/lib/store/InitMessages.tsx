'use client'

import {useEffect, useRef} from 'react'

import {type Imessage, useMessage} from '@/lib/store/messages'

interface Props {
  messages: Imessage[]
}

export default function InitMessages({messages}: Props) {
  const initState = useRef(false)

  useEffect(() => {
    if (!initState.current) {
      useMessage.setState({messages})
    }

    initState.current = true
  }, [messages])

  return <></>
}
