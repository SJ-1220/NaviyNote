import { useRecentTodos } from '@/src/hooks/useRecentTodos'
import LoadingPage from '../Loading'
import { MainTodo } from './mainServer'
import MainTodoBox from './MainTodoBox'

export default function RecentTodos() {
  const { state } = useRecentTodos()
  const { loading, todayTodos, nextTodos, prevTodos } = state

  if (loading) return <LoadingPage />

  return (
    <div>
      <div className="flex justify-center text-ui-md text-primary font-nanumgothic_bold mb-4">
        최근 10일의 Todo
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
        <div className="text-ui-sm font-nanumgothic_bold text-gray-600 mb-2">
          📅 오늘
        </div>
        {todayTodos.length > 0 ? (
          <div className="flex flex-col gap-2">
            {todayTodos.map((todo: MainTodo) => (
              <MainTodoBox
                title={todo.task}
                key={todo.id}
                important={todo.important}
                date={todo.date}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center text-ui-sm py-1">
            오늘의 Todo가 없습니다
          </div>
        )}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
        <div className="text-ui-sm font-nanumgothic_bold text-gray-600 mb-2">
          ⏭ 1~5일 후
        </div>
        {nextTodos.length > 0 ? (
          <div className="flex flex-col gap-2">
            {nextTodos.map((todo: MainTodo) => (
              <MainTodoBox
                title={todo.task}
                key={todo.id}
                important={todo.important}
                date={todo.date}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center text-ui-sm py-1">
            이후의 Todo가 없습니다
          </div>
        )}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
        <div className="text-ui-sm font-nanumgothic_bold text-gray-600 mb-2">
          ⏮ 1~5일 전
        </div>
        {prevTodos.length > 0 ? (
          <div className="flex flex-col gap-2">
            {prevTodos.map((todo: MainTodo) => (
              <MainTodoBox
                title={todo.task}
                key={todo.id}
                important={todo.important}
                date={todo.date}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center text-ui-sm py-1">
            이전의 Todo가 없습니다
          </div>
        )}
      </div>
    </div>
  )
}
