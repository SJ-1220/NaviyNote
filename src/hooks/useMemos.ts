import { addMemo, fetchMemos, updateMemo } from '@/components/Memo/memosServer'
import { fetchMonthTodo } from '@/components/ToDo/todosServer'
import { useSession } from 'next-auth/react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import useMemoStore from '../store/memoStore'
import { Memo } from '../types/memo'
import { Todo } from '../types/todo'

export const useMemos = () => {
  const { data: session } = useSession()
  const { memolist, setMemosStore } = useMemoStore()
  const [memolistOpen, setMemolistOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newContent, setNewContent] = useState<string>('')
  const [newActive, setNewActive] = useState<boolean>(false)
  const [newImportant, setNewImportant] = useState<boolean>(false)
  const [newConnect, setNewConnect] = useState<boolean>(false)
  const [newTodoId, setNewTodoId] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [monthTodolist, setMonthTodolist] = useState<Todo[]>([])
  const [connectTodoTask, setConnectTodoTask] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (session && session.user && session.user.email) {
        try {
          const memosData = await fetchMemos(session.user.email)
          setMemosStore(memosData)
        } catch (err) {
          if (err instanceof TypeError) {
            toast.error(
              '서버와 연결할 수 없습니다. 오프라인 상태인지 확인해주세요.'
            )
          } else {
            toast.error('메모 목록을 불러오지 못했습니다.')
          }
        }
      }
      setLoading(false)
    }
    fetchData()
  }, [session, setMemosStore])

  useEffect(() => {
    const fetchMonthTodoData = async () => {
      if (!selectedMonth || selectedMonth.trim() === '') return
      const year = Number(selectedMonth.split('-')[0])
      const month = Number(selectedMonth.split('-')[1]) - 1
      const start = new Date(year, month, 1)
      const end = new Date(year, month + 1, 0, 23, 59, 59)
      if (session && session.user && session.user.email) {
        try {
          const monthTodos = await fetchMonthTodo(
            session.user.email,
            start.toISOString(),
            end.toISOString()
          )
          setMonthTodolist(monthTodos)
        } catch (err) {
          if (err instanceof TypeError) {
            toast.error(
              '서버와 연결할 수 없습니다. 오프라인 상태인지 확인해주세요.'
            )
          } else {
            toast.error('할일 목록을 불러오지 못했습니다.')
          }
        }
      }
    }
    fetchMonthTodoData()
  }, [session, selectedMonth])

  const MonthNull = () => {
    setSelectedMonth('')
    setConnectTodoTask(null)
    setNewTodoId(null)
  }

  const handleAddMemo = async () => {
    if (newContent.trim() === '') return
    if (session && session.user && session.user.email) {
      const memo: Omit<Memo, 'id'> = {
        user_email: session.user.email,
        content: newContent,
        todo_id: newTodoId != null ? newTodoId : undefined,
        active: newActive,
        important: newImportant,
        connect: newConnect,
      }
      setIsSubmitting(true)
      try {
        const result = await addMemo(memo, session.user.email)
        if (result) {
          const { newMemo, memosUpdate } = result
          setMemosStore((prev) => {
            let updated = prev.map((m) =>
              m.id === newMemo.id
                ? newMemo
                : memosUpdate && m.id === memosUpdate.id
                  ? memosUpdate
                  : m
            )
            if (!prev.some((m) => m.id === newMemo.id)) {
              updated = [...updated, newMemo]
            }
            return updated
          })
        }
        setNewContent('')
        setNewActive(false)
        setNewImportant(false)
        setNewTodoId(null)
        setNewConnect(false)
      } catch (err) {
        if (err instanceof TypeError) {
          toast.error(
            '서버와 연결할 수 없습니다. 오프라인 상태인지 확인해주세요.'
          )
        } else {
          toast.error('메모 추가에 실패했습니다.')
        }
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleDropMemo = async (
    id: string,
    newActive: boolean,
    newImportant: boolean
  ) => {
    const updatedMemos = memolist.map((memo) => {
      if (memo.id === id) {
        return { ...memo, active: newActive, important: newImportant }
      }
      return memo
    })
    setMemosStore(updatedMemos)
    if (session?.user?.email) {
      try {
        await updateMemo(
          id,
          { active: newActive, important: newImportant },
          session.user.email
        )
      } catch (err) {
        if (err instanceof TypeError) {
          toast.error(
            '서버와 연결할 수 없습니다. 오프라인 상태인지 확인해주세요.'
          )
        } else {
          toast.error('메모 변경에 실패했습니다.')
        }
      }
    }
  }

  const TodoIDTask = (id: string, task: string) => {
    setConnectTodoTask(task)
    setNewTodoId(id)
  }

  const MemoOpen = () => {
    setMemolistOpen(!memolistOpen)
  }

  const AcImMemolist = useMemo(
    () => memolist.filter((memo) => memo.active && memo.important),
    [memolist]
  )
  const InacImMemolist = useMemo(
    () => memolist.filter((memo) => !memo.active && memo.important),
    [memolist]
  )
  const InacUnimMemolist = useMemo(
    () => memolist.filter((memo) => !memo.active && !memo.important),
    [memolist]
  )
  const AcUnimMemolist = useMemo(
    () => memolist.filter((memo) => memo.active && !memo.important),
    [memolist]
  )
  return {
    state: {
      memolist,
      memolistOpen,
      loading,
      isSubmitting,
      newContent,
      newActive,
      newImportant,
      newConnect,
      newTodoId,
      selectedMonth,
      monthTodolist,
      connectTodoTask,
      AcImMemolist,
      InacImMemolist,
      InacUnimMemolist,
      AcUnimMemolist,
    },
    actions: {
      setNewContent,
      setNewActive,
      setNewImportant,
      setNewConnect,
      setSelectedMonth,
      MonthNull,
      handleAddMemo,
      handleDropMemo,
      TodoIDTask,
      MemoOpen,
    },
  }
}
