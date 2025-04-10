import React from 'react'
import { Todo } from './todosServer'
import { formatDate } from './TodayDateFormat'
interface TodoBoxProps {
  todo: Todo
  isDragging?: boolean
}

export default function TodoBox({ todo, isDragging }: TodoBoxProps) {
  console.log(todo.date)
  const formattedDate = todo.date ? formatDate(new Date(todo.date)) : '날짜없음'

  return (
    <div
      className={`size-[10rem] rounded-lg flex justify-center items-center text-center mx-[1.5rem] bg-blue-800  ${isDragging ? 'text-green-300' : 'text-white'}`}
    >
      <div>
        {todo.task}
        <br />
        {todo.completed ? '완료✅' : '아직❌'}
        {todo.important ? '중요⭐' : '보통🌊'}
        <br />
        {`날짜: ${formattedDate}`}
      </div>
    </div>
  )
}
