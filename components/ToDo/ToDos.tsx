'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import {
  Todo,
  addTodo,
  deleteTodo,
  fetchTodos,
  updateTodo,
} from './todosServer'

export default function ToDos() {
  const { data: session } = useSession()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [newTask, setNewTask] = useState<string>('')
  const [newImportant, setNewImportant] = useState<boolean>(false)
  const [newCompleted, setNewCompleted] = useState<boolean>(false)
  const [newDate, setNewDate] = useState<string | null>(null)
  const [editTodo, setEditTodo] = useState<Todo | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (session && session.user && session.user.email) {
        try {
          const todosData = await fetchTodos(session.user.email)
          setTodos(todosData)
        } catch (error) {
          setError((error as Error).message)
        }
      }
      setLoading(false)
    }
    fetchData()
  }, [session])

  const handleAddTodo = async () => {
    if (newTask.trim() === '') return
    if (session && session.user && session.user.email) {
      const userEmail = session.user.email
      const todo: Omit<Todo, 'id'> = {
        user_email: userEmail,
        task: newTask,
        completed: newCompleted,
        important: newImportant,
        date: newDate != null ? newDate : undefined,
      }
      try {
        const result = await addTodo(todo)
        if (result) {
          setTodos([...todos, { ...todo, id: result.id }])
        }
        setNewTask('')
        setNewImportant(false)
        setNewCompleted(false)
        setNewDate(null)
      } catch (error) {
        setError((error as Error).message)
      }
    }
  }

  const handleDeleteTodo = async (deleteTodoId: string) => {
    try {
      await deleteTodo(deleteTodoId)
      setTodos(todos.filter((todo) => todo.id !== deleteTodoId))
    } catch (error) {
      setError((error as Error).message)
    }
  }

  const handleEditTodo = (todo: Todo) => {
    if (!todo) return
    setEditTodo(todo)
    setNewTask(todo.task)
    setNewImportant(todo.important)
    setNewCompleted(todo.completed)
    setNewDate(todo.date || '')
  }

  const updateTodoInput = async () => {
    if (!editTodo) return
    const updatedTodo = {
      ...editTodo,
      task: newTask,
      important: newImportant,
      completed: newCompleted,
      date: newDate || '',
    }
    try {
      await updateTodo(editTodo.id, updatedTodo)
      setTodos(
        todos.map((todo) => (todo.id == editTodo.id ? updatedTodo : todo))
      )
      setEditTodo(null)
      setNewTask('')
      setNewImportant(false)
      setNewCompleted(false)
      setNewDate(null)
    } catch (error) {
      setError((error as Error).message)
    }
  }

  if (loading) return <p className="text-green-400">로딩 중</p>
  if (error) return <p>{error}</p>

  return (
    <>
      <h1 className="text-green-400">Todo List</h1>
      <input
        className="w-[30rem] text-black"
        type="text"
        value={newTask}
        placeholder="새로운 ToDo를 추가하세요"
        onChange={(e) => setNewTask(e.target.value)}
      />
      <label>
        중요도 :
        <input
          type="checkbox"
          checked={newImportant}
          onChange={(e) => setNewImportant(e.target.checked)}
        />
      </label>
      <label>
        완료 :
        <input
          type="checkbox"
          checked={newCompleted}
          onChange={(e) => setNewCompleted(e.target.checked)}
        />
      </label>
      {editTodo && (
        <div>
          기존 날짜 : <span>{editTodo.date || '없음'}</span>
        </div>
      )}
      <label>
        날짜 :
        <input
          className="text-black"
          type="date"
          value={newDate || ''}
          onChange={(e) => setNewDate(e.target.value || null)}
        />
      </label>
      {editTodo ? (
        <button type="button" onClick={updateTodoInput}>
          수정
        </button>
      ) : (
        <button type="button" onClick={handleAddTodo}>
          추가
        </button>
      )}
      <div>
        {todos.map((todo) => (
          <div key={todo.id}>
            <div>todo id : {todo.id}</div>
            <div>todo user-id : {todo.user_email}</div>
            <div>task : {todo.task}</div>
            <div>completed : {todo.completed ? 'true' : 'false'}</div>
            <div>date : {todo.date}</div>
            <div>memo_id : {todo.memo_id}</div>
            <div>important : {todo.important ? 'true' : 'false'}</div>
            <button
              type="button"
              onClick={() => {
                handleEditTodo(todo)
              }}
            >
              수정
            </button>
            <button onClick={() => handleDeleteTodo(todo.id)}>삭제</button>
          </div>
        ))}
      </div>
    </>
  )
}
