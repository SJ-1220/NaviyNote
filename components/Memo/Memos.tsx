'use client'
import useMemoStore from '@/src/store/memoStore'
import { useSession } from 'next-auth/react'
import { useEffect, useMemo, useState } from 'react'
import Button from '../Button'
import LoadingPage from '../Loading'
import MonthTodoBox from '../ToDo/MonthTodoBox'
import { fetchMonthTodo, Todo } from '../ToDo/todosServer'
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
    if (selectedMonth) {
      setSelectedMonth('')
    }
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
    <div className="px-4 sm:px-6">
      {/* 메모 추가 + 안내 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {/* 메모 추가 */}
        <div className="my-4 sm:my-8 text-ui-sm border border-gray-200 rounded-xl bg-white shadow-sm">
          <div className="p-6">
            <div className="text-ui-md font-nanumgothic_bold text-primary mb-4">
              메모를 추가하세요
            </div>
            <input
              className="h-10 px-3 rounded-lg w-full sm:w-form-sm text-gray-800 mb-4 border border-gray-300 focus:outline-none focus:border-secondary font-nanumgothic_regular"
              type="text"
              value={newContent}
              placeholder="새로운 Memo를 추가하세요"
              onChange={(e) => setNewContent(e.target.value)}
            />
            <div className="mb-4">
              <label className="mr-8 font-nanumgothic_regular">
                중요도
                <input
                  type="checkbox"
                  className="self-center ml-2 size-6"
                  checked={newImportant}
                  onChange={(e) => setNewImportant(e.target.checked)}
                />
              </label>
              <label className="mr-8 font-nanumgothic_regular">
                활성화
                <input
                  type="checkbox"
                  className="self-center ml-2 size-6"
                  checked={newActive}
                  onChange={(e) => setNewActive(e.target.checked)}
                />
              </label>
              <label className="mr-8 font-nanumgothic_regular">
                연동가능
                <input
                  type="checkbox"
                  className="self-center ml-2 size-6"
                  checked={newConnect}
                  onChange={(e) => setNewConnect(e.target.checked)}
                />
              </label>
            </div>
            {newConnect && (
              <div>
                <div className="text-ui-sm mb-4">연결할 날짜 선택</div>
                <div className="items-center flex mb-4">
                  <div className="mr-4">▶</div>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    title="month"
                    className="h-9 text-ui-sm text-gray-800 border border-gray-300 rounded-lg px-2 focus:outline-none focus:border-secondary"
                  >
                    <option value="">월 선택</option>
                    <option value="2025-01">2025년 1월</option>
                    <option value="2025-02">2025년 2월</option>
                    <option value="2025-03">2025년 3월</option>
                    <option value="2025-04">2025년 4월</option>
                    <option value="2025-05">2025년 5월</option>
                    <option value="2025-06">2025년 6월</option>
                    <option value="2025-07">2025년 7월</option>
                    <option value="2025-08">2025년 8월</option>
                    <option value="2025-09">2025년 9월</option>
                    <option value="2025-10">2025년 10월</option>
                    <option value="2025-11">2025년 11월</option>
                    <option value="2025-12">2025년 12월</option>
                  </select>
                  <Button
                    className="text-ui-sm ml-8 py-2 px-4 bg-secondary text-white rounded-lg"
                    type="button"
                    onClick={MonthNull}
                  >
                    연동 초기화
                  </Button>
                </div>
                <div>연결된 Todo : {connectTodoTask}</div>
              </div>
            )}
            <Button
              type="button"
              className="my-4 py-2 w-full sm:w-form-sm bg-secondary text-white rounded-lg"
              onClick={handleAddMemo}
            >
              추가
            </Button>
          </div>
        </div>
        <div className="sm:flex-1 sm:min-w-0 sm:self-start sm:my-8">
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
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-7 sm:gap-4">
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
              className="py-1.5 px-4 text-ui-sm font-nanumgothic_regular bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors"
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
              className="py-1.5 px-4 text-ui-sm font-nanumgothic_regular bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors"
            >
              숨기기
            </Button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-2 sm:gap-4">
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
