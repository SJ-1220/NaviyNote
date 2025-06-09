import { supabase } from '@/lib/supabase'
import { formatDate } from '../ToDo/TodayDateFormat'

export interface MainMemo {
  id: string
  user_email: string
  content: string
  important: boolean
}
export interface MainTodo {
  id: string
  user_email: string
  task: string
  date?: string | null
  important: boolean
}

// 최근 수정/추가된 10개의 메모가 나오게
export const fetchMainMemos = async (userEmail: string) => {
  if (!userEmail) throw new Error('User email is required')
  const { data, error } = await supabase
    .from('memo')
    .select('*')
    .eq('user_email', userEmail)
    .order('updated_at', { ascending: false })
    .limit(10)
  if (error) throw new Error(error.message)
  return data
}

// 접속한 날짜의 주변날의 Todo가 나오게
export const fetchMainTodos = async (userEmail: string) => {
  if (!userEmail) throw new Error('User email is required')
  const today = new Date()
  const days = [-2, -1, 0, 1, 2].map((day) => {
    const date = new Date(today)
    date.setDate(today.getDate() + day)
    return formatDate(date)
  })
  const { data, error } = await supabase
    .from('todo')
    .select('*')
    .eq('user_email', userEmail)
    .in('date', days)
  if (error) throw new Error(error.message)
  return data
}
