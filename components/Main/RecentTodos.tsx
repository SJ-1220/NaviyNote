// 오늘 주변의 Todo를 보여주는 컴포넌트
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { fetchMainTodos, MainTodo } from './mainServer'
import LoadingPage from '../Loading'
import MainTodoBox from './MainTodoBox'

export default function RecentTodos() {
  const { data: session } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [recentTodos, setRecentTodos] = useState<MainTodo[]>([])

  useEffect(() => {
    const fetchRecentTodos = async () => {
      if (session && session.user && session.user.email) {
        try {
          const todos = await fetchMainTodos(session.user.email)
          setRecentTodos(todos)
        } catch (error) {
          setError((error as Error).message)
        }
      }
      setLoading(false)
    }
    fetchRecentTodos()
  }, [session])

  if (loading) return <LoadingPage />
  if (error) return <div>{error}</div>

  return (
    <>
      <div>RecentTodos</div>
      {recentTodos.length > 0 ? (
        <div>
          {recentTodos.map((todo: MainTodo) => (
            <MainTodoBox
              title={todo.task}
              key={todo.id}
              important={todo.important}
              date={todo.date}
            />
          ))}
        </div>
      ) : (
        <div>최근 Todo가 없습니다</div>
      )}
    </>
  )
}
