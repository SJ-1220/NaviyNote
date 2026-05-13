'use client'
import { useToDos } from '@/src/hooks/useToDos'
import { Memo } from '@/src/types/memo'
import Button from '../Button'
import LoadingPage from '../Loading'
import ConnectMemoBox from '../Memo/ConnectMemoBox'
import AddCalendar from './AddCalender'
import Calendar from './Calendar'
import NoDateTodos from './NoDateTodos'
import { todayDateFormat } from './TodayDateFormat'
import TodoBox from './TodoBox'

export default function ToDos() {
  const { state, actions } = useToDos()

  const { todolist, loading } = state
  const {
    setNewTask,
    setNewImportant,
    setNewCompleted,
    setNewDate,
    setNewConnect,
  } = actions

  if (loading) return <LoadingPage />

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
      {state.connectMemos.map((memo: Memo) => (
        <ConnectMemoBox
          memoFetch={() => actions.MemoIDContent(memo.id, memo.content)}
          key={memo.id}
          memo={memo}
        />
      ))}
    </div>
  )

  return (
    <div>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        {/* 왼쪽 열 */}
        <div className="sm:flex-1 sm:min-w-0">
          {/* 오늘의 Todo */}
          <div className="bg-white mt-8 border border-gray-200 rounded-xl shadow-sm">
            <div className="p-6">
              <div className="text-ui-md text-center mb-4 font-nanumgothic_bold text-primary">
                오늘({todayDateFormat()})의 Todo
              </div>
              {state.todayTodos.length === 0 ? (
                <div className="text-center text-ui-sm text-gray-500">
                  🍀오늘은 할일이 없습니다🍀
                </div>
              ) : (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-2 sm:gap-4 justify-items-center">
                  {state.todayTodos.map((todo) => (
                    <TodoBox key={todo.id} todo={todo} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 모바일 전용: 오늘의 Todo 바로 아래 이용 안내 */}
          <div className="mt-8 sm:hidden">{instructionBox}</div>

          {/* 날짜없는 TodoList */}
          <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-6">
              <div className="text-ui-md text-center font-nanumgothic_bold text-primary">
                날짜없는 Todo
              </div>
              <div className="mb-4 text-center text-ui-sm text-gray-500">
                날짜를 설정하고 싶다면, 캘린더로
                <span className="font-bold text-gray-700"> 드래그앤드롭</span>
              </div>
              {state.noDateTodos.length === 0 ? (
                <div className="text-center text-ui-sm text-gray-500">
                  🌻모든 Todo의 날짜가 있습니다🌻
                </div>
              ) : (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-2 sm:gap-4 justify-items-center">
                  {state.noDateTodos.map((todo) => (
                    <NoDateTodos key={todo.id} todo={todo} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 선택 날짜 전후 3일 Todo */}
          <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-6">
              {(!state.selectedDate || !state.session?.user?.email) && (
                <div>
                  <div className="text-ui-md text-center font-nanumgothic_bold text-primary">
                    캘린더에서 날짜를 선택하세요
                  </div>
                  <div className="text-center text-ui-sm text-gray-500 mt-1">
                    선택한 날짜의 전날, 당일, 다음날의 Todo
                  </div>
                </div>
              )}
              {state.selectedDate && state.session?.user?.email && (
                <div>
                  <div className="text-center text-ui-md font-nanumgothic_bold text-primary">
                    {state.selectedPrevDate} ~ {state.selectedNextDate}의 Todo
                  </div>
                  <div className="text-center text-ui-sm text-gray-500 mt-1 mb-4">
                    선택한 날짜의 전날, 당일, 다음날의 Todo
                  </div>
                  {state.threeDaysTodos.length === 0 ? (
                    <div className="text-ui-sm text-center text-gray-500">
                      🍀{state.selectedDate} 전후로는 할일이 없습니다🍀
                    </div>
                  ) : (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-2 sm:gap-4 justify-items-center">
                      {state.threeDaysTodos.map((todo) => (
                        <TodoBox key={todo.id} todo={todo} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Todo 추가 */}
          <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-6">
              <div className="text-ui-md text-center mb-6 font-nanumgothic_bold text-primary">
                Todo를 추가하세요
              </div>
              <div className="space-y-4 text-ui-sm font-nanumgothic_regular">
                <input
                  className="h-12 rounded-xl px-4 w-full text-gray-800 border border-gray-200 bg-gray-50 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-gray-400 font-nanumgothic_regular"
                  type="text"
                  value={state.newTask}
                  placeholder="새로운 Todo를 입력하세요"
                  onChange={(e) => setNewTask(e.target.value)}
                />
                <div className="flex flex-wrap gap-x-6 gap-y-3 text-gray-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.newImportant}
                      className="size-5 accent-danger"
                      onChange={(e) => setNewImportant(e.target.checked)}
                    />
                    <span>중요</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.newCompleted}
                      className="size-5 accent-secondary"
                      onChange={(e) => setNewCompleted(e.target.checked)}
                    />
                    <span>완료</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer w-full sm:w-auto">
                    <span className="text-gray-600 shrink-0">날짜</span>
                    <input
                      className="h-9 px-3 rounded-xl text-gray-800 border border-gray-200 bg-gray-50 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-nanumgothic_regular flex-1 min-w-0"
                      type="date"
                      value={state.newDate || ''}
                      onChange={(e) => setNewDate(e.target.value || null)}
                    />
                  </label>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                  <input
                    type="checkbox"
                    checked={state.newConnect}
                    className="size-5 accent-secondary"
                    onChange={(e) => {
                      setNewConnect(e.target.checked)
                      if (!e.target.checked) actions.setConnectMemoContent('')
                    }}
                  />
                  <span>메모와 연결</span>
                </label>
                {state.connectMemoContent && (
                  <div className="text-secondary bg-secondary/5 border border-secondary/20 rounded-lg px-3 py-2">
                    🔗 연결된 메모:{' '}
                    <span className="font-nanumgothic_bold">
                      {state.connectMemoContent}
                    </span>
                  </div>
                )}
                <Button
                  type="button"
                  onClick={actions.handleAddTodo}
                  disabled={state.isSubmitting}
                  className="w-full py-3 bg-secondary text-white rounded-xl hover:bg-primary transition-colors font-nanumgothic_bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.isSubmitting ? '추가 중...' : '+ Todo 추가'}
                </Button>
              </div>
            </div>
          </div>

          {/* 모바일 전용: 메모 선택 섹션을 Todo 추가 바로 아래에 */}
          {state.newConnect && (
            <div className="mt-8 sm:hidden bg-white border border-gray-200 rounded-xl">
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
          <div className="hidden sm:block mt-8 mb-4">{instructionBox}</div>

          {/* 데스크탑 전용: 네이버 캘린더 추가 버튼 */}
          <div className="hidden sm:flex mb-8 justify-center">
            <AddCalendar />
          </div>

          {/* 캘린더 (모바일에서는 왼쪽 열 아래에 표시됨) */}
          <div className="w-full z-10">
            <Calendar
              todos={todolist}
              setTodos={(newTodos) => actions.setTodosStore(newTodos)}
              onDateClick={actions.setSelectedDate}
            />
          </div>
        </div>
      </div>

      {/* 데스크탑 전용: 메모 선택 섹션 (양쪽 열 아래) */}
      {state.newConnect && (
        <div className="hidden sm:block mt-8 border border-gray-200 rounded-xl bg-white">
          <div className="p-6">
            <div className="text-start text-ui-md font-nanumgothic_bold text-primary mb-4">
              연결할 메모를 선택하세요
            </div>
            {connectMemoGrid}
          </div>
        </div>
      )}

      {!state.todolistOpen && (
        <div className="mt-8 mb-4 border border-gray-200 rounded-xl bg-white shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="text-ui-md font-nanumgothic_bold text-primary">
              전체 Todo
            </div>
            <Button
              onClick={actions.TodoOpen}
              type="button"
              className="py-1.5 px-4 text-ui-sm font-nanumgothic_regular bg-secondary/10 text-secondary rounded-xl hover:bg-secondary/20 transition-colors"
            >
              보기
            </Button>
          </div>
        </div>
      )}
      {state.todolistOpen && (
        <div className="mt-8 mb-4 border border-gray-200 rounded-xl bg-white shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
            <div className="text-ui-md font-nanumgothic_bold text-primary">
              전체 Todo
            </div>
            <Button
              onClick={actions.TodoOpen}
              type="button"
              className="py-1.5 px-4 text-ui-sm font-nanumgothic_regular bg-secondary/10 text-secondary rounded-xl hover:bg-secondary/20 transition-colors"
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
      <div className="sm:hidden flex justify-center">
        <AddCalendar />
      </div>

      <div className="mb-8"></div>
    </div>
  )
}
