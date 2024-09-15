'use client'

import {type User} from '@supabase/supabase-js'
import {useEffect, useRef} from 'react'

import {useUser} from '@/lib/store/user'

interface Props {
  user?: User
}

export default function InitUser({user}: Props) {
  const initState = useRef(false)

  useEffect(() => {
    if (!initState.current) {
      useUser.setState({user})
    }

    initState.current = true
  }, [user])

  return <></>
}
