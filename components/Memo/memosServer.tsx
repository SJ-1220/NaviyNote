import { supabase } from '@/lib/supabase'

export interface Memo {
  id: string
  user_email: string
  content: string
  todo_id?: string | null
  active: boolean
  important: boolean
  connect: boolean
}
export interface MemoWithTodo {
  id: string
  user_email: string
  content: string
  todo_id?: string | null
  active: boolean
  important: boolean
  connect: boolean
  todo?: { task: string }
}

export const fetchMemos = async (userEmail: string) => {
  if (!userEmail) throw new Error('User email is required')
  const { data, error } = await supabase
    .from('memo')
    .select('*')
    .eq('user_email', userEmail)
  if (error) throw new Error(error.message)
  return data
}

export const fetchMemoWithTodo = async (memoId: string, userEmail: string) => {
  if (!userEmail) throw new Error('User email is required')
  const { data, error } = await supabase
    .from('memo')
    .select('*,todo:todo_id(task)')
    .eq('id', memoId)
    .eq('user_email', userEmail)
  if (error) throw new Error(error.message)
  return data[0]
}

export const addMemo = async (memo: Omit<Memo, 'id'>, userEmail: string) => {
  if (!userEmail) throw new Error('User email is required')
  const { data, error } = await supabase
    .from('memo')
    .insert([{ ...memo, user_email: userEmail }])
    .select()
  if (error) throw new Error(error.message)
  const newMemo = data[0]

  if (newMemo.todo_id) {
    const { error } = await supabase
      .from('todo')
      .update({ memo_id: newMemo.id })
      .eq('id', newMemo.todo_id)
    if (error) throw new Error(error.message)
  }
  return newMemo
}
export const deleteMemo = async (memoId: string, userEmail: string) => {
  if (!userEmail) throw new Error('User email is required')
  const { data, error } = await supabase
    .from('memo')
    .delete()
    .eq('id', memoId)
    .eq('user_email', userEmail)
  if (error) throw new Error(error.message)
  return data
}

export const updateMemo = async (
  memoId: string,
  updates: Partial<Memo>,
  userEmail: string
) => {
  if (!userEmail) throw new Error('User email is required')
  const { data, error } = await supabase
    .from('memo')
    .update(updates)
    .eq('id', memoId)
    .eq('user_email', userEmail)
    .select()
  if (error) throw new Error(error.message)
  const updatedMemo = data[0]

  if (updatedMemo.todo_id) {
    const { error } = await supabase
      .from('todo')
      .update({ memo_id: updatedMemo.id })
      .eq('id', updatedMemo.todo_id)
    if (error) throw new Error(error.message)
  }
  return updatedMemo
}
