'use client'
import useMemoStore from '@/src/store/memoStore'
import { useSession } from 'next-auth/react'
import { useEffect, useMemo, useState } from 'react'
import Button from '../Button'
import LoadingPage from '../Loading'
import MonthTodoBox from '../ToDo/MonthTodoBox'
import { fetchMonthTodo, Todo } from '../ToDo/todosServer'
import YearMonthPicker from '../YearMonthPicker'
import MemoBox from './MemoBox'
import MemoDropZone from './MemoDropZone'
import { addMemo, fetchMemos, Memo, updateMemo } from './memosServer'

const Memos = () => {
  const { data: session } = useSession()
  const { memolist, setMemosStore } = useMemoStore()
  const [memolistOpen, setMemolistOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
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
        } catch (error) {
          setError((error as Error).message)
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
        } catch (error) {
          setError((error as Error).message)
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
      } catch (error) {
        setError((error as Error).message)
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
      } catch (error) {
        setError((error as Error).message)
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

  if (loading) return <LoadingPage />
  if (error) return <div>{error}</div>
  const instructionBox = (
    <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-4 text-ui-sm">
      <div className="text-center font-nanumgothic_bold text-secondary mb-2">
        이용 안내
      </div>
      <ul className="space-y-2 text-gray-600">
        <li className="flex gap-2 items-start">
          <span className="shrink-0">🗂️</span>
          <span>
            메모는{' '}
            <span className="font-bold text-gray-700">
              활성/비활성 × 중요/일반
            </span>{' '}
            네 구역으로 자동 분류됩니다.
          </span>
        </li>
        <li className="flex gap-2 items-start">
          <span className="shrink-0">✋</span>
          <span>
            메모 카드를{' '}
            <span className="font-bold text-gray-700">드래그&드롭</span>하면
            활성·중요 여부가 자동으로 변경됩니다.
          </span>
        </li>
        <li className="flex gap-2 items-start">
          <span className="shrink-0">✏️</span>
          <span>
            카드를 클릭하면{' '}
            <span className="font-bold text-gray-700">수정·삭제</span> 화면으로
            이동합니다.
          </span>
        </li>
      </ul>
    </div>
  )

  return (
    <div>
      {/* 메모 추가 + 안내 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start">
        {/* 메모 추가 */}
        <div className="my-4 sm:my-8 sm:flex-[3] sm:min-w-[300px] text-ui-sm border border-gray-200 rounded-xl bg-white shadow-sm">
          <div className="p-6">
            <div className="text-ui-md font-nanumgothic_bold text-primary mb-4">
              메모를 추가하세요
            </div>
            <input
              className="h-12 px-4 rounded-xl w-full text-gray-800 mb-4 border border-gray-200 bg-gray-50 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-nanumgothic_regular"
              type="text"
              value={newContent}
              placeholder="새로운 Memo를 추가하세요"
              onChange={(e) => setNewContent(e.target.value)}
            />
            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
              <label className="inline-flex items-center whitespace-nowrap gap-2 font-nanumgothic_regular">
                중요도
                <input
                  type="checkbox"
                  className="size-6"
                  checked={newImportant}
                  onChange={(e) => setNewImportant(e.target.checked)}
                />
              </label>
              <label className="inline-flex items-center whitespace-nowrap gap-2 font-nanumgothic_regular">
                활성화
                <input
                  type="checkbox"
                  className="size-6"
                  checked={newActive}
                  onChange={(e) => setNewActive(e.target.checked)}
                />
              </label>
              <label className="inline-flex items-center whitespace-nowrap gap-2 font-nanumgothic_regular">
                연동가능
                <input
                  type="checkbox"
                  className="size-6"
                  checked={newConnect}
                  onChange={(e) => setNewConnect(e.target.checked)}
                />
              </label>
            </div>
            {newConnect && (
              <div>
                <div className="flex flex-col gap-2 mb-3 min-[586px]:flex-row min-[586px]:items-center min-[586px]:justify-between">
                  <div className="text-ui-sm">연결할 날짜 선택</div>
                  <Button
                    className="text-ui-sm py-2 px-4 bg-secondary text-white rounded-xl self-start hover:bg-primary transition-colors"
                    type="button"
                    onClick={MonthNull}
                  >
                    연동 초기화
                  </Button>
                </div>
                <div className="mb-4 w-full max-w-full">
                  <YearMonthPicker
                    value={selectedMonth}
                    onChange={setSelectedMonth}
                  />
                </div>
                {connectTodoTask && connectTodoTask.trim() !== '' ? (
                  <div className="text-secondary bg-secondary/5 border border-secondary/20 rounded-lg px-3 py-2">
                    🔗 연결된 Todo:{' '}
                    <span className="font-nanumgothic_bold">
                      {connectTodoTask}
                    </span>
                  </div>
                ) : (
                  <div className="font-nanumgothic_regular text-gray-500">
                    연결된 Todo : ❔
                  </div>
                )}
              </div>
            )}
            <Button
              type="button"
              className="my-4 py-3 w-full bg-secondary text-white rounded-xl font-nanumgothic_bold shadow-sm hover:bg-primary transition-colors"
              onClick={handleAddMemo}
            >
              + 메모 추가
            </Button>
          </div>
        </div>
        <div className="hidden sm:block sm:flex-[2] sm:min-w-[280px] sm:self-start sm:my-8">
          {instructionBox}
        </div>
      </div>

      {newConnect && selectedMonth && (
        <div className="mb-8 border border-gray-200 rounded-xl bg-white shadow-sm">
          <div className="p-6">
            <div className="text-ui-md font-nanumgothic_bold text-primary mb-2">
              연결할 Todo 선택
            </div>
            <div className="font-nanumgothic_regular text-gray-600 text-ui-sm mb-4 leading-relaxed">
              선택한 날짜의 Todo입니다. 연결할 Todo를 선택해주세요.
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-2 sm:gap-4 justify-items-center">
              {monthTodolist.map((todo: Todo) => (
                <MonthTodoBox
                  todoFetch={() => TodoIDTask(todo.id, todo.task)}
                  key={todo.id}
                  todo={todo}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mb-8 sm:hidden">{instructionBox}</div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* 안중요+활성 메모 */}
        <MemoDropZone
          zoneIsActive={true}
          zoneIsImportant={false}
          MemoDrop={handleDropMemo}
        >
          <div className="h-full min-h-zone bg-white border-2 border-dashed border-secondary/30 rounded-xl">
            <div className="p-4">
              <div className="text-secondary text-center text-ui-md mb-4 font-nanumgothic_bold">
                안중요 + 활성 메모
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-2 sm:gap-4 justify-items-center">
                {AcUnimMemolist.map((memo) => (
                  <MemoBox key={memo.id} memo={memo} />
                ))}
              </div>
            </div>
          </div>
        </MemoDropZone>
        {/* 중요+활성화 메모 */}
        <MemoDropZone
          zoneIsActive={true}
          zoneIsImportant={true}
          MemoDrop={handleDropMemo}
        >
          <div className="h-full min-h-zone bg-white border-2 border-dashed border-danger/30 rounded-xl">
            <div className="p-4">
              <div className="text-danger text-center text-ui-md mb-4 font-nanumgothic_bold">
                중요 + 활성화 메모
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-2 sm:gap-4 justify-items-center">
                {AcImMemolist.map((memo) => (
                  <MemoBox key={memo.id} memo={memo} />
                ))}
              </div>
            </div>
          </div>
        </MemoDropZone>
        {/* 안중요+비활성 메모 */}
        <MemoDropZone
          zoneIsActive={false}
          zoneIsImportant={false}
          MemoDrop={handleDropMemo}
        >
          <div className="h-full min-h-zone bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl">
            <div className="p-4">
              <div className="text-gray-500 text-center text-ui-md mb-4 font-nanumgothic_bold">
                안중요 + 비활성 메모
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-2 sm:gap-4 justify-items-center">
                {InacUnimMemolist.map((memo) => (
                  <MemoBox key={memo.id} memo={memo} />
                ))}
              </div>
            </div>
          </div>
        </MemoDropZone>
        {/* 중요+비활성 메모 */}
        <MemoDropZone
          zoneIsActive={false}
          zoneIsImportant={true}
          MemoDrop={handleDropMemo}
        >
          <div className="h-full min-h-zone bg-gray-50 border-2 border-dashed border-danger/20 rounded-xl">
            <div className="p-4">
              <div className="text-gray-500 text-center text-ui-md mb-4 font-nanumgothic_bold">
                중요 + 비활성 메모
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-2 sm:gap-4 justify-items-center">
                {InacImMemolist.map((memo) => (
                  <MemoBox key={memo.id} memo={memo} />
                ))}
              </div>
            </div>
          </div>
        </MemoDropZone>
      </div>

      {!memolistOpen && (
        <div className="my-8 border border-gray-200 rounded-xl bg-white shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="text-ui-md font-nanumgothic_bold text-primary">
              전체 메모
            </div>
            <Button
              type="button"
              onClick={MemoOpen}
              className="py-1.5 px-4 text-ui-sm font-nanumgothic_regular bg-secondary/10 text-secondary rounded-xl hover:bg-secondary/20 transition-colors"
            >
              보기
            </Button>
          </div>
        </div>
      )}
      {memolistOpen && (
        <div className="my-8 border border-gray-200 rounded-xl bg-white shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
            <div className="text-ui-md font-nanumgothic_bold text-primary">
              전체 메모
            </div>
            <Button
              type="button"
              onClick={MemoOpen}
              className="py-1.5 px-4 text-ui-sm font-nanumgothic_regular bg-secondary/10 text-secondary rounded-xl hover:bg-secondary/20 transition-colors"
            >
              숨기기
            </Button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-2 sm:gap-4 justify-items-center">
              {memolist.map((memo) => (
                <MemoBox key={memo.id} memo={memo} isDraggable={false} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default Memos
