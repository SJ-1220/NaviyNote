import { supabase } from '@/lib/supabase'

export interface Todo {
  id: string
  user_email: string
  task: string
  completed: boolean
  date?: string | null
  memo_id?: string | null
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

  // newTodo : 새로 생성한 todo
  const newTodo = data[0]
  let todosUpdate: Todo | null = null

  //newTodo의 memo_id가 있으면, memo table의 todo_id도 update
  if (newTodo.memo_id) {
    const { error: updateError } = await supabase
      .from('memo')
      .update({ todo_id: newTodo.id })
      .eq('id', newTodo.memo_id)
    if (updateError) throw new Error(updateError.message)

    // newTodo의 memo_id가 있으면, 해당 memo_id를 이미 사용하고 있던 todo(prevTodo) 찾기
    const { data: prevTodos, error: findError } = await supabase
      .from('todo')
      .select('*')
      .eq('memo_id', newTodo.memo_id)
      .neq('id', newTodo.id)
      .eq('user_email', userEmail)
      .limit(1)
    if (findError) throw new Error(findError.message)

    if (prevTodos && prevTodos.length > 0) {
      const prevTodo = prevTodos[0]
      const { error } = await supabase
        .from('todo')
        .update({ memo_id: null })
        .eq('id', prevTodo.id)
      if (error) throw new Error(error.message)

      todosUpdate = { ...prevTodo, memo_id: null }
    }
  }
  return { newTodo, todosUpdate }
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

export const fetchThreeDaysTodo = async (
  userEmail: string,
  endDate: string,
  startDate: string
) => {
  if (!userEmail) throw new Error('User email is required')
  const { data, error } = await supabase
    .from('todo')
    .select('*')
    .eq('user_email', userEmail)
    .gte('date', startDate)
    .lte('date', endDate)
  if (error) throw new Error(error.message)
  return data || []
}

export const fetchTodayTodo = async (userEmail: string, todayDate: string) => {
  if (!userEmail) throw new Error('User email is required')
  const { data, error } = await supabase
    .from('todo')
    .select('*')
    .eq('user_email', userEmail)
    .eq('date', todayDate)
  if (error) throw new Error(error.message)
  return data || []
}

export const fetchNoDateTodo = async (userEmail: string) => {
  if (!userEmail) throw new Error('User email is required')
  const { data, error } = await supabase
    .from('todo')
    .select('*')
    .eq('user_email', userEmail)
    .is('date', null)
  if (error) throw new Error(error.message)
  return data || []
}

export const fetchMonthTodo = async (
  userEmail: string,
  startDate: string,
  endDate: string
) => {
  if (!userEmail) throw new Error('User Email is required')
  const { data, error } = await supabase
    .from('todo')
    .select('*')
    .eq('user_email', userEmail)
    .gte('date', startDate)
    .lte('date', endDate)
  if (error) throw new Error(error.message)
  return data || []
}
