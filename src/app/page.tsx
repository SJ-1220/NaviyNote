'use client'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function Home() {
  const { data: session } = useSession()
  return (
    <>
      <div>웹 사이트 설명</div>
      <div>음</div>
      {!session || !session.user ? (
        <button type="button" onClick={() => signIn('naver')}>
          네이버로 로그인
        </button>
      ) : (
        <div>
          <h2>안녕하세요, {session.user.name}님!</h2>
          <button type="button" onClick={() => signOut()}>
            로그아웃
          </button>
        </div>
      )}
    </>
  )
}
