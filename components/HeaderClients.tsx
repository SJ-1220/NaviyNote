'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import React from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

export const HeaderWrapper = () => {
  const router = usePathname()
  const isMainPage = router == '/' || router.startsWith('/main')
  const isMemoPage = router.startsWith('/memo')
  const isToDoPage = router.startsWith('/todo')
  const isStatsPage = router.startsWith('/stats')
  const isFriendPage = router.startsWith('/friend')
  return (
    <header className="flex justify-center">
      <div className=" w-[100rem] h-[8.6rem] flex justify-between items-center">
        <Header
          isMainPage={isMainPage}
          isMemoPage={isMemoPage}
          isToDoPage={isToDoPage}
          isStatsPage={isStatsPage}
          isFriendPage={isFriendPage}
        />
        <div>
          <HeaderNaverAuth />
          {/* Dark */}
          <button
            className="font-nanumgothic_regular text-[2rem] ml-[1.5rem]"
            type="button"
          >
            Dark
          </button>
        </div>
      </div>
    </header>
  )
}

export const HeaderNaverAuth = () => {
  const { data: session } = useSession()

  const handleSignIn = () => {
    signIn('naver').catch((error) => console.error('로그인 실패:', error))
  }
  const handleSignOut = () => {
    signOut().catch((error) => console.error('로그아웃 실패:', error))
  }
  return (
    <>
      {session ? (
        <button
          className="font-nanumgothic_regular text-[2rem] ml-[1.5rem]"
          onClick={handleSignOut}
        >
          로그아웃
        </button>
      ) : (
        <button
          className="font-nanumgothic_regular text-[2rem] ml-[1.5rem]"
          onClick={handleSignIn}
        >
          로그인
        </button>
      )}
    </>
  )
}
