// 최근에 수정/추가한 Memos를 보여주는 컴포넌트
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
    <>
      <div>RecentMemos</div>
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
        <div>최근 수정/추가된 메모가 없습니다</div>
      )}
    </>
  )
}
