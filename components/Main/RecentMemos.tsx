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
    <div>
      <div className="flex justify-center text-[2rem] mb-[2rem]">최근 메모</div>
      <div className="bg-lightnavy w-[14rem] min-h-[59rem] outline-[0.2rem] p-[1rem] outline-dashed rounded-lg mb-[2rem]">
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
          <div className="text-[1.5rem] text-navy py-[20rem] justify-items-center">
            <div className="mb-[2rem]">최근</div>
            <div className="mb-[2rem]">수정/추가된</div>
            <div className="mb-[2rem]">메모가</div>
            <div>없습니다</div>
          </div>
        )}
      </div>
    </div>
  )
}
