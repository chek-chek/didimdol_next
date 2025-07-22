'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/useAuthStore'

export default function AuthListener() {
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn)

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session && session.user) {
          setIsLoggedIn(true)
        } else {
          setIsLoggedIn(false)
        }
      }
    )

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [setIsLoggedIn])

  return null
}
