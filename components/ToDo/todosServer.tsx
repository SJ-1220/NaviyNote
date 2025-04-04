import { supabase } from '@/lib/supabase'

export interface Todo {
  id: string
  user_email: string
  task: string
  completed: boolean
  date?: string | null
  memo_id?: string
  important: boolean
}

export const fetchTodos = async (userEmail: string) => {
  if (!userEmail) throw new Error('User email is required')
  const { data, error } = await supabase
    .from('todo')
    .select('*')
    .eq('user_email', userEmail)
  if (error) throw new Error(error.message)
  return data
}

export const addTodo = async (todo: Omit<Todo, 'id'>, userEmail: string) => {
  if (!userEmail) throw new Error('User email is required')
  const { data, error } = await supabase
    .from('todo')
    .insert([{ ...todo, user_email: userEmail }])
    .select()
  if (error) throw new Error(error.message)
  return data[0]
}

export const deleteTodo = async (todoId: string, userEmail: string) => {
  if (!userEmail) throw new Error('User email is required')
  const { data, error } = await supabase
    .from('todo')
    .delete()
    .eq('id', todoId)
    .eq('user_email', userEmail)
  if (error) throw new Error(error.message)
  return data
}

export const updateTodo = async (
  todoId: string,
  updates: Partial<Todo>,
  userEmail: string
) => {
  if (!userEmail) throw new Error('User email is required')
  const { data, error } = await supabase
    .from('todo')
    .update(updates)
    .eq('id', todoId)
    .eq('user_email', userEmail)
  if (error) throw new Error(error.message)
  return data
}
