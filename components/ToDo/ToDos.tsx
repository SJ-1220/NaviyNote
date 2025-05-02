'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import {
  Todo,
  addTodo,
  deleteTodo,
  fetchTodos,
  updateTodo,
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
  const [editTodo, setEditTodo] = useState<Todo | null>(null)
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
      } catch (error) {
        setError((error as Error).message)
      }
    }
  }

  const handleDeleteTodo = async (deleteTodoId: string) => {
    if (!session?.user?.email) return
    try {
      await deleteTodo(deleteTodoId, session.user.email)
      setTodosStore(todolist.filter((todo) => todo.id !== deleteTodoId))
    } catch (error) {
      setError((error as Error).message)
    }
  }

  const handleEditTodo = (todo: Todo) => {
    if (!todo) return
    setEditTodo(todo)
    setNewTask(todo.task)
    setNewImportant(todo.important)
    setNewCompleted(todo.completed)
    setNewDate(todo.date || null)
  }

  const updateTodoInput = async () => {
    if (!editTodo || !session?.user?.email) return
    const updatedDate = newDate === '' ? null : newDate
    const updatedTodo = {
      ...editTodo,
      task: newTask,
      important: newImportant,
      completed: newCompleted,
      date: updatedDate,
    }
    try {
      await updateTodo(editTodo.id, updatedTodo, session.user.email)
      setTodosStore(
        todolist.map((todo) => (todo.id == editTodo.id ? updatedTodo : todo))
      )
      setEditTodo(null)
      setNewTask('')
      setNewImportant(false)
      setNewCompleted(false)
      setNewDate(null)
    } catch (error) {
      setError((error as Error).message)
    }
  }
  const handleClearDate = () => {
    setNewDate(null)
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
        {/* Todo 추가/수정 Input */}
        <div className="mt-[3.5rem] outline-offset-[1rem] outline rounded-md text-[1.5rem]">
          <div className="text-[2rem]">Todo 추가/수정</div>
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
            {editTodo && (
              <div>
                기존 날짜 :{' '}
                <span>
                  {editTodo.date ? formatDate(new Date(editTodo.date)) : '없음'}
                </span>
              </div>
            )}
            <label>
              날짜 :
              <input
                className="text-black"
                type="date"
                value={newDate || ''}
                onChange={(e) => setNewDate(e.target.value || null)}
              />
            </label>
            {editTodo && (
              <Button
                type="button"
                onClick={handleClearDate}
                className="ml-[2rem] w-[8rem] bg-blue-800"
              >
                날짜 미정
              </Button>
            )}
            {editTodo ? (
              <Button
                type="button"
                onClick={updateTodoInput}
                className="ml-[2rem] w-[5rem] bg-blue-800"
              >
                수정
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleAddTodo}
                className="ml-[2rem] w-[5rem] bg-blue-800"
              >
                추가
              </Button>
            )}
          </div>
        </div>
        {/* 로그인한 사용자의 전체 Todo List */}
        <div className="mt-[3.5rem] outline-offset-[1rem] outline rounded-md">
          <div className="text-[2rem]">{session?.user?.name}의Todo List</div>
          <div className="flex flex-wrap w-[40rem]">
            {todolist.map((todo) => (
              <div key={todo.id} className="h-[14rem]">
                <TodoBox key={todo.id} todo={todo} />
                <div className="items-center justify-center flex mt-[0.5rem]">
                  <Button
                    type="button"
                    onClick={() => {
                      handleEditTodo(todo)
                    }}
                  >
                    수정
                  </Button>
                  <Button
                    type="button"
                    className="ml-[2rem]"
                    onClick={() => handleDeleteTodo(todo.id)}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-[2rem]"></div>
      </div>
      {/* 캘린더 */}
      <div className="ml-[3rem] size-[50rem]">
        <Calendar
          todos={todolist}
          setTodos={(newTodos) => setTodosStore(newTodos)}
          onDateClick={setSelectedDate}
        />
      </div>
    </div>
  )
}
