'use client'
import { useSession } from 'next-auth/react'
import { addMemo, fetchMemos, Memo } from './memosServer'
import { useEffect, useState } from 'react'
import LoadingPage from '../Loading'
import Button from '../Button'
import MemoBox from './MemoBox'
import useMemoStore from '@/src/store/memoStore'

const Memos = () => {
  const { data: session } = useSession()
  const { memolist, setMemosStore } = useMemoStore()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [newContent, setNewContent] = useState<string>('')
  const [newActive, setNewActive] = useState<boolean>(false)
  const [newImportant, setNewImportant] = useState<boolean>(false)
  const [newConnect, setNewConnect] = useState<boolean>(false)
  const [newTodoId, setNewTodoId] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (session && session.user && session.user.email) {
        try {
          const memosData = await fetchMemos(session.user.email)
          setMemosStore(memosData)
        } catch (error) {
          setError((error as Error).message)
        }
      }
      setLoading(false)
    }
    fetchData()
  }, [session, setMemosStore])

  const handleAddMemo = async () => {
    if (newContent.trim() === '') return
    if (session && session.user && session.user.email) {
      const memo: Omit<Memo, 'id'> = {
        user_email: session.user.email,
        content: newContent,
        todo_id: newTodoId != null ? newTodoId : undefined,
        active: newActive,
        important: newImportant,
        connect: newConnect,
      }
      try {
        const result = await addMemo(memo, session.user.email)
        if (result) {
          setMemosStore([...memolist, { ...memo, id: result.id }])
        }
        setNewContent('')
        setNewActive(false)
        setNewImportant(false)
        setNewTodoId(null)
        setNewConnect(false)
      } catch (error) {
        setError((error as Error).message)
      }
    }
  }

  if (loading) return <LoadingPage />
  if (error) return <div>{error}</div>
  return (
    <div>
      <div>메모</div>
      <div>메모 추가</div>
      <div>
        <input
          className="w-[30rem] text-black mb-[1rem]"
          type="text"
          value={newContent}
          placeholder="새로운 Memo를 추가하세요"
          onChange={(e) => setNewContent(e.target.value)}
        />
        <label>
          중요도
          <input
            type="checkbox"
            checked={newImportant}
            onChange={(e) => setNewImportant(e.target.checked)}
          />
        </label>
        <label>
          활성화
          <input
            type="checkbox"
            checked={newActive}
            onChange={(e) => setNewActive(e.target.checked)}
          />
        </label>
        <label>
          연동가능
          <input
            type="checkbox"
            checked={newConnect}
            onChange={(e) => setNewConnect(e.target.checked)}
          />
        </label>
        <label>
          Todo연동
          <input
            type="text"
            className="text-black mb-[1rem]"
            value={newTodoId ?? ''}
            onChange={(e) => setNewTodoId(e.target.value)}
          />
        </label>
        <Button type="button" onClick={handleAddMemo}>
          추가
        </Button>
      </div>
      <div>
        {memolist.map((memo) => (
          <MemoBox key={memo.id} memo={memo} />
        ))}
      </div>
    </div>
  )
}
export default Memos
