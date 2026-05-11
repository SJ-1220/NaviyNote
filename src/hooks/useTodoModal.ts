import { fetchConnectMemo } from '@/components/Memo/memosServer'
import {
  deleteTodo,
  fetchTodos,
  fetchTodoWithMemo,
  updateTodo,
} from '@/components/ToDo/todosServer'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import useTodoStore from '../store/todoStore'
import { Memo } from '../types/memo'
import { Todo, TodoWithMemo } from '../types/todo'
import { useScrollLock } from './useScrollLock'

export const useTodoModal = () => {
  const { todoId } = useParams()
  const { data: session } = useSession()
  const router = useRouter()
  const unlock = useScrollLock()
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState<string>('')
  const [newImportant, setNewImportant] = useState<boolean>(false)
  const [newCompleted, setNewCompleted] = useState<boolean>(false)
  const [newDate, setNewDate] = useState<string | null>(null)
  const [newMemoId, setNewMemoId] = useState<string | null>(null)
  const [newConnectMemoContent, setNewConnectMemoContent] = useState<string>('')
  const [newConnect, setNewConnect] = useState<boolean>(false)
  const [editTodo, setEditTodo] = useState<Todo | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const todolist = useTodoStore((state) => state.todolist)
  const setTodosStore = useTodoStore((state) => state.setTodosStore)

  const [todoMemo, setTodoMemo] = useState<TodoWithMemo | null>(null)
  const [isMemoNull, setIsMemoNull] = useState<boolean>(false)

  const [connectMemos, setConnectMemos] = useState<Memo[]>([])

  const todo = todolist.find((todo: Todo) => todo.id === todoId)

  useEffect(() => {
    const fetchData = async () => {
      if (todolist.length === 0 && session?.user?.email) {
        try {
          const fetchModalTodos = await fetchTodos(session.user.email)
          setTodosStore(fetchModalTodos)
        } catch {
          toast.error('데이터를 불러오지 못했습니다.')
        }
      }
      setLoading(false)
    }
    fetchData()
  }, [session, todolist.length, setTodosStore])

  useEffect(() => {
    const fetchTodoWithMemoData = async () => {
      if (!todoId || typeof todoId !== 'string' || !session?.user?.email) return
      const todoWithMemo = await fetchTodoWithMemo(todoId, session.user.email)
      setTodoMemo(todoWithMemo)
    }
    fetchTodoWithMemoData()
  }, [todoId, session])

  useEffect(() => {
    if (!loading && !todo) router.replace('/todo')
  }, [loading, todo, router])

  useEffect(() => {
    window.scroll(0, 0)
  }, [])

  useEffect(() => {
    const fetchConnectMemoData = async () => {
      if (session && session.user && session.user.email) {
        try {
          const memos = await fetchConnectMemo(session.user.email)
          setConnectMemos(memos)
        } catch {
          toast.error('메모 목록을 불러오지 못했습니다.')
        }
      }
    }
    fetchConnectMemoData()
  }, [session])

  const NewConnectNull = () => {
    setNewConnectMemoContent('')
    setNewMemoId(null)
    setIsMemoNull(true)
  }

  const MemoIDContent = (id: string, content: string) => {
    setNewConnectMemoContent(content)
    setNewMemoId(id)
  }

  const onClose = useCallback(() => {
    unlock()
    router.back()
  }, [router, unlock])

  const handleDeleteTodo = async (todoId: string) => {
    if (!session?.user?.email) return
    try {
      await deleteTodo(todoId, session.user.email)
      setTodosStore(todolist.filter((todo) => todo.id !== todoId))
    } catch {
      toast.error('삭제에 실패했습니다.')
      return
    }
    unlock()
    router.push('/todo')
  }
  const handleEditTodo = (todo: Todo) => {
    if (!todo) return
    setEditTodo(todo)
    setNewTask(todo.task)
    setNewImportant(todo.important)
    setNewCompleted(todo.completed)
    setNewDate(todo.date || null)
    setNewMemoId(todo.memo_id || null)
  }
  const updateTodoInput = async () => {
    if (!editTodo || !session?.user?.email) return

    const updatedDate = newDate === '' ? null : newDate
    const updatedTodoId = newMemoId === '' ? null : newMemoId
    const updatedTodo = {
      ...editTodo,
      task: newTask,
      important: newImportant,
      completed: newCompleted,
      date: updatedDate,
      memo_id: updatedTodoId,
    }
    try {
      const updatedTodos = await updateTodo(
        editTodo.id,
        updatedTodo,
        session.user.email
      )

      setTodosStore((prev) =>
        prev.map((todo) => {
          const updated = updatedTodos.find((t) => t.id === todo.id)
          return updated ? updated : todo
        })
      )

      const updatedTodoWithMemo = await fetchTodoWithMemo(
        editTodo.id,
        session.user.email
      )
      setTodoMemo(updatedTodoWithMemo)

      setEditTodo(null)
      setNewTask('')
      setNewImportant(false)
      setNewCompleted(false)
      setNewDate(null)
      setNewMemoId(null)
      setNewConnect(false)
      setIsMemoNull(false)
    } catch {
      toast.error('수정에 실패했습니다.')
    }
  }
  const handleClearDate = () => {
    setNewDate(null)
  }
  return {
    state: {
      todo,
      todoMemo,
      connectMemos,
      newConnectMemoContent,
      newConnect,
      isMemoNull,
      editTodo,
      newTask,
      newImportant,
      newCompleted,
      newDate,
      showDeleteConfirm,
      loading,
    },
    actions: {
      onClose,
      handleDeleteTodo,
      handleEditTodo,
      updateTodoInput,
      setNewTask,
      setNewImportant,
      setNewCompleted,
      setNewDate,
      setNewMemoId,
      setNewConnect,
      setShowDeleteConfirm,
      NewConnectNull,
      MemoIDContent,
      handleClearDate,
    },
  }
}
