'use client'

import {useUser} from '@/lib/store/user'
import {User} from '@supabase/supabase-js'
import {useEffect, useRef} from 'react'

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
  }, [])

  return <></>
}
