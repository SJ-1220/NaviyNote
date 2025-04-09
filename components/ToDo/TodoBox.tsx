import React from 'react'
import { Todo } from './todosServer'

interface TodoBoxProps {
  todo: Todo
  isDragging: boolean
}

export default function TodoBox({ todo, isDragging }: TodoBoxProps) {
  return (
    <div
      className={`size-[5rem] rounded-md text-center border-[0.5rem] border-purple-500 ${isDragging ? 'text-green-300' : 'text-white'}`}
    >
      {todo.task}
    </div>
  )
}
