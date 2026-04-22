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
      className={`flex-col size-40 rounded-xl flex justify-center items-center text-center mb-6 mx-6 bg-white border border-gray-200 shadow-sm hover:border-secondary hover:shadow-md transition-all ${isDragging ? 'opacity-50 text-gray-400' : 'text-gray-800'}`}
    >
      <div>
        <div className="text-ui-sm">{todo.task}</div>
        <div className="flex justify-center text-center text-sm">
          <div className="mr-2">{todo.completed ? '완료✅' : '미완❌'}</div>
          <div>{todo.important ? '중요⭐' : '안중요❌'}</div>
        </div>
        <div className="text-sm">
          {todo.memo_id ? `메모연결✅` : '메모연결❌'}
        </div>
        <div className="text-sm">{`${formattedDate}`}</div>
      </div>
    </Link>
  )
}
