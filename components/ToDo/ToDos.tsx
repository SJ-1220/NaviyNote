'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import {
  Todo,
  addTodo,
  fetchTodos,
  fetchThreeDaysTodo,
  fetchTodayTodo,
  fetchNoDateTodo,
} from './todosServer'
import Calendar from './Calendar'
import { formatDate, todayDateFormat } from './TodayDateFormat'
import TodoBox from './TodoBox'
import LoadingPage from '../Loading'
import Button from '../Button'
import useTodoStore from '@/src/store/todoStore'
import NoDateTodos from './NoDateTodos'

export default function ToDos() {
  const { data: session } = useSession()
  const { todolist, setTodosStore } = useTodoStore()
  const [todolistOpen, setTodolistOpen] = useState(false)
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
  const [noDateTodos, setNoDateTodos] = useState<Todo[]>([])
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

  useEffect(() => {
    const handleNoDateTodos = async () => {
      if (!session?.user?.email) return
      try {
        const todos = await fetchNoDateTodo(session.user.email)
        setNoDateTodos(todos)
      } catch (error) {
        setError((error as Error).message)
      }
    }
    handleNoDateTodos()
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

  const TodoOpen = () => {
    setTodolistOpen(!todolistOpen)
  }

  if (loading) return <LoadingPage />
  if (error) return <div>{error}</div>

  return (
    <div>
      {/* 위 */}
      <div className="flex justify-between">
        {/* 위 왼쪽 */}
        <div>
          {/* 오늘의 Todo */}
          <div className="mt-[2rem] outline-offset-[1rem] outline rounded-md">
            <div className="text-[2rem] text-center">
              오늘({todayDateFormat()})의 Todo
            </div>
            {todayTodos.length === 0 ? (
              <div className="text-center text-[1.5rem]">
                🍀오늘은 할일이 없네용🍀
              </div>
            ) : (
              <div className="w-fit gap-[1rem] mx-auto grid grid-cols-3">
                {todayTodos.map((todo) => (
                  <TodoBox key={todo.id} todo={todo} />
                ))}
              </div>
            )}
          </div>
          {/* Todo 추가 Input */}
          <div className="mt-[3.5rem] outline-offset-[1rem] outline rounded-md text-[1.5rem]">
            <div className="text-[2rem] text-center">Todo를 추가하세요</div>
            <div className="ml-[5rem]">
              <input
                className="w-[30rem] text-black mb-[1rem]"
                type="text"
                value={newTask}
                placeholder="새로운 ToDo를 추가하세요"
                onChange={(e) => setNewTask(e.target.value)}
              />
              <div className="flex mb-[1rem]">
                <label>
                  중요도
                  <input
                    type="checkbox"
                    checked={newImportant}
                    className="size-[1.5rem]"
                    onChange={(e) => setNewImportant(e.target.checked)}
                  />
                </label>
                <label className="ml-[2rem]">
                  완료
                  <input
                    type="checkbox"
                    checked={newCompleted}
                    className="size-[1.5rem]"
                    onChange={(e) => setNewCompleted(e.target.checked)}
                  />
                </label>
                <label className="flex ml-[2rem]">
                  <div className="mr-[1rem]">날짜 :</div>
                  <input
                    className="text-black"
                    type="date"
                    value={newDate || ''}
                    onChange={(e) => setNewDate(e.target.value || null)}
                  />
                </label>
              </div>
              <div className="flex">
                <label className="flex">
                  <div className="mr-[1rem]">메모 연동 :</div>
                  <input
                    type="text"
                    className="text-black h-[2.5rem]"
                    value={newMemoId ?? ''}
                    onChange={(e) => setNewMemoId(e.target.value)}
                  />
                </label>
                <Button
                  type="button"
                  onClick={handleAddTodo}
                  className="ml-[2rem] p-[0.5rem] bg-navy2 rounded-md"
                >
                  추가
                </Button>
              </div>
            </div>
          </div>
          {/* 드래그 가능한 날짜없는 TodoList */}
          <div className="mt-[3.5rem] outline-offset-[1rem] outline rounded-md">
            <div className="text-[2rem] text-center">날짜없는 Todo</div>
            <div className="text-center text-[1.5rem]">
              날짜를 설정하고 싶다면, 캘린더로
              <span className="font-bold"> 드래그앤드롭</span>
              해용
            </div>
            {noDateTodos.length === 0 ? (
              <div className="text-center text-[1.5rem]">
                🌻모든 Todo의 날짜가 있네용🌻
              </div>
            ) : (
              <div className="w-fit gap-[1rem] mx-auto grid grid-cols-3">
                {noDateTodos.map((todo) => (
                  <NoDateTodos key={todo.id} todo={todo} /> // NoDateTodos 사용
                ))}
              </div>
            )}
          </div>
          {/* 캘린더에서 선택한 날짜의 전날, 당일, 다음날의 Todo */}
          <div className="mt-[3.5rem] outline-offset-[1rem] outline rounded-md">
            <div className="text-center text-[1.5rem]">
              선택한 날짜의 전날, 당일, 다음날의 Todo를 보여줄게용
            </div>
            {!selectedDate && (
              <div>
                <div className="text-[2rem] text-center">
                  캘린더에서 Todo를 보고싶은 날짜를 선택해용
                </div>
              </div>
            )}
            {selectedDate && (
              <div>
                <div className="text-center text-[2rem]">
                  {selectedPrevDate} ~ {selectedNextDate}의 Todo
                </div>
                {threeDaysTodos.length === 0 ? (
                  <div className="text-[1.5rem] text-center">
                    🍀{selectedDate} 전후로는 할일이 없네용🍀
                  </div>
                ) : (
                  <div className="w-fit gap-[1rem] mx-auto grid grid-cols-3">
                    {threeDaysTodos.map((todo) => (
                      <TodoBox key={todo.id} todo={todo} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/* 위 오른쪽 : 설명 + 캘린더 */}
        <div>
          <div className="my-[2rem] text-end text-[2rem]">
            날짜가 없는 Todo를 드래그해서
            <br />
            캘린더 위에 원하는 날짜에 드롭하면
            <br />
            날짜가 자동으로 추가됩니다
            <br />
            <br />
            Todo를 클릭하면
            <br />
            <span className="font-bold"> 수정/삭제</span>할 수 있는 상세
            화면으로 이동합니다.
          </div>
          <div className="ml-[3rem] size-[50rem] z-10">
            <Calendar
              todos={todolist}
              setTodos={(newTodos) => setTodosStore(newTodos)}
              onDateClick={setSelectedDate}
            />
          </div>
        </div>
      </div>
      {/* 아래 : 로그인한 사용자의 전체 Todo List 토글*/}
      {!todolistOpen && (
        <div className="items-center text-center">
          <Button
            onClick={TodoOpen}
            type="button"
            className="text-[2rem] px-[43rem] w-full items-center mt-[3.5rem] outline-offset-[1rem] outline rounded-md"
          >
            전체 Todo 보기
          </Button>
        </div>
      )}
      {todolistOpen && (
        <div className="items-center mt-[3.5rem] outline-offset-[1rem] outline rounded-md">
          <div className="text-center mb-[2rem] text-[2rem]">전체 Todo</div>
          <div>
            <div className="grid grid-cols-7 gap-[1rem]">
              {todolist.map((todo) => (
                <TodoBox key={todo.id} todo={todo} />
              ))}
            </div>
            <div className="text-[1.5rem] text-center items-center">
              <Button
                onClick={TodoOpen}
                type="button"
                className="p-[0.5rem] bg-navy2 rounded-md"
              >
                전체 Todo 숨김
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="mb-[2rem]"></div>
    </div>
  )
}
