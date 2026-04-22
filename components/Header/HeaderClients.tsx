'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Header from './Header'

export const HeaderWrapper = () => {
  const router = usePathname()
  const isMainPage = router == '/' || router.startsWith('/main')
  const isMemoPage = router.startsWith('/memo')
  const isToDoPage = router.startsWith('/todo')
  const isStatsPage = router.startsWith('/stats')
  const isFriendPage = router.startsWith('/friend')
  return (
    <header className="flex flex-col justify-center bg-white border-b border-gray-200 overflow-x-hidden sm:flex-row">
      <div className="w-full flex flex-col justify-between items-center px-4 py-3 sm:w-content sm:h-header sm:flex-row sm:px-8 sm:py-0">
        <Header
          isMainPage={isMainPage}
          isMemoPage={isMemoPage}
          isToDoPage={isToDoPage}
          isStatsPage={isStatsPage}
          isFriendPage={isFriendPage}
        />
        <HeaderNaverAuth />
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
    <div className="mt-3 sm:mt-0">
      {session ? (
        <button
          className="font-nanumgothic_regular text-ui-sm sm:text-ui-sm text-gray-600 hover:text-primary"
          onClick={handleSignOut}
        >
          로그아웃
        </button>
      ) : (
        <button
          className="font-nanumgothic_regular text-ui-sm sm:text-ui-sm text-gray-600 hover:text-primary"
          onClick={handleSignIn}
        >
          로그인
        </button>
      )}
    </div>
  )
}
