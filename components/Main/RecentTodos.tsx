// 오늘 주변의 Todo를 보여주는 컴포넌트
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
      <div className="flex justify-center text-[2rem]">최근 10일의 Todo</div>
      <div className="text-[1.5rem] ml-[2rem]">오늘</div>
      {todayTodos.length > 0 ? (
        <div className="m-[1rem] p-[1rem] outline-dashed bg-lightnavy rounded-lg w-fit gap-[1rem] mx-auto grid grid-cols-3 text-[1rem]">
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
        <div>오늘의 Todo가 없습니다</div>
      )}

      <div className="text-[1.5rem] mt-[2rem] ml-[2rem]">1~5일 후</div>
      {nextTodos.length > 0 ? (
        <div className="m-[1rem] p-[1rem] outline-dashed bg-lightnavy rounded-lg w-fit gap-[1rem] mx-auto grid grid-cols-3 text-[1rem]">
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
        <div>이후의 Todo가 없습니다</div>
      )}
      <div className="text-[1.5rem] mt-[2rem] ml-[2rem]">1~5일 전</div>
      {prevTodos.length > 0 ? (
        <div className="m-[1rem] p-[1rem] outline-dashed bg-lightnavy rounded-lg w-fit gap-[1rem] mx-auto grid grid-cols-3 text-[1rem]">
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
        <div>이전의 Todo가 없습니다</div>
      )}
    </div>
  )
}
