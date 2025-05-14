'use client'
import { useSession } from 'next-auth/react'
import { addMemo, fetchMemos, Memo, updateMemo } from './memosServer'
import { useEffect, useMemo, useState } from 'react'
import LoadingPage from '../Loading'
import Button from '../Button'
import MemoBox from './MemoBox'
import useMemoStore from '@/src/store/memoStore'
import MemoDropZone from './MemoDropZone'
import { fetchMonthTodo, Todo } from '../ToDo/todosServer'
import MonthTodoBox from '../ToDo/MonthTodoBox'

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
          setMemosStore([...memolist, { ...memo, id: result.id }])
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
  return (
    <div>
      {/* 메모 추가 + 연결된 메모 */}
      <div className="flex justify-between">
        {/* 메모 추가 */}
        <div className="my-[2rem] text-[1.5rem] outline-offset-[1rem] outline rounded-md">
          <div className="text-[2rem]">메모를 추가하세요</div>
          <input
            className="w-[30rem] text-black mb-[1rem]"
            type="text"
            value={newContent}
            placeholder="새로운 Memo를 추가하세요"
            onChange={(e) => setNewContent(e.target.value)}
          />
          <div className="mb-[1rem]">
            <label className="mr-[2rem]">
              중요도
              <input
                type="checkbox"
                className="size-[1.5rem]"
                checked={newImportant}
                onChange={(e) => setNewImportant(e.target.checked)}
              />
            </label>
            <label className="mr-[2rem]">
              활성화
              <input
                type="checkbox"
                className="size-[1.5rem]"
                checked={newActive}
                onChange={(e) => setNewActive(e.target.checked)}
              />
            </label>
            <label className="mr-[2rem]">
              연동가능
              <input
                type="checkbox"
                className="size-[1.5rem]"
                checked={newConnect}
                onChange={(e) => setNewConnect(e.target.checked)}
              />
            </label>
          </div>
          <div className="text-[1.5rem] mb-[1rem]">연동할 날짜 선택</div>
          <div className="items-center flex mb-[1rem]">
            <div className="mr-[1rem]">▶</div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              title="month"
              className="text-[1.5rem] text-black"
            >
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
              className="text-[1.5rem] ml-[2rem] p-[0.5rem] bg-navy2 rounded-md"
              type="button"
              onClick={MonthNull}
            >
              연동 초기화
            </Button>
          </div>
          <div>연결된 Todo : {connectTodoTask}</div>
          <Button
            type="button"
            className="my-[1rem] py-[1rem] w-[30rem] bg-navy2 rounded-md"
            onClick={handleAddMemo}
          >
            추가
          </Button>
        </div>
        <div className="self-center text-end text-[2rem]">
          메모는 네 구역(활성/비활성 + 중요/안중요)으로 분류되어 표시됩니다.
          <br />
          메모를 드래그하여 구역을 옮기면
          <span className="font-bold">활성/중요 여부</span>가 자동으로
          변경됩니다.
          <br />
          메모를 클릭하면 <span className="font-bold">수정/삭제</span>할 수 있는
          상세 화면으로 이동합니다.
        </div>
        {/* 연결된 메모 */}
      </div>
      {selectedMonth && (
        <div className="text-[2rem] my-[2rem] outline-offset-[1rem] outline rounded-md">
          선택한 날짜의 Todo입니다. 연결할 Todo를 선택해주세요.
          <div className="w-fit gap-[1rem] mx-auto grid grid-cols-7 text-[1rem]">
            {monthTodolist.map((todo: Todo) => (
              <MonthTodoBox
                todoFetch={() => TodoIDTask(todo.id, todo.task)}
                key={todo.id}
                todo={todo}
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-[1rem]">
        {/* 안중요+활성 메모 */}
        <MemoDropZone
          zoneIsActive={true}
          zoneIsImportant={false}
          MemoDrop={handleDropMemo}
        >
          <div className="min-h-[30rem] my-[2rem] mr-[2rem] outline-offset-[1rem] outline rounded-md">
            <div className="text-center text-[2rem] mb-[1rem]">
              안중요+활성 메모
            </div>
            <div className="w-fit gap-[1rem] mx-auto grid grid-cols-3">
              {AcUnimMemolist.map((memo) => (
                <MemoBox key={memo.id} memo={memo} />
              ))}
            </div>
          </div>
        </MemoDropZone>
        {/* 중요+활성화 메모 */}
        <MemoDropZone
          zoneIsActive={true}
          zoneIsImportant={true}
          MemoDrop={handleDropMemo}
        >
          <div className="min-h-[30rem] ml-[2rem] my-[2rem] outline-offset-[1rem] outline rounded-md">
            <div className="text-center text-[2rem] mb-[1rem]">
              중요+활성화 메모
            </div>
            <div className="w-fit gap-[1rem] mx-auto grid grid-cols-3">
              {AcImMemolist.map((memo) => (
                <MemoBox key={memo.id} memo={memo} />
              ))}
            </div>
          </div>
        </MemoDropZone>
        {/* 안중요+비활성 메모 */}
        <MemoDropZone
          zoneIsActive={false}
          zoneIsImportant={false}
          MemoDrop={handleDropMemo}
        >
          <div className="min-h-[30rem] mr-[2rem] my-[2rem] outline-offset-[1rem] outline rounded-md">
            <div className="text-center text-[2rem] mb-[1rem]">
              안중요+비활성 메모
            </div>
            <div className="w-fit gap-[1rem] mx-auto grid grid-cols-3">
              {InacUnimMemolist.map((memo) => (
                <MemoBox key={memo.id} memo={memo} />
              ))}
            </div>
          </div>
        </MemoDropZone>
        {/* 중요+비활성 메모 */}
        <MemoDropZone
          zoneIsActive={false}
          zoneIsImportant={true}
          MemoDrop={handleDropMemo}
        >
          <div className=" min-h-[30rem] ml-[2rem] my-[2rem] outline-offset-[1rem] outline rounded-md">
            <div className="text-center text-[2rem] mb-[1rem]">
              중요+비활성 메모
            </div>
            <div className="w-fit gap-[1rem] mx-auto grid grid-cols-3">
              {InacImMemolist.map((memo) => (
                <MemoBox key={memo.id} memo={memo} />
              ))}
            </div>
          </div>
        </MemoDropZone>
      </div>
      {!memolistOpen && (
        <div className="mb-[2rem] items-center text-center">
          <Button
            type="button"
            onClick={MemoOpen}
            className=" px-[43rem] text-[2rem] w-full items-center mt-[3.5rem] outline-offset-[1rem] outline rounded-md"
          >
            전체 메모 보기
          </Button>
        </div>
      )}
      {memolistOpen && (
        <div className="mb-[2rem] items-center mt-[3.5rem] outline-offset-[1rem] outline rounded-md">
          <div className="text-center mb-[2rem] text-[2rem]">전체 메모</div>
          <div>
            <div className="grid grid-cols-7 gap-[1rem]">
              {memolist.map((memo) => (
                <MemoBox key={memo.id} memo={memo} />
              ))}
            </div>
            <div className="text-[1.5rem] text-center items-center">
              <Button
                onClick={MemoOpen}
                type="button"
                className="ml-[2rem] p-[0.5rem] bg-navy2 rounded-md"
              >
                전체 메모 숨김
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default Memos
