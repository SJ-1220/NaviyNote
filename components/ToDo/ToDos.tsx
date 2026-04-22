'use client'
import useTodoStore from '@/src/store/todoStore'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Button from '../Button'
import LoadingPage from '../Loading'
import ConnectMemoBox from '../Memo/ConnectMemoBox'
import { fetchConnectMemo, Memo } from '../Memo/memosServer'
import AddCalendar from './AddCalender'
import Calendar from './Calendar'
import NoDateTodos from './NoDateTodos'
import { formatDate, todayDateFormat } from './TodayDateFormat'
import TodoBox from './TodoBox'
import {
  addTodo,
  fetchNoDateTodo,
  fetchThreeDaysTodo,
  fetchTodayTodo,
  fetchTodos,
  Todo,
} from './todosServer'

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

  // Shared JSX rendered in two positions (mobile vs desktop) via visibility toggles
  const instructionBox = (
    <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-4 text-ui-sm">
      <div className="text-center font-nanumgothic_bold text-secondary mb-2">
        이용 안내
      </div>
      <ul className="space-y-2 text-gray-600">
        <li className="flex gap-2 items-start">
          <span className="shrink-0">📅</span>
          <span>
            날짜 없는 Todo를 캘린더에{' '}
            <span className="font-bold text-gray-700">드래그&드롭</span>하면
            날짜가 자동 설정됩니다.
          </span>
        </li>
        <li className="flex gap-2 items-start">
          <span className="shrink-0">✏️</span>
          <span>
            Todo 카드를 클릭하면{' '}
            <span className="font-bold text-gray-700">수정·삭제</span> 화면으로
            이동합니다.
          </span>
        </li>
      </ul>
    </div>
  )

  const connectMemoGrid = (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-2 sm:gap-4 justify-items-center">
      {connectMemos.map((memo: Memo) => (
        <ConnectMemoBox
          memoFetch={() => MemoIDContent(memo.id, memo.content)}
          key={memo.id}
          memo={memo}
        />
      ))}
    </div>
  )

  return (
    <div className="px-4 sm:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        {/* 왼쪽 열 */}
        <div className="sm:flex-1 sm:min-w-0">
          {/* 오늘의 Todo */}
          <div className="bg-white mt-8 border border-gray-200 rounded-xl shadow-sm">
            <div className="p-6">
              <div className="text-ui-md text-center mb-4 font-nanumgothic_bold text-primary">
                오늘({todayDateFormat()})의 Todo
              </div>
              {todayTodos.length === 0 ? (
                <div className="text-center text-ui-sm text-gray-500">
                  🍀오늘은 할일이 없습니다🍀
                </div>
              ) : (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-2 sm:gap-4 justify-items-center">
                  {todayTodos.map((todo) => (
                    <TodoBox key={todo.id} todo={todo} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 모바일 전용: 오늘의 Todo 바로 아래 이용 안내 */}
          <div className="mt-6 sm:hidden">{instructionBox}</div>

          {/* 날짜없는 TodoList */}
          <div className="mt-14 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-6">
              <div className="text-ui-md text-center font-nanumgothic_bold text-primary">
                날짜없는 Todo
              </div>
              <div className="mb-4 text-center text-ui-sm text-gray-500">
                날짜를 설정하고 싶다면, 캘린더로
                <span className="font-bold text-gray-700"> 드래그앤드롭</span>
              </div>
              {noDateTodos.length === 0 ? (
                <div className="text-center text-ui-sm text-gray-500">
                  🌻모든 Todo의 날짜가 있습니다🌻
                </div>
              ) : (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-2 sm:gap-4 justify-items-center">
                  {noDateTodos.map((todo) => (
                    <NoDateTodos key={todo.id} todo={todo} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 선택 날짜 전후 3일 Todo */}
          <div className="mt-14 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-6">
              <div className="text-center text-ui-sm text-gray-500">
                선택한 날짜의 전날, 당일, 다음날의 Todo
              </div>
              {(!selectedDate || !session?.user?.email) && (
                <div>
                  <div className="text-ui-md text-center font-nanumgothic_bold text-primary">
                    캘린더에서 날짜를 선택하세요
                  </div>
                </div>
              )}
              {selectedDate && session?.user?.email && (
                <div>
                  <div className="text-center text-ui-md mb-4 font-nanumgothic_bold text-primary">
                    {selectedPrevDate} ~ {selectedNextDate}의 Todo
                  </div>
                  {threeDaysTodos.length === 0 ? (
                    <div className="text-ui-sm text-center text-gray-500">
                      🍀{selectedDate} 전후로는 할일이 없습니다🍀
                    </div>
                  ) : (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-2 sm:gap-4 justify-items-center">
                      {threeDaysTodos.map((todo) => (
                        <TodoBox key={todo.id} todo={todo} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Todo 추가 */}
          <div className="mt-14 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-6">
              <div className="text-ui-md text-center mb-6 font-nanumgothic_bold text-primary">
                Todo를 추가하세요
              </div>
              <div className="space-y-4 text-ui-sm font-nanumgothic_regular">
                <input
                  className="h-12 rounded-xl px-4 w-full text-gray-800 border border-gray-200 bg-gray-50 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-gray-400 font-nanumgothic_regular"
                  type="text"
                  value={newTask}
                  placeholder="새로운 Todo를 입력하세요"
                  onChange={(e) => setNewTask(e.target.value)}
                />
                <div className="flex flex-wrap gap-x-6 gap-y-3 text-gray-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newImportant}
                      className="size-5 accent-danger"
                      onChange={(e) => setNewImportant(e.target.checked)}
                    />
                    <span>중요</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCompleted}
                      className="size-5 accent-secondary"
                      onChange={(e) => setNewCompleted(e.target.checked)}
                    />
                    <span>완료</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-gray-600 shrink-0">날짜</span>
                    <input
                      className="h-9 px-3 rounded-lg text-gray-800 border border-gray-200 bg-gray-50 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-nanumgothic_regular"
                      type="date"
                      value={newDate || ''}
                      onChange={(e) => setNewDate(e.target.value || null)}
                    />
                  </label>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                  <input
                    type="checkbox"
                    checked={newConnect}
                    className="size-5 accent-secondary"
                    onChange={(e) => setNewConnect(e.target.checked)}
                  />
                  <span>메모와 연결</span>
                </label>
                {connectMemoContent && (
                  <div className="text-secondary bg-secondary/5 border border-secondary/20 rounded-lg px-3 py-2">
                    🔗 연결된 메모:{' '}
                    <span className="font-nanumgothic_bold">
                      {connectMemoContent}
                    </span>
                  </div>
                )}
                <Button
                  type="button"
                  onClick={handleAddTodo}
                  className="w-full py-3 bg-secondary text-white rounded-xl hover:bg-primary transition-colors font-nanumgothic_bold shadow-sm"
                >
                  + Todo 추가
                </Button>
              </div>
            </div>
          </div>

          {/* 모바일 전용: 메모 선택 섹션을 Todo 추가 바로 아래에 */}
          {newConnect && (
            <div className="mt-6 sm:hidden bg-white border border-gray-200 rounded-xl">
              <div className="p-6">
                <div className="text-center text-ui-md font-nanumgothic_bold text-primary mb-4">
                  연결할 메모를 선택하세요
                </div>
                {connectMemoGrid}
              </div>
            </div>
          )}
        </div>

        {/* 오른쪽 열 */}
        <div className="sm:flex-1 sm:min-w-0">
          {/* 데스크탑 전용: 이용 안내 */}
          <div className="hidden sm:block mt-4 sm:my-8">{instructionBox}</div>

          {/* 데스크탑 전용: 네이버 캘린더 추가 버튼 */}
          <div className="hidden sm:flex mb-8 justify-center">
            <AddCalendar />
          </div>

          {/* 캘린더 (모바일에서는 왼쪽 열 아래에 표시됨) */}
          <div className="w-full z-10">
            <Calendar
              todos={todolist}
              setTodos={(newTodos) => setTodosStore(newTodos)}
              onDateClick={setSelectedDate}
            />
          </div>
        </div>
      </div>

      {/* 데스크탑 전용: 메모 선택 섹션 (양쪽 열 아래) */}
      {newConnect && (
        <div className="hidden sm:block mt-14 border border-gray-200 rounded-xl bg-white">
          <div className="p-6">
            <div className="text-start text-ui-md font-nanumgothic_bold text-primary mb-4">
              연결할 메모를 선택하세요
            </div>
            {connectMemoGrid}
          </div>
        </div>
      )}

      {!todolistOpen && (
        <div className="my-8 border border-gray-200 rounded-xl bg-white shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="text-ui-md font-nanumgothic_bold text-primary">
              전체 Todo
            </div>
            <Button
              onClick={TodoOpen}
              type="button"
              className="py-1.5 px-4 text-ui-sm font-nanumgothic_regular bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors"
            >
              보기
            </Button>
          </div>
        </div>
      )}
      {todolistOpen && (
        <div className="my-8 border border-gray-200 rounded-xl bg-white shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
            <div className="text-ui-md font-nanumgothic_bold text-primary">
              전체 Todo
            </div>
            <Button
              onClick={TodoOpen}
              type="button"
              className="py-1.5 px-4 text-ui-sm font-nanumgothic_regular bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors"
            >
              숨기기
            </Button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-2 sm:gap-4 justify-items-center">
              {todolist.map((todo) => (
                <TodoBox key={todo.id} todo={todo} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 모바일 전용: 네이버 캘린더 추가 버튼 (페이지 최하단) */}
      <div className="sm:hidden mt-6 flex justify-center">
        <AddCalendar />
      </div>

      <div className="mb-8"></div>
    </div>
  )
}
