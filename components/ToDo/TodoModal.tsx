'use client'
import { useParams, useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { deleteTodo, fetchTodos, Todo, updateTodo } from './todosServer'
import useTodoStore from '@/src/store/todoStore'
import { useSession } from 'next-auth/react'
import Button from '../Button'
import { formatDate } from './TodayDateFormat'
import LoadingPage from '../Loading'

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
  const [editTodo, setEditTodo] = useState<Todo | null>(null)
  const todolist = useTodoStore((state) => state.todolist)
  const setTodosStore = useTodoStore((state) => state.setTodosStore)
  // 기본 route에서는 todolist가 비어있어서 zustand에서 가져오기
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

  const todo = todolist.find((todo: Todo) => todo.id === todoId)

  useEffect(() => {
    window.scroll(0, 0)
  }, [])

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
      await updateTodo(editTodo.id, updatedTodo, session.user.email)
      setTodosStore(
        todolist.map((todo) => (todo.id == editTodo.id ? updatedTodo : todo))
      )
      setEditTodo(null)
      setNewTask('')
      setNewImportant(false)
      setNewCompleted(false)
      setNewDate(null)
      setNewMemoId(null)
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
      className="fixed inset-0 bg-black/10 flex justify-center items-center z-20"
      onClick={onClose}
    >
      <div
        className="bg-navy3 text-[1.5rem] rounded-lg p-[4rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-[1rem] flex justify-between">
          <Button
            className="rounded-md p-[0.5rem] bg-navy2"
            type="button"
            onClick={onClose}
          >
            모달닫기
          </Button>
          {editTodo ? (
            <Button
              className="rounded-md p-[0.5rem] bg-navy2"
              type="button"
              onClick={updateTodoInput}
            >
              적용
            </Button>
          ) : (
            <Button
              className="rounded-md p-[0.5rem] bg-navy2"
              type="button"
              onClick={() => {
                handleEditTodo(todo)
              }}
            >
              수정
            </Button>
          )}
          <Button
            className="rounded-md p-[0.5rem] bg-navy2"
            type="button"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            삭제
          </Button>
        </div>
        <div>TodoModal</div>
        <div>Todo Task : {todo.task}</div>
        <div>Todo ID : {todo.id}</div>
        <div>메모 연결 : {todo.memo_id ? `${todo.memo_id}` : '메모연결❌'}</div>

        {editTodo && (
          <div>
            <label>
              task
              <input
                className="w-[30rem] text-black mb-[1rem]"
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
            </label>
            <br />
            <label>
              important
              <input
                type="checkbox"
                checked={newImportant}
                onChange={(e) => setNewImportant(e.target.checked)}
              />
            </label>
            <label>
              completed
              <input
                type="checkbox"
                checked={newCompleted}
                onChange={(e) => setNewCompleted(e.target.checked)}
              />
            </label>
            <div>
              기존 날짜 :
              <span>
                {editTodo.date ? formatDate(new Date(editTodo.date)) : '없음'}
              </span>
            </div>
            <label>
              날짜 :
              <input
                className="text-black"
                type="date"
                value={newDate || ''}
                onChange={(e) => setNewDate(e.target.value || null)}
              />
            </label>
            <Button
              type="button"
              onClick={handleClearDate}
              className="ml-[2rem] p-[0.5rem] rounded-md bg-navy2"
            >
              날짜 미정
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
export default TodoModal
