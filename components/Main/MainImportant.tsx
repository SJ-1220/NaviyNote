import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import LoadingPage from '../Loading'
import { fetchMainImportantTodos, MainTodo } from './mainServer'
import MainTodoBox from './MainTodoBox'

export default function MainImportant() {
  const { data: session } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [importantTodos, setImportantTodos] = useState<MainTodo[]>([])

  useEffect(() => {
    const fetchImportantTodos = async () => {
      if (session && session.user && session.user.email) {
        try {
          const todos = await fetchMainImportantTodos(session.user.email)
          setImportantTodos(todos)
        } catch (error) {
          setError((error as Error).message)
        }
      }
      setLoading(false)
    }
    fetchImportantTodos()
  }, [session])

  if (loading) return <LoadingPage />
  if (error) return <div>{error}</div>

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
      <div className="flex flex-wrap gap-y-2 items-center mb-2">
        <span className="text-ui-sm font-nanumgothic_bold text-gray-600">
          🌟 중요한 Todo
        </span>
        <Link
          href="/todo"
          className="ml-auto text-sm font-nanumgothic_bold text-navy3 hover:text-navy hover:underline transition-colors"
        >
          Todo 전체보기 →
        </Link>
      </div>
      {importantTodos.length > 0 ? (
        <div className="flex flex-col gap-2">
          {importantTodos.map((todo: MainTodo) => (
            <MainTodoBox
              title={todo.task}
              key={todo.id}
              date={todo.date}
              important={todo.important}
            />
          ))}
        </div>
      ) : (
        <div className="text-gray-400 text-center text-ui-sm py-1">
          중요한 Todo가 없습니다
        </div>
      )}
    </div>
  )
}
