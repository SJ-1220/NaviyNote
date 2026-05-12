import { fetchConnectMemo } from '@/components/Memo/memosServer'
import { formatDate, todayDateFormat } from '@/components/ToDo/TodayDateFormat'
import {
  addTodo,
  fetchNoDateTodo,
  fetchThreeDaysTodo,
  fetchTodayTodo,
  fetchTodos,
} from '@/components/ToDo/todosServer'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import useTodoStore from '../store/todoStore'
import { Memo } from '../types/memo'
import { Todo } from '../types/todo'

export const useToDos = () => {
  const { data: session } = useSession()
  const { todolist, setTodosStore } = useTodoStore()
  const [todolistOpen, setTodolistOpen] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newTask, setNewTask] = useState<string>('')
  const [newImportant, setNewImportant] = useState<boolean>(false)
  const [newCompleted, setNewCompleted] = useState<boolean>(false)
  const [newDate, setNewDate] = useState<string | null>(null)
  const [newMemoId, setNewMemoId] = useState<string | null>(null)
  const [newConnect, setNewConnect] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedPrevDate, setSelectedPrevDate] = useState<string | null>(null)
  const [selectedNextDate, setSelectedNextDate] = useState<string | null>(null)
  const [threeDaysTodos, setThreeDaysTodos] = useState<Todo[]>([])
  const [todayTodos, setTodayTodos] = useState<Todo[]>([])
  const [noDateTodos, setNoDateTodos] = useState<Todo[]>([])
  const [connectMemos, setConnectMemos] = useState<Memo[]>([])
  const [connectMemoContent, setConnectMemoContent] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      if (session && session.user && session.user.email) {
        try {
          const todosData = await fetchTodos(session.user.email)
          setTodosStore(todosData)
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
      setLoading(false)
    }
    fetchData()
  }, [session, setTodosStore])

  useEffect(() => {
    const handleFetchThreeDaysTodos = async () => {
      if (session?.user?.email && selectedDate) {
        try {
          const targetDate = new Date(selectedDate)
          const targetPrevDate = new Date(targetDate)
          const targetNextDate = new Date(targetDate)

          targetPrevDate.setDate(targetDate.getDate() - 1)
          const targetPrevDateFormat = formatDate(targetPrevDate)
          setSelectedPrevDate(targetPrevDateFormat)

          targetNextDate.setDate(targetDate.getDate() + 1)
          const targetNextDateFormat = formatDate(targetNextDate)
          setSelectedNextDate(targetNextDateFormat)

          const todos = await fetchThreeDaysTodo(
            session.user.email,
            targetNextDateFormat,
            targetPrevDateFormat
          )
          setThreeDaysTodos(todos)
        } catch (err) {
          if (err instanceof TypeError) {
            toast.error(
              '서버와 연결할 수 없습니다. 오프라인 상태인지 확인해주세요.'
            )
          } else {
            toast.error('날짜별 할일을 불러오지 못했습니다.')
          }
        }
      } else {
        setThreeDaysTodos([])
      }
    }
    handleFetchThreeDaysTodos()
  }, [session, selectedDate])

  useEffect(() => {
    const handleTodayTodos = async () => {
      if (!session?.user?.email) return
      const today = todayDateFormat()
      try {
        const todos = await fetchTodayTodo(session.user.email, today)
        setTodayTodos(todos)
      } catch (err) {
        if (err instanceof TypeError) {
          toast.error(
            '서버와 연결할 수 없습니다. 오프라인 상태인지 확인해주세요.'
          )
        } else {
          toast.error('오늘의 할일을 불러오지 못했습니다.')
        }
      }
    }
    handleTodayTodos()
  }, [todolist, session])

  useEffect(() => {
    const handleNoDateTodos = async () => {
      if (!session?.user?.email) return
      try {
        const todos = await fetchNoDateTodo(session.user.email)
        setNoDateTodos(todos)
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
    handleNoDateTodos()
  }, [todolist, session])

  useEffect(() => {
    const fetchConnectMemoData = async () => {
      if (session && session.user && session.user.email) {
        try {
          const memos = await fetchConnectMemo(session.user.email)
          setConnectMemos(memos)
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
    }
    fetchConnectMemoData()
  }, [session])

  const MemoIDContent = (id: string, content: string) => {
    setNewMemoId(id)
    setConnectMemoContent(content)
  }

  const handleAddTodo = async () => {
    if (newTask.trim() === '') return
    if (session && session.user && session.user.email) {
      const todo: Omit<Todo, 'id'> = {
        user_email: session.user.email,
        task: newTask,
        completed: newCompleted,
        important: newImportant,
        date: newDate != null ? newDate : undefined,
        memo_id: newMemoId != null ? newMemoId : undefined,
      }
      setIsSubmitting(true)
      try {
        const result = await addTodo(todo, session.user.email)
        if (result) {
          const { newTodo, todosUpdate } = result
          setTodosStore((prev) => {
            let updated = prev.map((m) =>
              m.id === newTodo.id
                ? newTodo
                : todosUpdate && m.id === todosUpdate.id
                  ? todosUpdate
                  : m
            )
            if (!prev.some((m) => m.id === newTodo.id)) {
              updated = [...updated, newTodo]
            }
            return updated
          })
        }
        setNewTask('')
        setNewImportant(false)
        setNewCompleted(false)
        setNewDate(null)
        setNewMemoId(null)
        setNewConnect(false)
        setConnectMemoContent('')
      } catch (err) {
        if (err instanceof TypeError) {
          toast.error(
            '서버와 연결할 수 없습니다. 오프라인 상태인지 확인해주세요.'
          )
        } else {
          toast.error('할일 추가에 실패했습니다.')
        }
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const TodoOpen = () => {
    setTodolistOpen(!todolistOpen)
  }
  return {
    state: {
      session,
      todolist,
      todolistOpen,
      loading,
      isSubmitting,
      newTask,
      newImportant,
      newCompleted,
      newDate,
      newMemoId,
      newConnect,
      selectedDate,
      selectedPrevDate,
      selectedNextDate,
      threeDaysTodos,
      todayTodos,
      noDateTodos,
      connectMemos,
      connectMemoContent,
    },
    actions: {
      setNewTask,
      setNewImportant,
      setNewCompleted,
      setNewDate,
      setNewConnect,
      MemoIDContent,
      TodoOpen,
      handleAddTodo,
      setSelectedDate,
      setConnectMemoContent,
      setTodosStore,
    },
  }
}
