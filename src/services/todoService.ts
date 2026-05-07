import { supabase } from '@/lib/supabase'
import { Todo, TodoWithMemo } from '../types/todo'

export const getAll = async (userEmail: string): Promise<Todo[]> => {
  const { data, error } = await supabase
    .from('todo')
    .select()
    .eq('user_email', userEmail)
  if (error) throw new Error(error.message)
  return data
}

export const getWithMemo = async (
  todoId: string,
  userEmail: string
): Promise<TodoWithMemo | null> => {
  const { data, error } = await supabase
    .from('todo')
    .select('*,memo:memo_id(content)')
    .eq('id', todoId)
    .eq('user_email', userEmail)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data
}

export const create = async (
  todo: Omit<Todo, 'id'>,
  userEmail: string
): Promise<Todo> => {
  const { data, error } = await supabase
    .from('todo')
    .insert([{ ...todo, user_email: userEmail }])
    .select()
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data
}

export const remove = async (
  todoId: string,
  userEmail: string
): Promise<void> => {
  const { error } = await supabase
    .from('todo')
    .delete()
    .eq('id', todoId)
    .eq('user_email', userEmail)
  if (error) throw new Error(error.message)
}

export const update = async (
  todoId: string,
  updates: Partial<Todo>,
  userEmail: string
): Promise<Todo | null> => {
  const { data, error } = await supabase
    .from('todo')
    .update(updates)
    .eq('id', todoId)
    .eq('user_email', userEmail)
    .select()
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data
}

export const getThreeDays = async (
  userEmail: string,
  endDate: string,
  startDate: string
): Promise<Todo[]> => {
  const { data, error } = await supabase
    .from('todo')
    .select()
    .eq('user_email', userEmail)
    .gte('date', startDate)
    .lte('date', endDate)
  if (error) throw new Error(error.message)
  return data || []
}

export const getToday = async (
  userEmail: string,
  todayDate: string
): Promise<Todo[]> => {
  const { data, error } = await supabase
    .from('todo')
    .select()
    .eq('user_email', userEmail)
    .eq('date', todayDate)
  if (error) throw new Error(error.message)
  return data || []
}

export const getNoDate = async (userEmail: string): Promise<Todo[]> => {
  const { data, error } = await supabase
    .from('todo')
    .select()
    .eq('user_email', userEmail)
    .is('date', null)
  if (error) throw new Error(error.message)
  return data || []
}

export const getByMonth = async (
  userEmail: string,
  startDate: string,
  endDate: string
): Promise<Todo[]> => {
  const { data, error } = await supabase
    .from('todo')
    .select()
    .eq('user_email', userEmail)
    .gte('date', startDate)
    .lte('date', endDate)
  if (error) throw new Error(error.message)
  return data || []
}

export const findLinkedTodo = async (
  memo_id: string,
  userEmail: string,
  todoId?: string
): Promise<Todo | null> => {
  let query = supabase
    .from('todo')
    .select()
    .eq('memo_id', memo_id)
    .eq('user_email', userEmail)

  if (todoId) {
    query = query.neq('id', todoId)
  }

  const { data, error } = await query.limit(1).maybeSingle()

  if (error) throw new Error(error.message)
  return data
}

export const unlinkMemo = async (
  id: string,
  userEmail: string
): Promise<Todo | null> => {
  const { data, error } = await supabase
    .from('todo')
    .update({ memo_id: null })
    .eq('id', id)
    .eq('user_email', userEmail)
    .select()
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data
}

export const linkTodoInMemo = async (
  newTodo: Todo,
  userEmail: string
): Promise<void> => {
  const { error } = await supabase
    .from('memo')
    .update({ todo_id: newTodo.id })
    .eq('id', newTodo.memo_id)
    .eq('user_email', userEmail)
  if (error) throw new Error(error.message)
}

export const unlinkTodoFromMemo = async (
  todoId: string,
  updatedTodo: Todo,
  userEmail: string
): Promise<void> => {
  const { error } = await supabase
    .from('memo')
    .update({ todo_id: null })
    .eq('todo_id', todoId)
    .neq('id', updatedTodo.memo_id)
    .eq('user_email', userEmail)
  if (error) throw new Error(error.message)
}
