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
  const [newTodo, setNewTodo] = useState<string>('')
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
    if (newTodo.trim() === '') return
    if (session && session.user && session.user.email) {
      const todo: Todo = {
        id: '',
        user_email: session.user.email,
        task: newTodo,
        completed: false,
        important: false,
      }
      try {
        await addTodo(todo)
        setTodos([...todos, todo])
        setNewTodo('')
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

  const handleEditTodo = async () => {
    if (!editTodo) return
    const updatedTodo = { ...editTodo, todo: newTodo }
    try {
      await updateTodo(editTodo.id, updatedTodo)
      setTodos(
        todos.map((todo) => (todo.id === editTodo.id ? updatedTodo : todo))
      )
      setEditTodo(null)
      setNewTodo('')
    } catch (error) {
      setError((error as Error).message)
    }
  }

  if (loading) return <p>로딩 중</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h1>Todo List</h1>
      <input
        type="text"
        value={newTodo}
        placeholder="새로운 ToDo를 추가하세요"
        onChange={(e) => setNewTodo(e.target.value)}
      />
      {editTodo ? (
        <button type="button" onClick={handleEditTodo}>
          수정
        </button>
      ) : (
        <button type="button" onClick={handleAddTodo}>
          추가
        </button>
      )}
      <div>
        {todos.map((todo) => (
          <li key={todo.id}>
            <ol>todo id : {todo.id}</ol>
            <ol>todo user-id : {todo.user_email}</ol>
            <ol>task : {todo.task}</ol>
            <ol>completed : {todo.completed ? 'true' : 'false'}</ol>
            <ol>date : {todo.date}</ol>
            <ol>memo_id : {todo.memo_id}</ol>
            <ol>important : {todo.important ? 'true' : 'false'}</ol>
            <button
              onClick={() => {
                setEditTodo(todo)
                setNewTodo(todo.task)
              }}
            >
              수정
            </button>
            <button onClick={() => handleDeleteTodo(todo.id)}>삭제</button>
          </li>
        ))}
      </div>
    </div>
  )
}
