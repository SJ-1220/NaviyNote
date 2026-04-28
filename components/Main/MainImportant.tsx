import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import LoadingPage from '../Loading'
import { fetchMainImportantTodos, MainTodo } from './mainServer'
import MainTodoBox from './MainTodoBox'

export default function MainImportant() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState<boolean>(true)
  const [importantTodos, setImportantTodos] = useState<MainTodo[]>([])

  useEffect(() => {
    const fetchImportantTodos = async () => {
      if (session && session.user && session.user.email) {
        try {
          const todos = await fetchMainImportantTodos(session.user.email)
          setImportantTodos(todos)
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
    fetchImportantTodos()
  }, [session])

  if (loading) return <LoadingPage />

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
