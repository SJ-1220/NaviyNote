import {
  create,
  findLinkedTodo,
  getAll,
  getByMonth,
  getNoDate,
  getThreeDays,
  getToday,
  getWithMemo,
  linkTodoInMemo,
  remove,
  unlinkMemo,
  unlinkTodoFromMemo,
  update,
} from '@/src/services/todoService'

import { Todo } from '@/src/types/todo'

export const fetchTodos = (userEmail: string) => {
  if (!userEmail) throw new Error('User email is required')
  return getAll(userEmail)
}

export const fetchTodoWithMemo = async (todoId: string, userEmail: string) => {
  if (!userEmail) throw new Error('User email is required')
  return getWithMemo(todoId, userEmail)
}

export const addTodo = async (todo: Omit<Todo, 'id'>, userEmail: string) => {
  if (!userEmail) throw new Error('User email is required')

  let todosUpdate: Todo | null = null

  // 1. 새 todo와 연결할 memo_id와 기존에 연결된 todo가 있나? 있다면 그걸 prevTodo라고 정의
  if (todo.memo_id) {
    const prevTodo = await findLinkedTodo(todo.memo_id, userEmail)

    // 2. prevTodo가 있다면 해당 Todo의 memo_id를 NULL로 update
    if (prevTodo) {
      await unlinkMemo(prevTodo.id, userEmail)
      todosUpdate = { ...prevTodo, memo_id: null }
    }
  }

  // 3. 추가할 Todo Insert
  const newTodo = await create(todo, userEmail)

  // 4. memo_id가 있다면, memo table에서 해당 memo의 todo_id를 update
  if (newTodo.memo_id) {
    await linkTodoInMemo(newTodo, userEmail)
  }

  return { newTodo, todosUpdate }
}

export const deleteTodo = async (todoId: string, userEmail: string) => {
  if (!userEmail) throw new Error('User email is required')
  return remove(todoId, userEmail)
}

export const updateTodo = async (
  todoId: string,
  updates: Partial<Todo>,
  userEmail: string
) => {
  if (!userEmail) throw new Error('User email is required')

  const todosUpdate: Todo[] = []

  // 1. memo_id가 달라졌다면, 달라진 memo_id와 기존에 연결된 todo가 있나? 있다면 그걸 prevTodo라고 정의
  if (updates.memo_id) {
    const prevTodo = await findLinkedTodo(updates.memo_id, userEmail, todoId)

    // 2. prevTodo 있다면 해당 Todo의 memo_id를 NULL로 update
    if (prevTodo) {
      const prevTodoNull = await unlinkMemo(prevTodo.id, userEmail)
      if (prevTodoNull) {
        todosUpdate.push(prevTodoNull)
      }
    }
  }

  // 3. 업데이트할 Todo Update
  const updatedTodo = await update(todoId, updates, userEmail)
  if (updatedTodo) {
    todosUpdate.push(updatedTodo)
  }

  // 4. memo_id가 달라졌다면, memo table에서 해당 memo의 todo_id를 null로 update
  if (updatedTodo) {
    await unlinkTodoFromMemo(todoId, updatedTodo, userEmail)

    // 5. memo_id가 달라졌다면, memo table에서 해당 memo의 todo_id를 update
    if (updatedTodo.memo_id) {
      await linkTodoInMemo(updatedTodo, userEmail)
    }
  }
  return todosUpdate
}

export const fetchThreeDaysTodo = async (
  userEmail: string,
  endDate: string,
  startDate: string
) => {
  if (!userEmail) throw new Error('User email is required')
  return getThreeDays(userEmail, endDate, startDate)
}

export const fetchTodayTodo = async (userEmail: string, todayDate: string) => {
  if (!userEmail) throw new Error('User email is required')
  return getToday(userEmail, todayDate)
}

export const fetchNoDateTodo = async (userEmail: string) => {
  if (!userEmail) throw new Error('User email is required')
  return getNoDate(userEmail)
}

export const fetchMonthTodo = async (
  userEmail: string,
  startDate: string,
  endDate: string
) => {
  if (!userEmail) throw new Error('User Email is required')
  return getByMonth(userEmail, startDate, endDate)
}
