import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import LoadingPage from '../Loading'
import MainMemoBox from './MainMemoBox'
import { fetchMainMemos, MainMemo } from './mainServer'

export default function RecentMemos() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState<boolean>(true)
  const [recentMemos, setRecentMemos] = useState<MainMemo[]>([])

  useEffect(() => {
    const fetchRecentMemos = async () => {
      if (session && session.user && session.user.email) {
        try {
          const memos = await fetchMainMemos(session.user.email)
          setRecentMemos(memos)
        } catch (err) {
          if (err instanceof TypeError) {
            toast.error(
              '서버와 연결할 수 없습니다. 오프라인 상태인지 확인해주세요.'
            )
          } else {
            toast.error('메모 목록을 불러오지 못했습니다.')
          }
        }
      }
      setLoading(false)
    }
    fetchRecentMemos()
  }, [session])

  if (loading) return <LoadingPage />

  return (
    <div>
      <div className="flex flex-wrap gap-y-2 items-center mb-4">
        <span className="text-ui-md text-primary font-nanumgothic_bold">
          최근 메모
        </span>
        <Link
          href="/memo"
          className="ml-auto text-sm font-nanumgothic_bold text-navy3 hover:text-navy hover:underline transition-colors"
        >
          메모 전체보기 →
        </Link>
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
