'use client'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
export default function CheckAccess() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated' && session.accessToken) {
      console.log('토큰 도착', session?.accessToken)
    }
    if (status === 'authenticated' && !session.accessToken) {
      console.log('인증 완료, 토큰 불러오는 중...')
    }
    if (status === 'loading') {
      console.log('인증 로딩')
    }
  }, [status, session, session?.accessToken])
  return (
    <div>
      {status === 'loading'
        ? '토큰 불러오는 중...'
        : `accessToken:${session?.accessToken}`}
    </div>
  )
}
