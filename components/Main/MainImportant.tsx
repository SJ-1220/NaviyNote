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
    <div className="mt-[4rem]">
      <div className="flex justify-center text-[2rem]">🌟중요한 Todo🌟</div>
      <div className="rounded-lg mb-[2rem]">
        {importantTodos.length > 0 ? (
          <div className="m-[1rem] p-[1rem] outline-dashed bg-lightnavy rounded-lg w-fit gap-[1rem] mx-auto grid grid-cols-3 text-[1rem]">
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
          <div>중요한 Todo가 없습니다</div>
        )}
      </div>
    </div>
  )
}
