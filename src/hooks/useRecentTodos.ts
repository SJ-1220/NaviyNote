import {
  fetchMainNextTodos,
  fetchMainPrevTodos,
  fetchMainTodayTodos,
  MainTodo,
} from '@/components/Main/mainServer'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const useRecentTodos = () => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState<boolean>(true)
  const [todayTodos, setTodayTodos] = useState<MainTodo[]>([])
  const [nextTodos, setNextTodos] = useState<MainTodo[]>([])
  const [prevTodos, setPrevTodos] = useState<MainTodo[]>([])

  useEffect(() => {
    const fetchAllTodos = async () => {
      if (!session?.user?.email) {
        setLoading(false)
        return
      }
      const email = session.user.email
      try {
        const [today, next, prev] = await Promise.all([
          fetchMainTodayTodos(email),
          fetchMainNextTodos(email),
          fetchMainPrevTodos(email),
        ])
        setTodayTodos(today)
        setNextTodos(next)
        setPrevTodos(prev)
      } catch (err) {
        if (err instanceof TypeError) {
          toast.error(
            '서버와 연결할 수 없습니다. 오프라인 상태인지 확인해주세요.'
          )
        } else {
          toast.error('할일 목록을 불러오지 못했습니다.')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchAllTodos()
  }, [session])

  return {
    state: { loading, todayTodos, nextTodos, prevTodos },
  }
}
