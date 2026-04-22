import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import {
  fetchMainNextTodos,
  fetchMainPrevTodos,
  fetchMainTodayTodos,
  MainTodo,
} from './mainServer'
import LoadingPage from '../Loading'
import MainTodoBox from './MainTodoBox'

export default function RecentTodos() {
  const { data: session } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [todayTodos, setTodayTodos] = useState<MainTodo[]>([])
  const [nextTodos, setNextTodos] = useState<MainTodo[]>([])
  const [prevTodos, setPrevTodos] = useState<MainTodo[]>([])

  useEffect(() => {
    const fetchTodayTodos = async () => {
      if (session && session.user && session.user.email) {
        try {
          const todos = await fetchMainTodayTodos(session.user.email)
          setTodayTodos(todos)
        } catch (error) {
          setError((error as Error).message)
        }
      }
      setLoading(false)
    }
    fetchTodayTodos()
  }, [session])

  useEffect(() => {
    const fetchNextTodos = async () => {
      if (session && session.user && session.user.email) {
        try {
          const todos = await fetchMainNextTodos(session.user.email)
          setNextTodos(todos)
        } catch (error) {
          setError((error as Error).message)
        }
      }
      setLoading(false)
    }
    fetchNextTodos()
  }, [session])

  useEffect(() => {
    const fetchPrevTodos = async () => {
      if (session && session.user && session.user.email) {
        try {
          const todos = await fetchMainPrevTodos(session.user.email)
          setPrevTodos(todos)
        } catch (error) {
          setError((error as Error).message)
        }
      }
      setLoading(false)
    }
    fetchPrevTodos()
  }, [session])

  if (loading) return <LoadingPage />
  if (error) return <div>{error}</div>

  return (
    <div>
      <div className="flex justify-center text-ui-md text-primary font-bold">
        최근 10일의 Todo
      </div>
      <div className="text-ui-sm ml-8 text-gray-500 mt-4">오늘</div>
      {todayTodos.length > 0 ? (
        <div className="m-4 p-4 border border-gray-200 bg-gray-50 rounded-xl w-fit gap-4 mx-auto grid grid-cols-3">
          {todayTodos.map((todo: MainTodo) => (
            <MainTodoBox
              title={todo.task}
              key={todo.id}
              important={todo.important}
              date={todo.date}
            />
          ))}
        </div>
      ) : (
        <div className="text-gray-400 text-center text-ui-sm">
          오늘의 Todo가 없습니다
        </div>
      )}

      <div className="text-ui-sm mt-8 ml-8 text-gray-500">1~5일 후</div>
      {nextTodos.length > 0 ? (
        <div className="m-4 p-4 border border-gray-200 bg-gray-50 rounded-xl w-fit gap-4 mx-auto grid grid-cols-3">
          {nextTodos.map((todo: MainTodo) => (
            <MainTodoBox
              title={todo.task}
              key={todo.id}
              important={todo.important}
              date={todo.date}
            />
          ))}
        </div>
      ) : (
        <div className="text-gray-400 text-center text-ui-sm">
          이후의 Todo가 없습니다
        </div>
      )}
      <div className="text-ui-sm mt-8 ml-8 text-gray-500">1~5일 전</div>
      {prevTodos.length > 0 ? (
        <div className="m-4 p-4 border border-gray-200 bg-gray-50 rounded-xl w-fit gap-4 mx-auto grid grid-cols-3">
          {prevTodos.map((todo: MainTodo) => (
            <MainTodoBox
              title={todo.task}
              key={todo.id}
              important={todo.important}
              date={todo.date}
            />
          ))}
        </div>
      ) : (
        <div className="text-gray-400 text-center text-ui-sm">
          이전의 Todo가 없습니다
        </div>
      )}
    </div>
  )
}
