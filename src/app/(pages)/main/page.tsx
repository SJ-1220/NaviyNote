'use client'
import LoadingPage from '@/components/Loading'
import Main from '@/components/Main/Main'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function MainPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session || !session.user) {
      router.push('/')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return <LoadingPage />
  }

  if (!session || !session.user) {
    return null
  }

  return <Main />
}
