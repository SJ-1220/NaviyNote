import {
  deleteMemo,
  fetchMemos,
  fetchMemoWithTodo,
  updateMemo,
} from '@/components/Memo/memosServer'
import { fetchMonthTodo } from '@/components/ToDo/todosServer'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import useMemoStore from '../store/memoStore'
import { Memo, MemoWithTodo } from '../types/memo'
import { Todo } from '../types/todo'
import { useScrollLock } from './useScrollLock'

export const useMemoModal = () => {
  const { memoId } = useParams()
  const { data: session } = useSession()
  const router = useRouter()
  const unlock = useScrollLock()
  const memolist = useMemoStore((state) => state.memolist)
  const memo = memolist.find((memo: Memo) => memo.id === memoId)
  const setMemosStore = useMemoStore((state) => state.setMemosStore)

  const [loading, setLoading] = useState(true)
  const [newContent, setNewContent] = useState<string>('')
  const [newActive, setNewActive] = useState<boolean>(false)
  const [newImportant, setNewImportant] = useState<boolean>(false)
  const [newConnect, setNewConnect] = useState<boolean>(false)
  const [newTodoId, setNewTodoId] = useState<string | null>('')

  const [editMemo, setEditMemo] = useState<Memo | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [newSelectedMonth, setNewSelectedMonth] = useState<string>('')
  const [newMonthTodolist, setNewMonthTodolist] = useState<Todo[]>([])
  const [newConnectTodoTask, setNewConnectTodoTask] = useState<string | null>(
    null
  )

  const [memoTodo, setMemoTodo] = useState<MemoWithTodo | null>(null)

  const [isTodoNull, setIsTodoNull] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      if (memolist.length === 0 && session?.user?.email) {
        try {
          const fetchModalMemos = await fetchMemos(session.user.email)
          setMemosStore(fetchModalMemos)
        } catch {
          toast.error('데이터를 불러오지 못했습니다.')
        }
      }
      setLoading(false)
    }
    fetchData()
  }, [session, memolist.length, setMemosStore])

  useEffect(() => {
    const fetchMemoWithTodoData = async () => {
      if (!memoId || typeof memoId !== 'string' || !session?.user?.email) return
      const memoWithTodo = await fetchMemoWithTodo(memoId, session.user.email)
      setMemoTodo(memoWithTodo)
    }
    fetchMemoWithTodoData()
  }, [memoId, session])

  useEffect(() => {
    const fetchMonthTodoData = async () => {
      if (!newSelectedMonth || newSelectedMonth.trim() === '') return
      const year = Number(newSelectedMonth.split('-')[0])
      const month = Number(newSelectedMonth.split('-')[1]) - 1
      const start = new Date(year, month, 1)
      const end = new Date(year, month + 1, 0, 23, 59, 59)
      if (session && session.user && session.user.email) {
        try {
          const monthTodos = await fetchMonthTodo(
            session.user.email,
            start.toISOString(),
            end.toISOString()
          )
          setNewMonthTodolist(monthTodos)
        } catch {
          toast.error('할일 목록을 불러오지 못했습니다.')
        }
      }
    }
    fetchMonthTodoData()
  }, [session, newSelectedMonth])

  useEffect(() => {
    if (!loading && !memo) router.replace('/memo')
  }, [loading, memo, router])

  useEffect(() => {
    window.scroll(0, 0)
  }, [])

  const NewMonthNull = () => {
    setNewSelectedMonth('')
    setNewConnectTodoTask('')
    setNewTodoId(null)
    setIsTodoNull(true)
  }

  const TodoIDTask = (id: string, task: string) => {
    setNewConnectTodoTask(task)
    setNewTodoId(id)
  }

  const handleDeleteMemo = async (memoId: string): Promise<void> => {
    if (!session?.user?.email) return
    try {
      await deleteMemo(memoId, session.user.email)
      setMemosStore(memolist.filter((memo) => memo.id !== memoId))
    } catch {
      toast.error('삭제에 실패했습니다.')
      return
    }
    unlock()
    router.push('/memo')
  }

  const handleEditMemo = (memo: Memo) => {
    if (!memo) return
    setEditMemo(memo)
    setNewContent(memo.content)
    setNewActive(memo.active)
    setNewImportant(memo.important)
    setNewConnect(memo.connect)
    setNewTodoId(memo.todo_id || null)
  }

  const onClose = useCallback(() => {
    unlock()
    router.back()
  }, [router, unlock])

  const updateMemoInput = async () => {
    if (!editMemo || !session?.user?.email) return

    const updatedTodoId = newTodoId ? newTodoId : null
    const updatedMemo = {
      ...editMemo,
      content: newContent,
      active: newActive,
      important: newImportant,
      connect: newConnect,
      todo_id: updatedTodoId,
    }
    try {
      const updatedMemos = await updateMemo(
        editMemo.id,
        updatedMemo,
        session.user.email
      )

      setMemosStore((prev) =>
        prev.map((memo) => {
          const updated = updatedMemos.find((m) => m.id === memo.id)
          return updated ? updated : memo
        })
      )

      const updatedMemoWithTodo = await fetchMemoWithTodo(
        editMemo.id,
        session.user.email
      )
      setMemoTodo(updatedMemoWithTodo)

      setEditMemo(null)
      setNewContent('')
      setNewActive(false)
      setNewImportant(false)
      setNewConnect(false)
      setNewTodoId(null)
      setIsTodoNull(false)
    } catch {
      toast.error('수정에 실패했습니다.')
    }
  }

  return {
    state: {
      loading,
      memo,
      memoTodo,
      editMemo,
      showDeleteConfirm,
      newContent,
      newActive,
      newImportant,
      newConnect,
      newTodoId,
      newSelectedMonth,
      newMonthTodolist,
      newConnectTodoTask,
      isTodoNull,
    },
    actions: {
      onClose,
      setShowDeleteConfirm,
      handleDeleteMemo,
      handleEditMemo,
      setNewContent,
      setNewActive,
      setNewImportant,
      setNewConnect,
      setNewTodoId,
      setNewSelectedMonth,
      NewMonthNull,
      TodoIDTask,
      updateMemoInput,
    },
  }
}
