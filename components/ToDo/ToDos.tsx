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
import { fetchConnectMemo, Memo } from '../Memo/memosServer'
import ConnectMemoBox from '../Memo/ConnectMemoBox'
import AddCalendar from './AddCalender'

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

  useEffect(() => {
    const fetchConnectMemoData = async () => {
      if (session && session.user && session.user.email) {
        try {
          const memos = await fetchConnectMemo(session.user.email)
          setConnectMemos(memos)
        } catch (error) {
          setError((error as Error).message)
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
          <div className="bg-white mt-8 border border-gray-200 rounded-xl shadow-sm">
            <div className="p-4">
              <div className="text-ui-md text-center mb-4 font-bold text-primary">
                오늘({todayDateFormat()})의 Todo
              </div>
              {todayTodos.length === 0 ? (
                <div className="text-center text-ui-sm text-gray-500">
                  🍀오늘은 할일이 없네용🍀
                </div>
              ) : (
                <div className="w-fit gap-4 mx-auto grid grid-cols-3">
                  {todayTodos.map((todo) => (
                    <TodoBox key={todo.id} todo={todo} />
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* 날짜없는 TodoList */}
          <div className="mt-14 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-4">
              <div className="text-ui-md text-center font-bold text-primary">
                날짜없는 Todo
              </div>
              <div className="mb-4 text-center text-ui-sm text-gray-500">
                날짜를 설정하고 싶다면, 캘린더로
                <span className="font-bold text-gray-700"> 드래그앤드롭</span>
                해용
              </div>
              {noDateTodos.length === 0 ? (
                <div className="text-center text-ui-sm text-gray-500">
                  🌻모든 Todo의 날짜가 있네용🌻
                </div>
              ) : (
                <div className="w-fit gap-4 mx-auto grid grid-cols-3">
                  {noDateTodos.map((todo) => (
                    <NoDateTodos key={todo.id} todo={todo} />
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* 선택 날짜 전후 3일 Todo */}
          <div className="mt-14 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-4">
              <div className="text-center text-ui-sm text-gray-500">
                선택한 날짜의 전날, 당일, 다음날의 Todo를 보여줄게용
              </div>
              {!selectedDate && (
                <div>
                  <div className="text-ui-md text-center font-bold text-primary">
                    캘린더에서 Todo를 보고싶은 날짜를 선택해용
                  </div>
                </div>
              )}
              {selectedDate && (
                <div>
                  <div className="text-center text-ui-md mb-4 font-bold text-primary">
                    {selectedPrevDate} ~ {selectedNextDate}의 Todo
                  </div>
                  {threeDaysTodos.length === 0 ? (
                    <div className="text-ui-sm text-center text-gray-500">
                      🍀{selectedDate} 전후로는 할일이 없네용🍀
                    </div>
                  ) : (
                    <div className="w-fit gap-4 mx-auto grid grid-cols-3">
                      {threeDaysTodos.map((todo) => (
                        <TodoBox key={todo.id} todo={todo} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Todo 추가 Input */}
          <div className="mt-14 bg-white border border-gray-200 rounded-xl shadow-sm text-ui-sm">
            <div className="p-4">
              <div className="text-ui-md text-center mb-4 font-bold text-primary">
                Todo를 추가하세요
              </div>
              <div className="ml-12">
                <input
                  className="rounded-lg px-2 w-form-md text-gray-800 mb-4 border border-gray-300"
                  type="text"
                  value={newTask}
                  placeholder="새로운 ToDo를 추가하세요"
                  onChange={(e) => setNewTask(e.target.value)}
                />
                <div className="flex mb-4">
                  <label>
                    중요도
                    <input
                      type="checkbox"
                      checked={newImportant}
                      className="self-center ml-2 size-6"
                      onChange={(e) => setNewImportant(e.target.checked)}
                    />
                  </label>
                  <label className="ml-8">
                    완료
                    <input
                      type="checkbox"
                      checked={newCompleted}
                      className="self-center ml-2 size-6"
                      onChange={(e) => setNewCompleted(e.target.checked)}
                    />
                  </label>
                  <label className="flex ml-8">
                    <div className="mr-4">날짜 :</div>
                    <input
                      className="px-2 rounded-lg text-gray-800 border border-gray-300"
                      type="date"
                      value={newDate || ''}
                      onChange={(e) => setNewDate(e.target.value || null)}
                    />
                  </label>
                </div>
                <label className="flex mb-4">
                  연결할 메모 선택
                  <input
                    type="checkbox"
                    checked={newConnect}
                    className="self-center ml-2 size-6"
                    onChange={(e) => setNewConnect(e.target.checked)}
                  />
                </label>
                <div className="text-gray-600">
                  연결된 메모 : {connectMemoContent}
                </div>
                <Button
                  type="button"
                  onClick={handleAddTodo}
                  className="my-4 py-2 w-form-md bg-secondary text-white rounded-lg"
                >
                  추가
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* 위 오른쪽 : 안내 + 네이버 캘린더 추가 + 캘린더 */}
        <div>
          <div className="my-8 text-end text-ui-sm text-gray-600">
            날짜가 없는 Todo를 드래그해서
            <br />
            캘린더 위에 원하는 날짜에 드롭하면
            <br />
            날짜가 자동으로 추가됩니다
            <br />
            <br />
            Todo를 클릭하면
            <br />
            <span className="font-bold text-gray-800"> 수정/삭제</span>할 수
            있는 상세 화면으로 이동합니다.
          </div>
          <div className="mb-8 flex justify-center">
            <AddCalendar />
          </div>
          <div className="ml-12 w-calendar h-calendar z-10">
            <Calendar
              todos={todolist}
              setTodos={(newTodos) => setTodosStore(newTodos)}
              onDateClick={setSelectedDate}
            />
          </div>
        </div>
      </div>

      {newConnect && (
        <div className="mt-14 items-center border border-gray-200 rounded-xl bg-white">
          <div className="p-4">
            <div className="text-center text-ui-md font-bold text-primary mb-4">
              연결할 메모를 선택하세요
            </div>
            <div className="grid grid-cols-7 gap-4">
              {connectMemos.map((memo: Memo) => (
                <ConnectMemoBox
                  memoFetch={() => MemoIDContent(memo.id, memo.content)}
                  key={memo.id}
                  memo={memo}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {!todolistOpen && (
        <div className="items-center text-center">
          <Button
            onClick={TodoOpen}
            type="button"
            className="text-ui-md py-4 w-full text-center mt-14 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-primary"
          >
            전체 Todo 보기
          </Button>
        </div>
      )}
      {todolistOpen && (
        <div className="items-center mt-14 p-4 border border-gray-200 rounded-xl bg-white">
          <div className="text-center mb-8 text-ui-md font-bold text-primary">
            전체 Todo
          </div>
          <div>
            <div className="grid grid-cols-7 gap-4">
              {todolist.map((todo) => (
                <TodoBox key={todo.id} todo={todo} />
              ))}
            </div>
            <div className="text-ui-sm text-center items-center">
              <Button
                onClick={TodoOpen}
                type="button"
                className="py-2 px-4 bg-secondary text-white rounded-lg"
              >
                전체 Todo 숨김
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="mb-8"></div>
    </div>
  )
}
