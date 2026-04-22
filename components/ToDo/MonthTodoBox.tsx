'use client'
import Button from '../Button'
import { formatDate } from './TodayDateFormat'
import { Todo } from './todosServer'

interface MonthTodoBoxProps {
  todo: Todo
  todoFetch: (todoTask: string) => void
}

export default function MonthTodoBox({ todo, todoFetch }: MonthTodoBoxProps) {
  const formattedDate = todo.date ? formatDate(new Date(todo.date)) : '날짜없음'
  const todoId = todo.id
  const todoTask = todo.task
  return (
    <Button
      type="button"
      key={todoId}
      onClick={() => todoFetch(todoTask)}
      className="flex flex-col size-36 sm:size-40 rounded-xl justify-center items-center text-center border border-gray-200 bg-white hover:border-secondary hover:shadow-sm transition-all cursor-pointer gap-1 sm:gap-2 p-2 sm:p-3"
    >
      <div className="text-ui-sm text-gray-800 line-clamp-3 leading-snug">
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
      <div className="text-md text-gray-500">{formattedDate}</div>
    </Button>
  )
}
