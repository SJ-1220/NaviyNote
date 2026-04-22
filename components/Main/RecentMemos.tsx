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
      <div className="flex justify-center text-ui-md mb-8 text-primary font-bold">
        최근 메모
      </div>
      <div className="bg-gray-50 border border-gray-200 w-56 min-h-memo-panel p-4 rounded-xl mb-8">
        {recentMemos.length > 0 ? (
          <div>
            {recentMemos.map((memo: MainMemo) => (
              <MainMemoBox
                title={memo.content}
                key={memo.id}
                important={memo.important}
              />
            ))}
          </div>
        ) : (
          <div className="text-ui-sm text-primary py-80 justify-items-center">
            <div className="mb-8">최근</div>
            <div className="mb-8">수정/추가된</div>
            <div className="mb-8">메모가</div>
            <div>없습니다</div>
          </div>
        )}
      </div>
    </div>
  )
}
