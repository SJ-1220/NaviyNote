export interface Memo {
  id: string
  user_email: string
  content: string
  todo_id: string | null
  active: boolean
  important: boolean
  connect: boolean
}

export interface MemoWithTodo {
  id: string
  user_email: string
  content: string
  todo_id: string | null
  active: boolean
  important: boolean
  connect: boolean
  todo?: { task: string }
}
