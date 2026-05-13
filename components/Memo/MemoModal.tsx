'use client'

import { useMemoModal } from '@/src/hooks/useMemoModal'
import { Todo } from '@/src/types/todo'
import Button from '../Button'
import LoadingPage from '../Loading'
import MonthTodoBox from '../ToDo/MonthTodoBox'
import YearMonthPicker from './YearMonthPicker'

const MemoModal = () => {
  const { state, actions } = useMemoModal()
  const { memo, loading, editMemo } = state

  if (loading) {
    return (
      <div
        className="fixed inset-0 bg-black/30 flex justify-center items-center p-2"
        onClick={actions.onClose}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <LoadingPage />
        </div>
      </div>
    )
  }

  if (!memo) return null

  return (
    <div
      className="fixed inset-0 bg-black/30 flex justify-center items-center p-2"
      onClick={actions.onClose}
    >
      <div
        className="relative w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white text-gray-800 text-ui-sm rounded-2xl p-6 shadow-2xl max-h-[calc(100vh-16px)] overflow-y-auto">
          <div className="mb-4 flex justify-between gap-4">
            <Button
              className="rounded-xl bg-secondary text-white py-2 px-4 hover:bg-primary transition-colors"
              type="button"
              onClick={actions.onClose}
            >
              모달 닫기
            </Button>
            {editMemo ? (
              <Button
                className="rounded-xl py-2 px-4 bg-secondary text-white hover:bg-primary transition-colors"
                type="button"
                onClick={actions.updateMemoInput}
              >
                적용
              </Button>
            ) : (
              <Button
                className="rounded-xl py-2 px-4 bg-secondary text-white hover:bg-primary transition-colors"
                type="button"
                onClick={() => {
                  actions.handleEditMemo(memo)
                }}
              >
                수정
              </Button>
            )}
            <Button
              className="rounded-xl py-2 px-4 bg-danger text-white hover:opacity-80 transition-opacity"
              type="button"
              onClick={() => actions.setShowDeleteConfirm(true)}
            >
              삭제
            </Button>
          </div>
          <div className="text-center text-ui-md font-bold font-nanumgothic_bold mb-8 text-primary">
            {memo.content}
          </div>
          {!editMemo && (
            <div className="space-y-3 font-nanumgothic_regular">
              <div className="flex gap-2 flex-wrap">
                <span
                  className={`text-md px-2.5 py-1 rounded-full font-nanumgothic_bold ${memo.active ? 'bg-secondary/10 text-secondary' : 'bg-gray-100 text-gray-400'}`}
                >
                  {memo.active ? '표시' : '숨김'}
                </span>
                <span
                  className={`text-md px-2.5 py-1 rounded-full font-nanumgothic_bold ${memo.important ? 'bg-danger/10 text-danger' : 'bg-gray-100 text-gray-400'}`}
                >
                  {memo.important ? '중요' : '안중요'}
                </span>
                <span
                  className={`text-md px-2.5 py-1 rounded-full font-nanumgothic_bold ${memo.connect ? 'bg-secondary/10 text-secondary' : 'bg-gray-100 text-gray-400'}`}
                >
                  {memo.connect ? '연결가능' : '연결불가'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 shrink-0">연결된 Todo</span>
                <span className="text-gray-800">
                  {memo.todo_id &&
                  memo.todo_id.trim() !== '' &&
                  state.memoTodo &&
                  state.memoTodo.todo
                    ? state.memoTodo.todo.task
                    : '없음'}
                </span>
              </div>
            </div>
          )}

          {editMemo && (
            <div>
              <label className="flex items-center gap-4 mb-4">
                <span className="text-gray-500 shrink-0 font-nanumgothic_regular">
                  메모 내용
                </span>
                <input
                  className="h-10 px-3 rounded-xl w-full text-gray-800 border border-gray-300 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-nanumgothic_regular"
                  type="text"
                  value={state.newContent}
                  onChange={(e) => actions.setNewContent(e.target.value)}
                />
              </label>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
                <label className="inline-flex items-center whitespace-nowrap gap-2">
                  <div className="font-nanumgothic_regular">활성화</div>
                  <input
                    type="checkbox"
                    checked={state.newActive}
                    onChange={(e) => actions.setNewActive(e.target.checked)}
                    className="size-6"
                  />
                </label>
                <label className="inline-flex items-center whitespace-nowrap gap-2">
                  <div className="font-nanumgothic_regular">중요</div>
                  <input
                    type="checkbox"
                    checked={state.newImportant}
                    onChange={(e) => actions.setNewImportant(e.target.checked)}
                    className="size-6"
                  />
                </label>
                <label className="inline-flex items-center whitespace-nowrap gap-2">
                  <div className="font-nanumgothic_regular">연동</div>
                  <input
                    type="checkbox"
                    checked={state.newConnect}
                    onChange={(e) => actions.setNewConnect(e.target.checked)}
                    className="size-6"
                  />
                </label>
              </div>
              {state.newConnect && (
                <div className="mb-4">
                  {memo.todo_id && memo.todo_id.trim() !== '' && (
                    <div>
                      {state.memoTodo && state.memoTodo.todo && (
                        <div className="mb-4">
                          기존 Todo의 Task : {state.memoTodo.todo.task}
                        </div>
                      )}
                    </div>
                  )}
                  <div>
                    <div className="mb-3 font-nanumgothic_regular">
                      새로 연동할 Todo의 날짜 선택
                    </div>
                    <div className="flex flex-col gap-3 mb-2">
                      <YearMonthPicker
                        value={state.newSelectedMonth}
                        onChange={actions.setNewSelectedMonth}
                      />
                      <Button
                        className="w-full rounded-xl py-2 px-4 bg-secondary text-white hover:bg-primary transition-colors"
                        type="button"
                        onClick={actions.NewMonthNull}
                      >
                        Todo 연결 초기화
                      </Button>
                    </div>
                    {state.newConnectTodoTask &&
                    state.newConnectTodoTask.trim() !== '' ? (
                      <div className="mt-2 text-secondary bg-secondary/5 border border-secondary/20 rounded-lg px-3 py-2">
                        🔗 새로운 Todo:{' '}
                        <span className="font-nanumgothic_bold">
                          {state.newConnectTodoTask}
                        </span>
                      </div>
                    ) : (
                      <div className="mt-2 font-nanumgothic_regular text-gray-500">
                        새로운 Todo :{' '}
                        {state.isTodoNull ? <span>없음</span> : <span>❔</span>}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {editMemo && state.newSelectedMonth && (
            <div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
                {state.newMonthTodolist.map((todo: Todo) => (
                  <MonthTodoBox
                    todoFetch={() => actions.TodoIDTask(todo.id, todo.task)}
                    key={todo.id}
                    todo={todo}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        {state.showDeleteConfirm && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/40 backdrop-blur-sm">
            <div className="animate-fade-in-scale bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center gap-3 text-center">
              <p className="font-nanumgothic_bold text-primary text-ui-sm">
                정말 삭제하시겠습니까?
              </p>
              <p className="font-nanumgothic_regular text-gray-500 text-ui-caption">
                이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="flex gap-3 mt-2">
                <Button
                  className="rounded-xl py-2 px-4 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                  type="button"
                  onClick={() => actions.setShowDeleteConfirm(false)}
                >
                  취소
                </Button>
                <Button
                  className="rounded-xl py-2 px-4 bg-danger text-white hover:opacity-80 transition-opacity"
                  type="button"
                  onClick={() => actions.handleDeleteMemo(memo.id)}
                >
                  삭제 확인
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default MemoModal
