export interface Todo {
  id: string
  user_email: string
  task: string
  completed: boolean
  date: string | null
  memo_id: string | null
  important: boolean
}

export interface TodoWithMemo {
  id: string
  user_email: string
  task: string
  completed: boolean
  date: string | null
  memo_id: string | null
  important: boolean
  memo?: { content: string }
}
