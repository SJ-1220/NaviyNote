'use client'

import { useParams, useRouter } from 'next/navigation'
import { deleteMemo, fetchMemos, Memo, updateMemo } from './memosServer'
import useMemoStore from '@/src/store/memoStore'
import { useSession } from 'next-auth/react'
import Button from '../Button'
import React, { useCallback, useEffect, useState } from 'react'
import LoadingPage from '../Loading'

const MemoModal = () => {
  const { memoId } = useParams()
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newContent, setNewContent] = useState<string>('')
  const [newActive, setNewActive] = useState<boolean>(false)
  const [newImportant, setNewImportant] = useState<boolean>(false)
  const [newConnect, setNewConnect] = useState<boolean>(false)
  const [newTodoId, setNewTodoId] = useState<string | null>('')
  const [editMemo, setEditMemo] = useState<Memo | null>(null)
  const memolist = useMemoStore((state) => state.memolist)
  const setMemosStore = useMemoStore((state) => state.setMemosStore)

  useEffect(() => {
    const fetchData = async () => {
      if (memolist.length === 0 && session?.user?.email) {
        try {
          const fetchModalMemos = await fetchMemos(session.user.email)
          setMemosStore(fetchModalMemos)
        } catch (error) {
          console.log(error)
        }
      }
      setLoading(false)
    }
    fetchData()
  }, [session, memolist.length, setMemosStore])

  const memo = memolist.find((memo: Memo) => memo.id === memoId)

  useEffect(() => {
    window.scroll(0, 0)
  }, [])

  const onClose = useCallback(() => {
    router.back()
  }, [router])

  const handleDeleteMemo = async (memoId: string) => {
    if (!session?.user?.email) return
    try {
      await deleteMemo(memoId, session.user.email)
      setMemosStore(memolist.filter((memo) => memo.id !== memoId))
    } catch (error) {
      setError((error as Error).message)
    }
    router.push('/memo')
  }
  const handleEditMemo = (memo: Memo) => {
    if (!memo) return
    setEditMemo(memo)
    setNewContent(memo.content)
    setNewActive(memo.active)
    setNewImportant(memo.important)
    setNewConnect(memo.connect)
    setNewTodoId(memo.todo_id || null)
  }
  const updateMemoInput = async () => {
    if (!editMemo || !session?.user?.email) return
    const updatedTodoId = newTodoId === '' ? null : newTodoId
    const updatedMemo = {
      ...editMemo,
      content: newContent,
      active: newActive,
      important: newImportant,
      connect: newConnect,
      todo_id: updatedTodoId,
    }
    try {
      await updateMemo(editMemo.id, updatedMemo, session.user.email)
      setMemosStore(
        memolist.map((memo) => (memo.id == editMemo.id ? updatedMemo : memo))
      )
      setEditMemo(null)
      setNewContent('')
      setNewActive(false)
      setNewImportant(false)
      setNewConnect(false)
      setNewTodoId(null)
    } catch (error) {
      setError((error as Error).message)
    }
  }
  if (loading) {
    return <LoadingPage />
  }
  if (error) return <div>{error}</div>
  if (!memo) {
    console.log('memo not found')
    return
  }
  return (
    <div
      className="fixed inset-0 bg-black/10 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-black rounded-lg p-[4rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <Button className="m-[2rem]" type="button" onClick={onClose}>
          모달 닫기
        </Button>
        {editMemo ? (
          <Button className="m-[2rem]" type="button" onClick={updateMemoInput}>
            적용
          </Button>
        ) : (
          <Button
            className="m-[2rem]"
            type="button"
            onClick={() => {
              handleEditMemo(memo)
            }}
          >
            수정
          </Button>
        )}
        <Button
          className="m-[2rem]"
          type="button"
          onClick={() => handleDeleteMemo(memo.id)}
        >
          삭제
        </Button>
        <div>MemoModal</div>
        <div>Memo Connent : {memo.content}</div>
        <div>Memo ID : {memo.id}</div>
        {memo.active ? '표시✅' : '숨김❌'}
        {memo.important ? '중요✅' : '안중요❌'}
        {memo.connect ? '연결가능✅' : '연결불가❌'}
        <br />
        {memo.todo_id ? `${memo.todo_id}` : 'todo연결❌'}
        {editMemo && (
          <div>
            <label>
              connent
              <input
                className="w-[30rem] text-black mb-[1rem]"
                type="text"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
            </label>
            <br />
            <label>
              active
              <input
                type="checkbox"
                checked={newActive}
                onChange={(e) => setNewActive(e.target.checked)}
              />
            </label>
            <label>
              important
              <input
                type="checkbox"
                checked={newImportant}
                onChange={(e) => setNewImportant(e.target.checked)}
              />
            </label>
            <label>
              connect
              <input
                type="checkbox"
                checked={newConnect}
                onChange={(e) => setNewConnect(e.target.checked)}
              />
            </label>
            <label>
              todo id
              <input
                type="text"
                value={newTodoId || ''}
                onChange={(e) => setNewTodoId(e.target.value)}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  )
}
export default MemoModal
