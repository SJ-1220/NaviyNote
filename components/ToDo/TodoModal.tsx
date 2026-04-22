'use client'
import { useParams, useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import {
  deleteTodo,
  fetchTodos,
  fetchTodoWithMemo,
  Todo,
  TodoWithMemo,
  updateTodo,
} from './todosServer'
import useTodoStore from '@/src/store/todoStore'
import { useSession } from 'next-auth/react'
import Button from '../Button'
import { formatDate } from './TodayDateFormat'
import LoadingPage from '../Loading'
import { fetchConnectMemo, Memo } from '../Memo/memosServer'
import ConnectMemoBox from '../Memo/ConnectMemoBox'

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
    }
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
    return
  }

  return (
    <div
      className="fixed inset-0 bg-black/30 flex justify-center items-center z-20"
      onClick={onClose}
    >
      <div
        className="bg-white text-gray-800 min-w-form-sm text-ui-sm rounded-2xl p-16 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex justify-between gap-4">
          <Button
            className="rounded-lg py-2 px-4 bg-secondary text-white"
            type="button"
            onClick={onClose}
          >
            모달닫기
          </Button>
          {editTodo ? (
            <Button
              className="rounded-lg py-2 px-4 bg-secondary text-white"
              type="button"
              onClick={updateTodoInput}
            >
              적용
            </Button>
          ) : (
            <Button
              className="rounded-lg py-2 px-4 bg-secondary text-white"
              type="button"
              onClick={() => {
                handleEditTodo(todo)
              }}
            >
              수정
            </Button>
          )}
          <Button
            className="rounded-lg py-2 px-4 bg-danger text-white"
            type="button"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            삭제
          </Button>
        </div>
        <div className="mb-8 text-center text-ui-md font-bold text-primary">
          {todo.task}
        </div>
        {!editTodo && (
          <div>
            <div className="mb-4">Todo : {todo.task}</div>
            <div className="flex mb-4">
              <div className="mr-8">{todo.completed ? '완료✅' : '미완❌'}</div>
              <div>{todo.important ? '중요⭐' : '안중요❌'}</div>
            </div>
            <div className="flex mb-4">
              <div className="mr-4">날짜 :</div>
              {todo.date ? formatDate(new Date(todo.date)) : '없음'}
            </div>
            <div className="flex mb-4">
              <div className="mr-4">연결된 메모 :</div>
              {todo.memo_id &&
              todo.memo_id.trim() !== '' &&
              todoMemo &&
              todoMemo.memo
                ? `${todoMemo.memo.content}`
                : '메모연결❌'}
            </div>
          </div>
        )}

        {editTodo && (
          <div>
            <label className="flex">
              <div className="mr-4">Todo :</div>
              <input
                className="px-2 w-form-2xl rounded-lg text-gray-800 mb-4 border border-gray-300"
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
            </label>
            <div className="flex mb-4">
              <label className="flex mr-8">
                <div className="mr-2">중요도</div>
                <input
                  type="checkbox"
                  checked={newImportant}
                  className="self-center size-6"
                  onChange={(e) => setNewImportant(e.target.checked)}
                />
              </label>
              <label className="flex mr-8">
                <div className="mr-2">완료</div>
                <input
                  type="checkbox"
                  checked={newCompleted}
                  className="self-center size-6"
                  onChange={(e) => setNewCompleted(e.target.checked)}
                />
              </label>
            </div>
            <div className="mb-4">
              기존 날짜 :
              <span className="ml-4">
                {editTodo.date ? formatDate(new Date(editTodo.date)) : '없음'}
              </span>
            </div>
            <div className="flex mb-4 items-center">
              <label>
                새 날짜 :
                <input
                  className="px-2 rounded-lg ml-4 text-gray-800 border border-gray-300"
                  type="date"
                  value={newDate || ''}
                  onChange={(e) => setNewDate(e.target.value || null)}
                />
              </label>
              <Button
                type="button"
                onClick={handleClearDate}
                className="ml-8 py-2 px-4 rounded-lg bg-secondary text-white"
              >
                날짜 미정
              </Button>
            </div>
            <label className="items-center flex mb-4">
              연결 메모 추가/수정
              <input
                type="checkbox"
                checked={newConnect}
                className="ml-2 self-center size-6"
                onChange={(e) => setNewConnect(e.target.checked)}
              />
              <Button
                type="button"
                className="ml-8 rounded-lg py-2 px-4 bg-secondary text-white"
                onClick={NewConnectNull}
              >
                메모 연결 초기화
              </Button>
            </label>
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
                  <div>새로 연동할 메모 선택를 선택하세요</div>
                </div>
                <div className="flex">
                  <div className="mr-4">새로운 메모 :</div>
                  {(!newConnectMemoContent ||
                    newConnectMemoContent.trim() === '') &&
                    !isMemoNull && <div>❔</div>}
                  {newConnectMemoContent &&
                    newConnectMemoContent.trim() !== '' && (
                      <div>{newConnectMemoContent}</div>
                    )}
                  {isMemoNull &&
                    (!newConnectMemoContent ||
                      newConnectMemoContent.trim() === '') && <div>없음</div>}
                </div>
              </div>
            )}
          </div>
        )}
        {editTodo && newConnect && (
          <div className="text-base w-fit gap-4 mx-auto grid grid-cols-5">
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
