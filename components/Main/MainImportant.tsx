import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { fetchMainImportantTodos, MainTodo } from './mainServer'
import LoadingPage from '../Loading'
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
    <div className="mt-16">
      <div className="flex justify-center text-ui-md text-primary font-bold">
        🌟중요한 Todo🌟
      </div>
      <div className="rounded-xl mb-8">
        {importantTodos.length > 0 ? (
          <div className="m-4 p-4 border border-gray-200 bg-gray-50 rounded-xl w-fit gap-4 mx-auto grid grid-cols-3">
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
          <div className="text-gray-400 text-center text-ui-sm">
            중요한 Todo가 없습니다
          </div>
        )}
      </div>
    </div>
  )
}
