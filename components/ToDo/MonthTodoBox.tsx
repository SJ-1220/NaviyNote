'use client'
import React from 'react'
import { Todo } from './todosServer'
import { formatDate } from './TodayDateFormat'
import Button from '../Button'

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
      className={`flex flex-col size-[10rem] rounded-lg justify-center items-center text-center m-[1.5rem] outline-offset-0 outline`}
    >
      <div className="text-[1.5rem]">{todo.task}</div>
      <div className="flex">
        {todo.completed ? '완료✅' : '미완❌'}
        {todo.important ? '중요⭐' : '안중요❌'}
      </div>
      <div> {todo.memo_id ? '메모연결✅' : '메모연결❌'}</div>
      <div> {`${formattedDate}`}</div>
    </Button>
  )
}
