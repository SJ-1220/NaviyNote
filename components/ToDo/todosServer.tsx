import { supabase } from '@/lib/supabase'

export interface Todo {
  id: string
  user_email: string
  task: string
  completed: boolean
  date?: string
  memo_id?: string
  important: boolean
}

export const fetchTodos = async (userEmail: string) => {
  const { data, error } = await supabase
    .from('todo')
    .select('*')
    .eq('user_email', userEmail)
  if (error) throw new Error(error.message)
  return data
}

export const addTodo = async (todo: Omit<Todo, 'id'>) => {
  const { data, error } = await supabase.from('todo').insert([todo]).select()
  if (error) throw new Error(error.message)
  return data[0]
}

export const deleteTodo = async (todoId: string) => {
  const { data, error } = await supabase.from('todo').delete().eq('id', todoId)
  if (error) throw new Error(error.message)
  return data
}

export const updateTodo = async (todoId: string, updates: Partial<Todo>) => {
  const { data, error } = await supabase
    .from('todo')
    .update(updates)
    .eq('id', todoId)
  if (error) throw new Error(error.message)
  return data
}
