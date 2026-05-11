'use client'
import { useMemos } from '@/src/hooks/useMemos'
import { Todo } from '@/src/types/todo'
import Button from '../Button'
import LoadingPage from '../Loading'
import MonthTodoBox from '../ToDo/MonthTodoBox'
import MemoBox from './MemoBox'
import MemoDropZone from './MemoDropZone'
import YearMonthPicker from './YearMonthPicker'

const Memos = () => {
  const { state, actions } = useMemos()

  const { memolist, loading } = state
  const { setNewContent, setNewActive, setNewImportant, setNewConnect } =
    actions

  if (loading) return <LoadingPage />

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
              value={state.newContent}
              placeholder="새로운 Memo를 추가하세요"
              onChange={(e) => setNewContent(e.target.value)}
            />
            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
              <label className="inline-flex items-center whitespace-nowrap gap-2 font-nanumgothic_regular">
                중요도
                <input
                  type="checkbox"
                  className="size-6"
                  checked={state.newImportant}
                  onChange={(e) => setNewImportant(e.target.checked)}
                />
              </label>
              <label className="inline-flex items-center whitespace-nowrap gap-2 font-nanumgothic_regular">
                활성화
                <input
                  type="checkbox"
                  className="size-6"
                  checked={state.newActive}
                  onChange={(e) => setNewActive(e.target.checked)}
                />
              </label>
              <label className="inline-flex items-center whitespace-nowrap gap-2 font-nanumgothic_regular">
                연동가능
                <input
                  type="checkbox"
                  className="size-6"
                  checked={state.newConnect}
                  onChange={(e) => setNewConnect(e.target.checked)}
                />
              </label>
            </div>
            {state.newConnect && (
              <div>
                <div className="flex flex-col gap-2 mb-3 min-[586px]:flex-row min-[586px]:items-center min-[586px]:justify-between">
                  <div className="text-ui-sm">연결할 날짜 선택</div>
                  <Button
                    className="text-ui-sm py-2 px-4 bg-secondary text-white rounded-xl self-start hover:bg-primary transition-colors"
                    type="button"
                    onClick={actions.MonthNull}
                  >
                    연동 초기화
                  </Button>
                </div>
                <div className="mb-4 w-full max-w-full">
                  <YearMonthPicker
                    value={state.selectedMonth}
                    onChange={actions.setSelectedMonth}
                  />
                </div>
                {state.connectTodoTask &&
                state.connectTodoTask.trim() !== '' ? (
                  <div className="text-secondary bg-secondary/5 border border-secondary/20 rounded-lg px-3 py-2">
                    🔗 연결된 Todo:{' '}
                    <span className="font-nanumgothic_bold">
                      {state.connectTodoTask}
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
              disabled={state.isSubmitting}
              className="my-4 py-3 w-full bg-secondary text-white rounded-xl font-nanumgothic_bold shadow-sm hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={actions.handleAddMemo}
            >
              {state.isSubmitting ? '추가 중...' : '+ 메모 추가'}
            </Button>
          </div>
        </div>
        <div className="hidden sm:block sm:flex-[2] sm:min-w-[280px] sm:self-start sm:my-8">
          {instructionBox}
        </div>
      </div>

      {state.newConnect && state.selectedMonth && (
        <div className="mb-8 border border-gray-200 rounded-xl bg-white shadow-sm">
          <div className="p-6">
            <div className="text-ui-md font-nanumgothic_bold text-primary mb-2">
              연결할 Todo 선택
            </div>
            <div className="font-nanumgothic_regular text-gray-600 text-ui-sm mb-4 leading-relaxed">
              선택한 날짜의 Todo입니다. 연결할 Todo를 선택해주세요.
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-2 sm:gap-4 justify-items-center">
              {state.monthTodolist.map((todo: Todo) => (
                <MonthTodoBox
                  todoFetch={() => actions.TodoIDTask(todo.id, todo.task)}
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
          MemoDrop={actions.handleDropMemo}
        >
          <div className="h-full min-h-zone bg-white border-2 border-dashed border-secondary/30 rounded-xl">
            <div className="p-4">
              <div className="text-secondary text-center text-ui-md mb-4 font-nanumgothic_bold">
                안중요 + 활성 메모
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-2 sm:gap-4 justify-items-center">
                {state.AcUnimMemolist.map((memo) => (
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
          MemoDrop={actions.handleDropMemo}
        >
          <div className="h-full min-h-zone bg-white border-2 border-dashed border-danger/30 rounded-xl">
            <div className="p-4">
              <div className="text-danger text-center text-ui-md mb-4 font-nanumgothic_bold">
                중요 + 활성화 메모
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-2 sm:gap-4 justify-items-center">
                {state.AcImMemolist.map((memo) => (
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
          MemoDrop={actions.handleDropMemo}
        >
          <div className="h-full min-h-zone bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl">
            <div className="p-4">
              <div className="text-gray-500 text-center text-ui-md mb-4 font-nanumgothic_bold">
                안중요 + 비활성 메모
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-2 sm:gap-4 justify-items-center">
                {state.InacUnimMemolist.map((memo) => (
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
          MemoDrop={actions.handleDropMemo}
        >
          <div className="h-full min-h-zone bg-gray-50 border-2 border-dashed border-danger/20 rounded-xl">
            <div className="p-4">
              <div className="text-gray-500 text-center text-ui-md mb-4 font-nanumgothic_bold">
                중요 + 비활성 메모
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-2 sm:gap-4 justify-items-center">
                {state.InacImMemolist.map((memo) => (
                  <MemoBox key={memo.id} memo={memo} />
                ))}
              </div>
            </div>
          </div>
        </MemoDropZone>
      </div>

      {!state.memolistOpen && (
        <div className="my-8 border border-gray-200 rounded-xl bg-white shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="text-ui-md font-nanumgothic_bold text-primary">
              전체 메모
            </div>
            <Button
              type="button"
              onClick={actions.MemoOpen}
              className="py-1.5 px-4 text-ui-sm font-nanumgothic_regular bg-secondary/10 text-secondary rounded-xl hover:bg-secondary/20 transition-colors"
            >
              보기
            </Button>
          </div>
        </div>
      )}
      {state.memolistOpen && (
        <div className="my-8 border border-gray-200 rounded-xl bg-white shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
            <div className="text-ui-md font-nanumgothic_bold text-primary">
              전체 메모
            </div>
            <Button
              type="button"
              onClick={actions.MemoOpen}
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
