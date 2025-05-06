'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import {
  Todo,
  addTodo,
  fetchTodos,
  fetchThreeDaysTodo,
  fetchTodayTodo,
} from './todosServer'
import Calendar from './Calendar'
import NoDateTodos from './NoDateTodos'
import { formatDate, todayDateFormat } from './TodayDateFormat'
import TodoBox from './TodoBox'
import LoadingPage from '../Loading'
import Button from '../Button'
import useTodoStore from '@/src/store/todoStore'

export default function ToDos() {
  const { data: session } = useSession()
  const { todolist, setTodosStore } = useTodoStore()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [newTask, setNewTask] = useState<string>('')
  const [newImportant, setNewImportant] = useState<boolean>(false)
  const [newCompleted, setNewCompleted] = useState<boolean>(false)
  const [newDate, setNewDate] = useState<string | null>(null)
  const [newMemoId, setNewMemoId] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedPrevDate, setSelectedPrevDate] = useState<string | null>(null)
  const [selectedNextDate, setSelectedNextDate] = useState<string | null>(null)
  const [threeDaysTodos, setThreeDaysTodos] = useState<Todo[]>([])
  const [todayTodos, setTodayTodos] = useState<Todo[]>([])

  useEffect(() => {
    const fetchData = async () => {
      if (session && session.user && session.user.email) {
        try {
          const todosData = await fetchTodos(session.user.email)
          setTodosStore(todosData)
        } catch (error) {
          setError((error as Error).message)
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
        } catch (error) {
          setError((error as Error).message)
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
      } catch (error) {
        setError((error as Error).message)
      }
    }
    handleTodayTodos()
  }, [todolist, session])

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
      try {
        const result = await addTodo(todo, session.user.email)
        if (result) {
          setTodosStore([...todolist, { ...todo, id: result.id }])
        }
        setNewTask('')
        setNewImportant(false)
        setNewCompleted(false)
        setNewDate(null)
        setNewMemoId(null)
      } catch (error) {
        setError((error as Error).message)
      }
    }
  }

  if (loading) return <LoadingPage />
  if (error) return <div>{error}</div>

  return (
    <div className="flex">
      <div>
        {/* 오늘의 Todo */}
        <div className="mt-[2rem] outline-offset-[1rem] outline rounded-md">
          <div className="text-[2rem]">오늘({todayDateFormat()})의 Todo</div>
          <div className="flex flex-wrap w-[40rem]">
            {todayTodos.length === 0 ? (
              <div>🍀오늘은 할일이 없네용🍀</div>
            ) : (
              todayTodos.map((todo) => <TodoBox key={todo.id} todo={todo} />)
            )}
          </div>
        </div>
        {/* 드래그 가능한 날짜없는 TodoList */}
        <div className="mt-[3.5rem] outline-offset-[1rem] outline rounded-md">
          <div className="text-[2rem]">날짜없는 Todo</div>
          <div>
            날짜를 설정하고 싶다면, 캘린더로&nbsp;
            <span className="font-bold text-[1.3rem]">드래그앤드롭</span>해용
          </div>
          <div className="flex flex-wrap w-[40rem]">
            {todolist.length === 0 ? (
              <div>🌻모든 Todo의 날짜가 있네용🌻</div>
            ) : (
              todolist.map((todo) => (
                <NoDateTodos key={todo.id} todo={todo} /> // NoDateTodos 사용
              ))
            )}
          </div>
        </div>
        {/* 캘린더에서 선택한 날짜의 전날, 당일, 다음날의 Todo */}
        <div className="mt-[3.5rem] outline-offset-[1rem] outline rounded-md">
          <div>선택한 날짜의 전날, 당일, 다음날의 Todo를 보여줄게용</div>
          {!selectedDate && (
            <div>
              <div className="text-[2rem]">
                캘린더에서 Todo를 보고싶은 날짜를 선택해용
              </div>
            </div>
          )}
          {selectedDate && (
            <div>
              <div className="text-[2rem]">
                {selectedPrevDate},{selectedDate},{selectedNextDate}의 Todo
              </div>
              <div className="flex flex-wrap w-[40rem]">
                {threeDaysTodos.length === 0 ? (
                  <div>🍀{selectedDate} 전후로는 할일이 없네용🍀</div>
                ) : (
                  threeDaysTodos.map((todo) => (
                    <TodoBox key={todo.id} todo={todo} />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        {/* Todo 추가 Input */}
        <div className="mt-[3.5rem] outline-offset-[1rem] outline rounded-md text-[1.5rem]">
          <div className="text-[2rem]">Todo 추가</div>
          <input
            className="w-[30rem] text-black mb-[1rem]"
            type="text"
            value={newTask}
            placeholder="새로운 ToDo를 추가하세요"
            onChange={(e) => setNewTask(e.target.value)}
          />
          <div>
            <label>
              중요도
              <input
                type="checkbox"
                checked={newImportant}
                className="size-[1.4rem]"
                onChange={(e) => setNewImportant(e.target.checked)}
              />
            </label>
            <label className="ml-[2rem]">
              완료
              <input
                type="checkbox"
                checked={newCompleted}
                className="size-[1.4rem]"
                onChange={(e) => setNewCompleted(e.target.checked)}
              />
            </label>
            <label className="ml-[2rem]">
              날짜 :
              <input
                className="text-black"
                type="date"
                value={newDate || ''}
                onChange={(e) => setNewDate(e.target.value || null)}
              />
            </label>
            <br />
            <label>
              메모 연동 :
              <input
                type="text"
                className="text-black"
                value={newMemoId ?? ''}
                onChange={(e) => setNewMemoId(e.target.value)}
              />
            </label>
            <Button
              type="button"
              onClick={handleAddTodo}
              className="ml-[2rem] w-[5rem] bg-blue-800"
            >
              추가
            </Button>
          </div>
        </div>
        {/* 로그인한 사용자의 전체 Todo List */}
        <div className="mt-[3.5rem] outline-offset-[1rem] outline rounded-md">
          <div className="text-[2rem]">{session?.user?.name}의Todo List</div>
          <div className="flex flex-wrap w-[40rem]">
            {todolist.map((todo) => (
              <TodoBox key={todo.id} todo={todo} />
            ))}
          </div>
        </div>
        <div className="mb-[2rem]"></div>
      </div>
      {/* 캘린더 */}
      <div className="ml-[3rem] size-[50rem] z-10">
        <Calendar
          todos={todolist}
          setTodos={(newTodos) => setTodosStore(newTodos)}
          onDateClick={setSelectedDate}
        />
      </div>
    </div>
  )
}
