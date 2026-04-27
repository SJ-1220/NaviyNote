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

export interface TodoWithMemo {
  id: string
  user_email: string
  task: string
  completed: boolean
  date?: string | null
  memo_id?: string | null
  important: boolean
  memo?: { content: string }
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

export const fetchTodoWithMemo = async (todoId: string, userEmail: string) => {
  if (!userEmail) throw new Error('User email is required')
  const { data, error } = await supabase
    .from('todo')
    .select('*,memo:memo_id(content)')
    .eq('id', todoId)
    .eq('user_email', userEmail)
  if (error) throw new Error(error.message)
  return data[0]
}

export const addTodo = async (todo: Omit<Todo, 'id'>, userEmail: string) => {
  if (!userEmail) throw new Error('User email is required')

  let todosUpdate: Todo | null = null

  // 1. 새 todo와 연결할 Memo가 혹시 기존에 연결된 todo가 있나? : prevTodos
  if (todo.memo_id) {
    const { data: prevTodos, error: findError } = await supabase
      .from('todo')
      .select('*')
      .eq('memo_id', todo.memo_id)
      .eq('user_email', userEmail)
      .limit(1)
    if (findError) throw new Error(findError.message)

    // 1-1. prevTodos 있다면 해당 Todo의 memo_id를 NULL로 update
    if (prevTodos && prevTodos.length > 0) {
      const prevTodo = prevTodos[0]
      const { error } = await supabase
        .from('todo')
        .update({ memo_id: null })
        .eq('id', prevTodo.id)
        .eq('user_email', userEmail)
      if (error) throw new Error(error.message)
      todosUpdate = { ...prevTodo, memo_id: null }
    }
  }

  // 2. 새 Todo Insert
  const { data, error } = await supabase
    .from('todo')
    .insert([{ ...todo, user_email: userEmail }])
    .select()
  if (error) throw new Error(error.message)

  const newTodo = data[0]

  // 2-1. 새 Todo의 memo_id가 있다면, memo table의 todo_id도 update
  if (newTodo.memo_id) {
    const { error: updateError } = await supabase
      .from('memo')
      .update({ todo_id: newTodo.id })
      .eq('id', newTodo.memo_id)
      .eq('user_email', userEmail)
    if (updateError) throw new Error(updateError.message)
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

  const todosUpdate: Todo[] = []

  // 1. memo_id가 달라졌다면, 달라진 memo_id를 참고하고 있던 다른 todo(prevTodo)를 찾기
  if (updates.memo_id) {
    const { data: prevTodos, error } = await supabase
      .from('todo')
      .select('id')
      .eq('memo_id', updates.memo_id)
      .neq('id', todoId)
      .eq('user_email', userEmail)
      .limit(1)

    if (error) throw new Error(error.message)

    // 2. todo를 찾아서 해당 todo의 memo_id를 NULL로 update
    if (prevTodos && prevTodos.length > 0) {
      const prevTodo = prevTodos[0]

      const { data: prevTodoNull, error } = await supabase
        .from('todo')
        .update({ memo_id: null })
        .eq('id', prevTodo.id)
        .select()
      if (error) throw new Error(error.message)
      todosUpdate.push(prevTodoNull[0])
    }
  }

  // 3. 현재 Todo의 memo_id를 포함한 변경된 부분을 update
  const { data: nowTodo, error } = await supabase
    .from('todo')
    .update(updates)
    .eq('id', todoId)
    .eq('user_email', userEmail)
    .select()
  if (error) throw new Error(error.message)
  const updatedTodo = nowTodo[0]
  todosUpdate.push(updatedTodo)

  // 4. 현재 Todo에서 memo_id가 달라진 부분이 있다면, memo table에서 현재 Todo를 todo_id로 갖고 있는 memo의 todo_id를 NULL로 update
  if (updatedTodo.memo_id) {
    const { error: clearError } = await supabase
      .from('memo')
      .update({ todo_id: null })
      .eq('todo_id', todoId)
      .neq('id', updatedTodo.memo_id)
      .eq('user_email', userEmail)
    if (clearError) throw new Error(clearError.message)

    // 5. 현재 Todo에서 memo_id가 달라진 부분이 있다면, memo table에서 해당 memo의 todo_id를 update
    const { error: linkError } = await supabase
      .from('memo')
      .update({ todo_id: todoId })
      .eq('id', updatedTodo.memo_id)
      .eq('user_email', userEmail)
    if (linkError) throw new Error(linkError.message)
  }
  return todosUpdate
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
