import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { fetchMainMemos, MainMemo } from './mainServer'
import LoadingPage from '../Loading'
import MainMemoBox from './MainMemoBox'

export default function RecentMemos() {
  const { data: session } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [recentMemos, setRecentMemos] = useState<MainMemo[]>([])

  useEffect(() => {
    const fetchRecentMemos = async () => {
      if (session && session.user && session.user.email) {
        try {
          const memos = await fetchMainMemos(session.user.email)
          setRecentMemos(memos)
        } catch (error) {
          setError((error as Error).message)
        }
      }
      setLoading(false)
    }
    fetchRecentMemos()
  }, [session])

  if (loading) return <LoadingPage />
  if (error) return <div>{error}</div>

  return (
    <div>
      <div className="flex justify-center text-ui-md mb-4 text-primary font-nanumgothic_bold">
        최근 메모
      </div>
      <div className="bg-gray-50 border border-gray-200 w-full min-h-[6rem] sm:min-h-memo-panel p-4 rounded-xl mb-8 flex flex-col gap-3">
        {recentMemos.length > 0 ? (
          recentMemos.map((memo: MainMemo) => (
            <MainMemoBox
              title={memo.content}
              key={memo.id}
              important={memo.important}
            />
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center text-ui-sm text-gray-400 text-center">
            최근 수정/추가된
            <br />
            메모가 없습니다
          </div>
        )}
      </div>
    </div>
  )
}
