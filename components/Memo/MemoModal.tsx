'use client'

import { useParams, useRouter } from 'next/navigation'
import {
  deleteMemo,
  fetchMemos,
  fetchMemoWithTodo,
  Memo,
  MemoWithTodo,
  updateMemo,
} from './memosServer'
import useMemoStore from '@/src/store/memoStore'
import { useSession } from 'next-auth/react'
import Button from '../Button'
import React, { useCallback, useEffect, useState } from 'react'
import LoadingPage from '../Loading'
import { fetchMonthTodo, Todo } from '../ToDo/todosServer'
import MonthTodoBox from '../ToDo/MonthTodoBox'

const MemoModal = () => {
  const { memoId } = useParams() // 선택한 memo가 무엇인지
  const { data: session } = useSession() // 로그인한 사용자가 누구인지
  const router = useRouter() //페이지 이동

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [newContent, setNewContent] = useState<string>('')
  const [newActive, setNewActive] = useState<boolean>(false)
  const [newImportant, setNewImportant] = useState<boolean>(false)
  const [newConnect, setNewConnect] = useState<boolean>(false)
  const [newTodoId, setNewTodoId] = useState<string | null>('')

  const [editMemo, setEditMemo] = useState<Memo | null>(null)

  const [newSelectedMonth, setNewSelectedMonth] = useState<string>('')
  const [newMonthTodolist, setNewMonthTodolist] = useState<Todo[]>([])
  const [newConnectTodoTask, setNewConnectTodoTask] = useState<string | null>(
    null
  ) //새롭게 연결할 Todo의 Task

  const memolist = useMemoStore((state) => state.memolist)
  const setMemosStore = useMemoStore((state) => state.setMemosStore)

  const [memoTodo, setMemoTodo] = useState<MemoWithTodo | null>(null) //기존에 연결된 Todo

  const [isTodoNull, setIsTodoNull] = useState<boolean>(false)

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

  useEffect(() => {
    const fetchMemoWithTodoData = async () => {
      if (!memoId || typeof memoId !== 'string' || !session?.user?.email) return
      const memoWithTodo = await fetchMemoWithTodo(memoId, session.user.email)
      setMemoTodo(memoWithTodo)
    }
    fetchMemoWithTodoData()
  }, [memoId, session])

  const memo = memolist.find((memo: Memo) => memo.id === memoId)

  useEffect(() => {
    window.scroll(0, 0)
  }, [])

  useEffect(() => {
    const fetchMonthTodoData = async () => {
      if (!newSelectedMonth || newSelectedMonth.trim() === '') return
      const year = Number(newSelectedMonth.split('-')[0])
      const month = Number(newSelectedMonth.split('-')[1]) - 1
      const start = new Date(year, month, 1)
      const end = new Date(year, month + 1, 0, 23, 59, 59)
      if (session && session.user && session.user.email) {
        try {
          const monthTodos = await fetchMonthTodo(
            session.user.email,
            start.toISOString(),
            end.toISOString()
          )
          setNewMonthTodolist(monthTodos)
        } catch (error) {
          setError((error as Error).message)
        }
      }
    }
    fetchMonthTodoData()
  }, [session, newSelectedMonth])

  const NewMonthNull = () => {
    setNewSelectedMonth('')
    setNewConnectTodoTask('')
    setNewTodoId(null)
    setIsTodoNull(true)
  }

  const TodoIDTask = (id: string, task: string) => {
    setNewConnectTodoTask(task)
    setNewTodoId(id)
  }

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

    const updatedTodoId = newTodoId ? newTodoId : null
    const updatedMemo = {
      ...editMemo,
      content: newContent,
      active: newActive,
      important: newImportant,
      connect: newConnect,
      todo_id: updatedTodoId,
    }
    try {
      const updatedMemos = await updateMemo(
        editMemo.id,
        updatedMemo,
        session.user.email
      )

      setMemosStore((prev) =>
        prev.map((memo) => {
          const updated = updatedMemos.find((m) => m.id === memo.id)
          return updated ? updated : memo
        })
      )

      const updatedMemoWithTodo = await fetchMemoWithTodo(
        editMemo.id,
        session.user.email
      )
      setMemoTodo(updatedMemoWithTodo)

      setEditMemo(null)
      setNewContent('')
      setNewActive(false)
      setNewImportant(false)
      setNewConnect(false)
      setNewTodoId(null)
      setIsTodoNull(false)
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
        className="min-w-[30rem] bg-navy3 text-[1.5rem] rounded-lg p-[4rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-[1rem] flex justify-between">
          <Button
            className="rounded-md bg-navy2 p-[0.5rem]"
            type="button"
            onClick={onClose}
          >
            모달 닫기
          </Button>
          {editMemo ? (
            <Button
              className="rounded-md p-[0.5rem] bg-navy2"
              type="button"
              onClick={updateMemoInput}
            >
              적용
            </Button>
          ) : (
            <Button
              className="rounded-md p-[0.5rem] bg-navy2"
              type="button"
              onClick={() => {
                handleEditMemo(memo)
              }}
            >
              수정
            </Button>
          )}
          <Button
            className="rounded-md p-[0.5rem] bg-navy2"
            type="button"
            onClick={() => handleDeleteMemo(memo.id)}
          >
            삭제
          </Button>
        </div>
        <div className="text-center text-[2rem] font-bold mb-[2rem]">
          MemoModal
        </div>
        {!editMemo && (
          <div>
            <div className="mb-[1rem]">메모 : {memo.content}</div>
            <div className="mb-[1rem] flex">
              <div className="mr-[1rem]">
                {memo.active ? '표시✅' : '숨김❌'}
              </div>
              <div className="mr-[1rem]">
                {memo.important ? '중요✅' : '안중요❌'}
              </div>
              <div className="mr-[1rem]">
                {memo.connect ? '연결가능✅' : '연결불가❌'}
              </div>
            </div>
            <div className="flex">
              <div className="mr-[1rem]">연결된 Todo :</div>
              {memo.todo_id &&
              memo.todo_id.trim() !== '' &&
              memoTodo &&
              memoTodo.todo
                ? `${memoTodo.todo.task}`
                : 'todo연결❌'}
            </div>
          </div>
        )}

        {editMemo && (
          <div>
            <label className="flex">
              <div className="mr-[1rem]">메모 내용</div>
              <input
                className="px-[0.5rem] rounded-md w-[49rem] text-black mb-[1rem]"
                type="text"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
            </label>
            <div className="flex mb-[1rem]">
              <label className="flex mr-[2rem]">
                <div className="mr-[0.5rem]">활성화</div>
                <input
                  type="checkbox"
                  checked={newActive}
                  onChange={(e) => setNewActive(e.target.checked)}
                  className="self-center size-[1.5rem]"
                />
              </label>
              <label className="flex mr-[2rem]">
                <div className="mr-[0.5rem]">중요</div>
                <input
                  type="checkbox"
                  checked={newImportant}
                  onChange={(e) => setNewImportant(e.target.checked)}
                  className="self-center size-[1.5rem]"
                />
              </label>
              <label className="flex">
                <div className="mr-[0.5rem]">연동</div>
                <input
                  type="checkbox"
                  checked={newConnect}
                  onChange={(e) => setNewConnect(e.target.checked)}
                  className="self-center size-[1.5rem]"
                />
              </label>
            </div>
            {newConnect && (
              <div className="mb-[1rem]">
                {/* 기존에 연결된 Todo가 있을 때 */}
                {memo.todo_id && memo.todo_id.trim() !== '' && (
                  <div>
                    {memoTodo && memoTodo.todo && (
                      <div className="mb-[1rem]">
                        기존 Todo의 Task : {memoTodo.todo.task}
                      </div>
                    )}
                  </div>
                )}
                {/* newConnect 있으면 항상 보이는 것 */}
                <div>
                  <div className="flex">
                    <div className="mr-[1rem]">
                      새로 연동할 Todo의 날짜 선택 :
                    </div>
                    <select
                      value={newSelectedMonth}
                      onChange={(e) => setNewSelectedMonth(e.target.value)}
                      title="month"
                      className="text-black mr-[1rem]"
                    >
                      <option value="">월 선택</option>
                      <option value="2025-01">2025년 1월</option>
                      <option value="2025-02">2025년 2월</option>
                      <option value="2025-03">2025년 3월</option>
                      <option value="2025-04">2025년 4월</option>
                      <option value="2025-05">2025년 5월</option>
                      <option value="2025-06">2025년 6월</option>
                      <option value="2025-07">2025년 7월</option>
                      <option value="2025-08">2025년 8월</option>
                      <option value="2025-09">2025년 9월</option>
                      <option value="2025-10">2025년 10월</option>
                      <option value="2025-11">2025년 11월</option>
                      <option value="2025-12">2025년 12월</option>
                    </select>
                    <Button
                      className="rounded-md p-[0.5rem] bg-navy2"
                      type="button"
                      onClick={NewMonthNull}
                    >
                      Todo 연결 초기화
                    </Button>
                  </div>
                  <div className="flex">
                    <div className="mr-[1rem]">새로운 Todo :</div>
                    {(!newConnectTodoTask ||
                      newConnectTodoTask.trim() === '') &&
                      !isTodoNull && <div>❔</div>}
                    {newConnectTodoTask && newConnectTodoTask.trim() !== '' && (
                      <div>{newConnectTodoTask}</div>
                    )}
                    {isTodoNull &&
                      (!newConnectTodoTask ||
                        newConnectTodoTask.trim() === '') && <div>없음</div>}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {editMemo && newSelectedMonth && (
          <div>
            <div className="text-[1rem] w-fit gap-[1rem] mx-auto grid grid-cols-4">
              {newMonthTodolist.map((todo: Todo) => (
                <MonthTodoBox
                  todoFetch={() => TodoIDTask(todo.id, todo.task)}
                  key={todo.id}
                  todo={todo}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default MemoModal
