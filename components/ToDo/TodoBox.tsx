'use client'
import Link from 'next/link'
import { formatDate } from './TodayDateFormat'
import { Todo } from './todosServer'

interface TodoBoxProps {
  todo: Todo
  isDragging?: boolean
}

export default function TodoBox({ todo, isDragging }: TodoBoxProps) {
  const formattedDate = todo.date ? formatDate(new Date(todo.date)) : '날짜없음'
  const todoId = todo.id
  return (
    <Link
      passHref
      key={todoId}
      href={`/todo/todoItem/${todoId}`}
      className={`size-36 sm:size-40 rounded-xl flex flex-col justify-center items-center text-center bg-white border border-gray-200 shadow-sm hover:border-secondary hover:shadow-md transition-all gap-1 sm:gap-2 p-2 sm:p-3 ${isDragging ? 'opacity-50' : ''}`}
    >
      <div
        className={`text-ui-sm line-clamp-3 leading-snug ${isDragging ? 'text-gray-400' : 'text-gray-800'}`}
      >
        {todo.task}
      </div>
      <div className="flex gap-1 flex-wrap justify-center">
        <span
          className={`text-sm px-1.5 py-0.5 rounded-full font-nanumgothic_bold ${todo.completed ? 'bg-secondary/10 text-secondary' : 'bg-gray-100 text-gray-400'}`}
        >
          {todo.completed ? '완료' : '미완'}
        </span>
        <span
          className={`text-sm px-1.5 py-0.5 rounded-full font-nanumgothic_bold ${todo.important ? 'bg-danger/10 text-danger' : 'bg-gray-100 text-gray-400'}`}
        >
          {todo.important ? '중요' : '일반'}
        </span>
      </div>
      <div
        className={`text-sm ${isDragging ? 'text-gray-300' : 'text-gray-500'}`}
      >
        {formattedDate}
      </div>
      {todo.memo_id && (
        <div className="text-sm text-secondary">🔗 메모연결</div>
      )}
    </Link>
  )
}
