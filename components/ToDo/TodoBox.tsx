'use client'
import React from 'react'
import { Todo } from './todosServer'
import { formatDate } from './TodayDateFormat'
import Link from 'next/link'

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
      className={`flex-col size-[10rem] rounded-lg flex justify-center items-center text-center mb-[1.5rem] mx-[1.5rem] bg-navy2 ${isDragging ? 'text-gray-400' : 'text-white'}`}
    >
      <div>
        <div className="text-[1.5rem]">{todo.task}</div>
        <div className="text-center">
          {todo.completed ? '완료✅' : '미완❌'}
          {todo.important ? '중요⭐' : '안중요❌'}
        </div>
        <div> {todo.memo_id ? `메모연결✅` : '메모연결❌'}</div>
        <div>{`날짜: ${formattedDate}`}</div>
      </div>
    </Link>
  )
}
