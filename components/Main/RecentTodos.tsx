import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
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
        } catch (err) {
          if (err instanceof TypeError) {
            toast.error(
              '서버와 연결할 수 없습니다. 오프라인 상태인지 확인해주세요.'
            )
          } else {
            toast.error('할일 목록을 불러오지 못했습니다.')
          }
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
        } catch (err) {
          if (err instanceof TypeError) {
            toast.error(
              '서버와 연결할 수 없습니다. 오프라인 상태인지 확인해주세요.'
            )
          } else {
            toast.error('할일 목록을 불러오지 못했습니다.')
          }
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
        } catch (err) {
          if (err instanceof TypeError) {
            toast.error(
              '서버와 연결할 수 없습니다. 오프라인 상태인지 확인해주세요.'
            )
          } else {
            toast.error('할일 목록을 불러오지 못했습니다.')
          }
        }
      }
      setLoading(false)
    }
    fetchPrevTodos()
  }, [session])

  if (loading) return <LoadingPage />

  return (
    <div>
      <div className="flex justify-center text-ui-md text-primary font-nanumgothic_bold mb-4">
        최근 10일의 Todo
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
        <div className="text-ui-sm font-nanumgothic_bold text-gray-600 mb-2">
          📅 오늘
        </div>
        {todayTodos.length > 0 ? (
          <div className="flex flex-col gap-2">
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
          <div className="text-gray-400 text-center text-ui-sm py-1">
            오늘의 Todo가 없습니다
          </div>
        )}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
        <div className="text-ui-sm font-nanumgothic_bold text-gray-600 mb-2">
          ⏭ 1~5일 후
        </div>
        {nextTodos.length > 0 ? (
          <div className="flex flex-col gap-2">
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
          <div className="text-gray-400 text-center text-ui-sm py-1">
            이후의 Todo가 없습니다
          </div>
        )}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
        <div className="text-ui-sm font-nanumgothic_bold text-gray-600 mb-2">
          ⏮ 1~5일 전
        </div>
        {prevTodos.length > 0 ? (
          <div className="flex flex-col gap-2">
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
          <div className="text-gray-400 text-center text-ui-sm py-1">
            이전의 Todo가 없습니다
          </div>
        )}
      </div>
    </div>
  )
}
