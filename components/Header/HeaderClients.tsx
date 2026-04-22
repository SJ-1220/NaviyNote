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
    <header className="flex justify-center sm:flex-col bg-white border-b border-gray-200">
      <div className="w-content h-header flex sm:flex-col justify-between items-center sm:w-full sm:h-header-sm">
        <Header
          isMainPage={isMainPage}
          isMemoPage={isMemoPage}
          isToDoPage={isToDoPage}
          isStatsPage={isStatsPage}
          isFriendPage={isFriendPage}
        />
        <div className="flex sm:flex-col gap-4">
          <HeaderNaverAuth />
          <button
            className="font-nanumgothic_regular text-ui-md text-gray-600 hover:text-primary"
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
    <div className="sm:flex-col">
      {session ? (
        <button
          className="font-nanumgothic_regular text-ui-md text-gray-600 hover:text-primary"
          onClick={handleSignOut}
        >
          로그아웃
        </button>
      ) : (
        <button
          className="font-nanumgothic_regular text-ui-md text-gray-600 hover:text-primary"
          onClick={handleSignIn}
        >
          로그인
        </button>
      )}
    </div>
  )
}
