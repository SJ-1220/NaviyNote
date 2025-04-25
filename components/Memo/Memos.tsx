'use client'
import { useSession } from 'next-auth/react'
import {
  addMemo,
  deleteMemo,
  fetchMemos,
  Memo,
  updateMemo,
} from './memosServer'
import { useEffect, useState } from 'react'
import LoadingPage from '../Loading'
import Button from '../Button'
import MemoBox from './MemoBox'

const Memos = () => {
  const { data: session } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [memos, setMemos] = useState<Memo[]>([])
  const [newContent, setNewContent] = useState<string>('')
  const [newActive, setNewActive] = useState<boolean>(false)
  const [newImportant, setNewImportant] = useState<boolean>(false)
  const [newConnect, setNewConnect] = useState<boolean>(false)
  const [newTodoId, setNewTodoId] = useState<string | null>(null)
  const [editMemo, setEditMemo] = useState<Memo | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (session && session.user && session.user.email) {
        try {
          const memosData = await fetchMemos(session.user.email)
          setMemos(memosData)
        } catch (error) {
          setError((error as Error).message)
        }
      }
      setLoading(false)
    }
    fetchData()
  }, [session])

  const handleAddMemo = async () => {
    if (newContent.trim() === '') return
    if (session && session.user && session.user.email) {
      const memo: Omit<Memo, 'id'> = {
        user_email: session.user.email,
        content: newContent,
        todo_id: newTodoId,
        active: newActive,
        important: newImportant,
        connect: newConnect,
      }
      try {
        const result = await addMemo(memo, session.user.email)
        if (result) {
          setMemos([...memos, { ...memo, id: result.id }])
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

  const handleDeleteMemo = async (deleteMemoId: string) => {
    if (!session?.user?.email) return
    try {
      await deleteMemo(deleteMemoId, session.user.email)
      setMemos(memos.filter((memo) => memo.id !== deleteMemoId))
    } catch (error) {
      setError((error as Error).message)
    }
  }
  const handleEditMemo = async (memo: Memo) => {
    if (!memo) return
    setEditMemo(memo)
    setNewContent(memo.content)
    setNewActive(memo.active)
    setNewImportant(memo.important)
    setNewTodoId(memo.todo_id)
    setNewConnect(memo.connect)
  }

  const updateMemoInput = async () => {
    if (!editMemo || !session?.user?.email) return
    const updatedMemo = {
      ...editMemo,
      content: newContent,
      active: newActive,
      important: newImportant,
      todo_id: newTodoId,
      connect: newConnect,
    }
    try {
      await updateMemo(editMemo.id, updatedMemo, session.user.email)
      setMemos(
        memos.map((memo) => (memo.id == editMemo.id ? updatedMemo : memo))
      )
      setEditMemo(null)
      setNewContent('')
      setNewActive(false)
      setNewImportant(false)
      setNewTodoId(null)
      setNewConnect(false)
    } catch (error) {
      setError((error as Error).message)
    }
  }

  if (loading) return <LoadingPage />
  if (error) return <div>{error}</div>
  return (
    <div>
      <div>메모</div>
      <div>메모 추가/수정</div>
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
      {editMemo ? (
        <Button type="button" onClick={updateMemoInput}>
          수정
        </Button>
      ) : (
        <Button type="button" onClick={handleAddMemo}>
          추가
        </Button>
      )}
      <div>
        {memos.map((memo) => (
          <div
            key={memo.id}
            className="outline-dotted outline-white rounded-lg p-[2rem] m-[2rem]"
          >
            <MemoBox key={memo.id} memo={memo} />
            <Button
              type="button"
              onClick={() => {
                handleEditMemo(memo)
              }}
            >
              수정
            </Button>
            <Button type="button" onClick={() => handleDeleteMemo(memo.id)}>
              삭제
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
export default Memos
