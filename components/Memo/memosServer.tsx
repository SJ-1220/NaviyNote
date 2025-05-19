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

  const memosUpdate: Memo[] = []

  // 1.todo_id가 달라졌다면, 달라진 todo_id를 참고하고 있던 다른 memo(prevMemo)를 찾기
  if (updates.todo_id) {
    const { data: prevMemo, error } = await supabase
      .from('memo')
      .select('id')
      .eq('todo_id', updates.todo_id)
      .neq('id', memoId)
      .eq('user_email', userEmail)
      .maybeSingle()
    if (error) throw new Error(error.message)

    // 2.memo를 찾아서 해당 memo의 todo_id를 null로 변경
    if (prevMemo) {
      const { data: prevMemoNull, error } = await supabase
        .from('memo')
        .update({ todo_id: null })
        .eq('id', prevMemo.id)
        .select()
      if (error) throw new Error(error.message)
      memosUpdate.push(prevMemoNull[0])
    }
  }

  // 3.현재 메모의 todo_id를 포함한 변경된 부분을 update
  const { data: nowMemo, error } = await supabase
    .from('memo')
    .update(updates)
    .eq('id', memoId)
    .eq('user_email', userEmail)
    .select()
  if (error) throw new Error(error.message)
  const updatedMemo = nowMemo[0]
  memosUpdate.push(updatedMemo)

  // 4. 현재 메모에서 todo_id가 달라진 부분이 있다면, todo table에서 해당 todo의 memo_id를 update
  if (updatedMemo.todo_id) {
    const { error } = await supabase
      .from('todo')
      .update({ memo_id: updatedMemo.id })
      .eq('id', updatedMemo.todo_id)
    if (error) throw new Error(error.message)
  }
  return memosUpdate
}
