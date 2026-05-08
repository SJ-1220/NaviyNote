import { supabase } from '@/lib/supabase'
import { Memo, MemoWithTodo } from '../types/memo'

export const getAll = async (userEmail: string): Promise<Memo[]> => {
  const { data, error } = await supabase
    .from('memo')
    .select('*')
    .eq('user_email', userEmail)
  if (error) throw new Error(error.message)
  return data
}

export const getWithTodo = async (
  memoId: string,
  userEmail: string
): Promise<MemoWithTodo | null> => {
  const { data, error } = await supabase
    .from('memo')
    .select('*,todo:todo_id(task)')
    .eq('id', memoId)
    .eq('user_email', userEmail)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data
}

export const create = async (
  memo: Omit<Memo, 'id'>,
  userEmail: string
): Promise<Memo> => {
  const { data, error } = await supabase
    .from('memo')
    .insert([{ ...memo, user_email: userEmail }])
    .select()
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data
}

export const findLinkedMemo = async (
  todo_id: string,
  userEmail: string,
  memoId?: string
): Promise<Memo | null> => {
  let query = supabase
    .from('memo')
    .select('*')
    .eq('todo_id', todo_id)
    .eq('user_email', userEmail)

  if (memoId) {
    query = query.neq('id', memoId)
  }
  const { data, error } = await query.limit(1).maybeSingle()

  if (error) throw new Error(error.message)
  return data
}

export const unlinkTodo = async (
  id: string,
  userEmail: string
): Promise<Memo | null> => {
  const { data, error } = await supabase
    .from('memo')
    .update({ todo_id: null })
    .eq('id', id)
    .eq('user_email', userEmail)
    .select()
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data
}

export const linkMemoInTodo = async (
  newMemo: Memo,
  userEmail: string
): Promise<void> => {
  const { error } = await supabase
    .from('todo')
    .update({ memo_id: newMemo.id })
    .eq('id', newMemo.todo_id)
    .eq('user_email', userEmail)
  if (error) throw new Error(error.message)
}

export const remove = async (
  memoId: string,
  userEmail: string
): Promise<void> => {
  const { error } = await supabase
    .from('memo')
    .delete()
    .eq('id', memoId)
    .eq('user_email', userEmail)
  if (error) throw new Error(error.message)
}

export const update = async (
  memoId: string,
  updates: Partial<Memo>,
  userEmail: string
): Promise<Memo | null> => {
  const { data, error } = await supabase
    .from('memo')
    .update(updates)
    .eq('id', memoId)
    .eq('user_email', userEmail)
    .select()
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data
}

export const unlinkMemoFromTodo = async (
  memoId: string,
  updatedMemo: Memo,
  userEmail: string
): Promise<void> => {
  const { error } = await supabase
    .from('todo')
    .update({ memo_id: null })
    .eq('memo_id', memoId)
    .neq('id', updatedMemo.todo_id)
    .eq('user_email', userEmail)
  if (error) throw new Error(error.message)
}

export const getConnectable = async (userEmail: string): Promise<Memo[]> => {
  const { data, error } = await supabase
    .from('memo')
    .select('*')
    .eq('user_email', userEmail)
    .is('connect', true)
  if (error) throw new Error(error.message)
  return data
}
