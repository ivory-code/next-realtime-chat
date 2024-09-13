'use client'

import {Imessage, useMessage} from '@/lib/store/messages'
import {useEffect, useRef} from 'react'

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
  }, [])

  return <></>
}
