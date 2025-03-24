'use client'
import { supabase } from '@/lib/supabase'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

interface Todo {
  id: string
  user_email: string
  task: string
  completed: boolean
  date?: string
  memo_id?: string
  important: boolean
}

export default function ToDos() {
  const { data: session } = useSession()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (session && session.user) {
        const { data: fetchedTodos, error } = await supabase
          .from('todo')
          .select('*')
          .eq('user_email', session.user.email)
        if (error) {
          setError(error.message)
        } else {
          setTodos(fetchedTodos)
        }
      }
      setLoading(false)
    }
    fetchData()
  }, [session])
  if (loading) return <p>로딩 중</p>
  if (error) return <p>{error}</p>
  return (
    <div>
      <h1>Todo List</h1>
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
          </li>
        ))}
      </div>
    </div>
  )
}
