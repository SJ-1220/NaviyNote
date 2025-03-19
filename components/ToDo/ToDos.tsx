'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

interface Todo {
  id: string
  user_id: string
  task: string
  completed: boolean
  date?: string
  memo_id?: string
  important: boolean
}

export default function ToDos() {
  const [data, setData] = useState<Todo[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: todos, error } = await supabase.from('todo').select('*')
      if (error) {
        setError(error.message)
      } else {
        console.log(todos)
        setData(todos)
      }
      setLoading(false)
    }

    fetchData()
  }, [])
  if (loading) return <p>로딩 중</p>
  if (error) return <p>{error}</p>
  return (
    <div>
      <h1>Todo List</h1>
      <ul>
        {data.map((todo) => (
          <li key={todo.id}>
            <ol>todo id : {todo.id}</ol>
            <ol>todo user-id : {todo.user_id}</ol>
            <ol>task : {todo.task}</ol>
            <ol>completed : {todo.completed ? 'true' : 'false'}</ol>
            <ol>date : {todo.date}</ol>
            <ol>memo_id : {todo.memo_id}</ol>
            <ol>important : {todo.important ? 'true' : 'false'}</ol>
          </li>
        ))}
      </ul>
    </div>
  )
}
