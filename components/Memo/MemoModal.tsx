'use client'

import useMemoStore from '@/src/store/memoStore'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import Button from '../Button'
import LoadingPage from '../Loading'
import MonthTodoBox from '../ToDo/MonthTodoBox'
import { fetchMonthTodo, Todo } from '../ToDo/todosServer'
import YearMonthPicker from './YearMonthPicker'
import {
  deleteMemo,
  fetchMemos,
  fetchMemoWithTodo,
  Memo,
  MemoWithTodo,
  updateMemo,
} from './memosServer'

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [newSelectedMonth, setNewSelectedMonth] = useState<string>('')
  const [newMonthTodolist, setNewMonthTodolist] = useState<Todo[]>([])
  const [newConnectTodoTask, setNewConnectTodoTask] = useState<string | null>(
    null
  )

  const memolist = useMemoStore((state) => state.memolist)
  const setMemosStore = useMemoStore((state) => state.setMemosStore)

  const [memoTodo, setMemoTodo] = useState<MemoWithTodo | null>(null)

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
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
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
      return
    }
    document.body.style.overflow = ''
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
    return null
  }
  return (
    <div
      className="fixed inset-0 bg-black/30 flex justify-center items-center p-2"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white text-gray-800 text-ui-sm rounded-2xl p-6 shadow-2xl max-h-[calc(100vh-16px)] overflow-y-auto">
          <div className="mb-4 flex justify-between gap-4">
            <Button
              className="rounded-xl bg-secondary text-white py-2 px-4 hover:bg-primary transition-colors"
              type="button"
              onClick={onClose}
            >
              모달 닫기
            </Button>
            {editMemo ? (
              <Button
                className="rounded-xl py-2 px-4 bg-secondary text-white hover:bg-primary transition-colors"
                type="button"
                onClick={updateMemoInput}
              >
                적용
              </Button>
            ) : (
              <Button
                className="rounded-xl py-2 px-4 bg-secondary text-white hover:bg-primary transition-colors"
                type="button"
                onClick={() => {
                  handleEditMemo(memo)
                }}
              >
                수정
              </Button>
            )}
            <Button
              className="rounded-xl py-2 px-4 bg-danger text-white hover:opacity-80 transition-opacity"
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
            >
              삭제
            </Button>
          </div>
          <div className="text-center text-ui-md font-bold font-nanumgothic_bold mb-8 text-primary">
            {memo.content}
          </div>
          {!editMemo && (
            <div className="space-y-3 font-nanumgothic_regular">
              <div className="flex gap-2 flex-wrap">
                <span
                  className={`text-md px-2.5 py-1 rounded-full font-nanumgothic_bold ${memo.active ? 'bg-secondary/10 text-secondary' : 'bg-gray-100 text-gray-400'}`}
                >
                  {memo.active ? '표시' : '숨김'}
                </span>
                <span
                  className={`text-md px-2.5 py-1 rounded-full font-nanumgothic_bold ${memo.important ? 'bg-danger/10 text-danger' : 'bg-gray-100 text-gray-400'}`}
                >
                  {memo.important ? '중요' : '안중요'}
                </span>
                <span
                  className={`text-md px-2.5 py-1 rounded-full font-nanumgothic_bold ${memo.connect ? 'bg-secondary/10 text-secondary' : 'bg-gray-100 text-gray-400'}`}
                >
                  {memo.connect ? '연결가능' : '연결불가'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 shrink-0">연결된 Todo</span>
                <span className="text-gray-800">
                  {memo.todo_id &&
                  memo.todo_id.trim() !== '' &&
                  memoTodo &&
                  memoTodo.todo
                    ? memoTodo.todo.task
                    : '없음'}
                </span>
              </div>
            </div>
          )}

          {editMemo && (
            <div>
              <label className="flex items-center gap-4 mb-4">
                <span className="text-gray-500 shrink-0 font-nanumgothic_regular">
                  메모 내용
                </span>
                <input
                  className="h-10 px-3 rounded-xl w-full text-gray-800 border border-gray-300 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-nanumgothic_regular"
                  type="text"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                />
              </label>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
                <label className="inline-flex items-center whitespace-nowrap gap-2">
                  <div className="font-nanumgothic_regular">활성화</div>
                  <input
                    type="checkbox"
                    checked={newActive}
                    onChange={(e) => setNewActive(e.target.checked)}
                    className="size-6"
                  />
                </label>
                <label className="inline-flex items-center whitespace-nowrap gap-2">
                  <div className="font-nanumgothic_regular">중요</div>
                  <input
                    type="checkbox"
                    checked={newImportant}
                    onChange={(e) => setNewImportant(e.target.checked)}
                    className="size-6"
                  />
                </label>
                <label className="inline-flex items-center whitespace-nowrap gap-2">
                  <div className="font-nanumgothic_regular">연동</div>
                  <input
                    type="checkbox"
                    checked={newConnect}
                    onChange={(e) => setNewConnect(e.target.checked)}
                    className="size-6"
                  />
                </label>
              </div>
              {newConnect && (
                <div className="mb-4">
                  {memo.todo_id && memo.todo_id.trim() !== '' && (
                    <div>
                      {memoTodo && memoTodo.todo && (
                        <div className="mb-4">
                          기존 Todo의 Task : {memoTodo.todo.task}
                        </div>
                      )}
                    </div>
                  )}
                  <div>
                    <div className="mb-3 font-nanumgothic_regular">
                      새로 연동할 Todo의 날짜 선택
                    </div>
                    <div className="flex flex-col gap-3 mb-2">
                      <YearMonthPicker
                        value={newSelectedMonth}
                        onChange={setNewSelectedMonth}
                      />
                      <Button
                        className="w-full rounded-xl py-2 px-4 bg-secondary text-white hover:bg-primary transition-colors"
                        type="button"
                        onClick={NewMonthNull}
                      >
                        Todo 연결 초기화
                      </Button>
                    </div>
                    {newConnectTodoTask && newConnectTodoTask.trim() !== '' ? (
                      <div className="mt-2 text-secondary bg-secondary/5 border border-secondary/20 rounded-lg px-3 py-2">
                        🔗 새로운 Todo:{' '}
                        <span className="font-nanumgothic_bold">
                          {newConnectTodoTask}
                        </span>
                      </div>
                    ) : (
                      <div className="mt-2 font-nanumgothic_regular text-gray-500">
                        새로운 Todo :{' '}
                        {isTodoNull ? <span>없음</span> : <span>❔</span>}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {editMemo && newSelectedMonth && (
            <div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
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
        {showDeleteConfirm && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/40 backdrop-blur-sm">
            <div className="animate-fade-in-scale bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center gap-3 text-center">
              <p className="font-nanumgothic_bold text-primary text-ui-sm">
                정말 삭제하시겠습니까?
              </p>
              <p className="font-nanumgothic_regular text-gray-500 text-ui-caption">
                이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="flex gap-3 mt-2">
                <Button
                  className="rounded-xl py-2 px-4 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  취소
                </Button>
                <Button
                  className="rounded-xl py-2 px-4 bg-danger text-white hover:opacity-80 transition-opacity"
                  type="button"
                  onClick={() => handleDeleteMemo(memo.id)}
                >
                  삭제 확인
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default MemoModal
