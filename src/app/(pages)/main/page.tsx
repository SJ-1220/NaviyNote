'use client'
import { signOut, useSession } from 'next-auth/react'
import { useEffect } from 'react'

export default function MainPage() {
  const { data: session } = useSession()
  useEffect(() => {
    console.log('세션 정보:', session)
  }, [session])
  return (
    <>
      <div>홈페이지입니다</div>
      <h2>안녕하세요</h2>
      {session && session.user ? (
        <>
          <h3>{session.user.name}님!</h3>
          <h3>당신의 네이버 메일 주소는 {session.user.email}입니다</h3>
          <button type="button" onClick={() => signOut()}>
            로그아웃
          </button>
        </>
      ) : (
        ''
      )}
    </>
  )
}
