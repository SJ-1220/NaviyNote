'use client'
import useTodoStore from '@/src/store/todoStore'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import Button from '../Button'
import LoadingPage from '../Loading'
import ConnectMemoBox from '../Memo/ConnectMemoBox'
import { fetchConnectMemo, Memo } from '../Memo/memosServer'
import { formatDate } from './TodayDateFormat'
import {
  deleteTodo,
  fetchTodos,
  fetchTodoWithMemo,
  Todo,
  TodoWithMemo,
  updateTodo,
} from './todosServer'

const TodoModal = () => {
  const { todoId } = useParams()
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newTask, setNewTask] = useState<string>('')
  const [newImportant, setNewImportant] = useState<boolean>(false)
  const [newCompleted, setNewCompleted] = useState<boolean>(false)
  const [newDate, setNewDate] = useState<string | null>(null)
  const [newMemoId, setNewMemoId] = useState<string | null>(null)
  const [newConnectMemoContent, setNewConnectMemoContent] = useState<string>('')
  const [newConnect, setNewConnect] = useState<boolean>(false)
  const [editTodo, setEditTodo] = useState<Todo | null>(null)

  const todolist = useTodoStore((state) => state.todolist)
  const setTodosStore = useTodoStore((state) => state.setTodosStore)

  const [todoMemo, setTodoMemo] = useState<TodoWithMemo | null>(null)
  const [isMemoNull, setIsMemoNull] = useState<boolean>(false)

  const [connectMemos, setConnectMemos] = useState<Memo[]>([])

  useEffect(() => {
    const fetchData = async () => {
      if (todolist.length === 0 && session?.user?.email) {
        try {
          const fetchModalTodos = await fetchTodos(session.user.email)
          setTodosStore(fetchModalTodos)
        } catch (error) {
          console.log(error)
        }
      }
      setLoading(false)
    }
    fetchData()
  }, [session, todolist.length, setTodosStore])

  useEffect(() => {
    const fetchTodoWithMemoData = async () => {
      if (!todoId || typeof todoId !== 'string' || !session?.user?.email) return
      const todoWithMemo = await fetchTodoWithMemo(todoId, session.user.email)
      setTodoMemo(todoWithMemo)
    }
    fetchTodoWithMemoData()
  }, [todoId, session])

  const todo = todolist.find((todo: Todo) => todo.id === todoId)

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
    const fetchConnectMemoData = async () => {
      if (session && session.user && session.user.email) {
        try {
          const memos = await fetchConnectMemo(session.user.email)
          setConnectMemos(memos)
        } catch (error) {
          setError((error as Error).message)
        }
      }
    }
    fetchConnectMemoData()
  }, [session])

  const NewConnectNull = () => {
    setNewConnectMemoContent('')
    setNewMemoId(null)
    setIsMemoNull(true)
  }

  const MemoIDContent = (id: string, content: string) => {
    setNewConnectMemoContent(content)
    setNewMemoId(id)
  }

  const onClose = useCallback(() => {
    router.back()
  }, [router])

  const handleDeleteTodo = async (todoId: string) => {
    if (!session?.user?.email) return
    try {
      await deleteTodo(todoId, session.user.email)
      setTodosStore(todolist.filter((todo) => todo.id !== todoId))
    } catch (error) {
      setError((error as Error).message)
      return
    }
    document.body.style.overflow = ''
    router.push('/todo')
  }
  const handleEditTodo = (todo: Todo) => {
    if (!todo) return
    setEditTodo(todo)
    setNewTask(todo.task)
    setNewImportant(todo.important)
    setNewCompleted(todo.completed)
    setNewDate(todo.date || null)
    setNewMemoId(todo.memo_id || null)
  }
  const updateTodoInput = async () => {
    if (!editTodo || !session?.user?.email) return

    const updatedDate = newDate === '' ? null : newDate
    const updatedTodoId = newMemoId === '' ? null : newMemoId
    const updatedTodo = {
      ...editTodo,
      task: newTask,
      important: newImportant,
      completed: newCompleted,
      date: updatedDate,
      memo_id: updatedTodoId,
    }
    try {
      const updatedTodos = await updateTodo(
        editTodo.id,
        updatedTodo,
        session.user.email
      )

      setTodosStore((prev) =>
        prev.map((todo) => {
          const updated = updatedTodos.find((t) => t.id === todo.id)
          return updated ? updated : todo
        })
      )

      const updatedTodoWithMemo = await fetchTodoWithMemo(
        editTodo.id,
        session.user.email
      )
      setTodoMemo(updatedTodoWithMemo)

      setEditTodo(null)
      setNewTask('')
      setNewImportant(false)
      setNewCompleted(false)
      setNewDate(null)
      setNewMemoId(null)
      setNewConnect(false)
      setIsMemoNull(false)
    } catch (error) {
      setError((error as Error).message)
    }
  }
  const handleClearDate = () => {
    setNewDate(null)
  }

  if (loading) {
    return <LoadingPage />
  }
  if (error) return <div>{error}</div>
  if (!todo) {
    console.log('todo not found')
    return null
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/30 flex justify-center items-center p-2"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white text-gray-800 text-ui-sm rounded-2xl p-6 shadow-2xl max-h-[calc(100vh-16px)] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex justify-between gap-4">
          <Button
            className="rounded-xl py-2 px-4 bg-secondary text-white hover:bg-primary transition-colors"
            type="button"
            onClick={onClose}
          >
            모달 닫기
          </Button>
          {editTodo ? (
            <Button
              className="rounded-xl py-2 px-4 bg-secondary text-white hover:bg-primary transition-colors"
              type="button"
              onClick={updateTodoInput}
            >
              적용
            </Button>
          ) : (
            <Button
              className="rounded-xl py-2 px-4 bg-secondary text-white hover:bg-primary transition-colors"
              type="button"
              onClick={() => {
                handleEditTodo(todo)
              }}
            >
              수정
            </Button>
          )}
          <Button
            className="rounded-xl py-2 px-4 bg-danger text-white hover:opacity-80 transition-opacity"
            type="button"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            삭제
          </Button>
        </div>
        <div className="mb-8 text-center text-ui-md font-bold font-nanumgothic_bold text-primary">
          {todo.task}
        </div>
        {!editTodo && (
          <div className="space-y-3 font-nanumgothic_regular">
            <div className="flex gap-2 flex-wrap">
              <span
                className={`text-md px-2.5 py-1 rounded-full font-nanumgothic_bold ${todo.completed ? 'bg-secondary/10 text-secondary' : 'bg-gray-100 text-gray-400'}`}
              >
                {todo.completed ? '완료' : '미완'}
              </span>
              <span
                className={`text-md px-2.5 py-1 rounded-full font-nanumgothic_bold ${todo.important ? 'bg-danger/10 text-danger' : 'bg-gray-100 text-gray-400'}`}
              >
                {todo.important ? '중요' : '안중요'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-500 shrink-0">날짜</span>
              <span className="text-gray-800">
                {todo.date ? formatDate(new Date(todo.date)) : '없음'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-500 shrink-0">연결된 메모</span>
              <span className="text-gray-800">
                {todo.memo_id &&
                todo.memo_id.trim() !== '' &&
                todoMemo &&
                todoMemo.memo
                  ? todoMemo.memo.content
                  : '없음'}
              </span>
            </div>
          </div>
        )}

        {editTodo && (
          <div>
            <label className="flex items-center gap-4 mb-4">
              <span className="text-gray-500 shrink-0 font-nanumgothic_regular">
                Todo
              </span>
              <input
                className="h-10 px-3 w-full rounded-xl text-gray-800 border border-gray-300 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-nanumgothic_regular"
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
            </label>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
              <label className="inline-flex items-center whitespace-nowrap gap-2">
                <div className="font-nanumgothic_regular">중요도</div>
                <input
                  type="checkbox"
                  checked={newImportant}
                  className="size-6"
                  onChange={(e) => setNewImportant(e.target.checked)}
                />
              </label>
              <label className="inline-flex items-center whitespace-nowrap gap-2">
                <div className="font-nanumgothic_regular">완료</div>
                <input
                  type="checkbox"
                  checked={newCompleted}
                  className="size-6"
                  onChange={(e) => setNewCompleted(e.target.checked)}
                />
              </label>
            </div>
            <div className="mb-4 font-nanumgothic_regular">
              기존 날짜 :
              <span className="ml-4">
                {editTodo.date ? formatDate(new Date(editTodo.date)) : '없음'}
              </span>
            </div>
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center">
              <label className="inline-flex items-center gap-2 whitespace-nowrap font-nanumgothic_regular">
                새 날짜 :
                <input
                  className="h-9 px-2 rounded-xl text-gray-800 border border-gray-300 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-nanumgothic_regular"
                  type="date"
                  value={newDate || ''}
                  onChange={(e) => setNewDate(e.target.value || null)}
                />
              </label>
              <Button
                type="button"
                onClick={handleClearDate}
                className="py-2 px-4 rounded-xl bg-secondary text-white hover:bg-primary transition-colors"
              >
                날짜 미정
              </Button>
            </div>
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center">
              <label className="inline-flex items-center gap-2 whitespace-nowrap font-nanumgothic_regular">
                연결 메모 추가/수정
                <input
                  type="checkbox"
                  checked={newConnect}
                  className="self-center size-6"
                  onChange={(e) => setNewConnect(e.target.checked)}
                />
              </label>
              <Button
                type="button"
                className="rounded-xl py-2 px-4 bg-secondary text-white hover:bg-primary transition-colors"
                onClick={NewConnectNull}
              >
                메모 연결 초기화
              </Button>
            </div>
            <label>
              <div>
                {todo.memo_id && todo.memo_id.trim() !== '' && (
                  <div>
                    {todoMemo && todoMemo.memo && (
                      <div className="mb-4">
                        기존 Memo의 Content : {todoMemo.memo.content}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </label>
            {newConnect && (
              <div>
                <div className="flex items-center mb-4">
                  <div>새로 연동할 메모를 선택하세요</div>
                </div>
                {newConnectMemoContent &&
                  newConnectMemoContent.trim() !== '' && (
                    <div className="mb-4 text-secondary bg-secondary/5 border border-secondary/20 rounded-lg px-3 py-2">
                      🔗 새로운 메모:{' '}
                      <span className="font-nanumgothic_bold">
                        {newConnectMemoContent}
                      </span>
                    </div>
                  )}
                {(!newConnectMemoContent ||
                  newConnectMemoContent.trim() === '') && (
                  <div className="mb-4 font-nanumgothic_regular text-gray-500">
                    새로운 메모 :{' '}
                    {isMemoNull ? <span>없음</span> : <span>❔</span>}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {editTodo && newConnect && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-2 sm:gap-4 justify-items-center">
            {connectMemos.map((memo: Memo) => (
              <ConnectMemoBox
                memoFetch={() => MemoIDContent(memo.id, memo.content)}
                key={memo.id}
                memo={memo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
export default TodoModal
