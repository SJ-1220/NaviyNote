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
      className={`size-[10rem] rounded-lg flex justify-center items-center text-center m-[1.5rem] outline-offset-0 outline`}
    >
      {todo.task}
      <br />
      {todo.completed ? '완료✅' : '미완❌'}
      {todo.important ? '중요⭐' : '안중요❌'}
      <br />
      {todo.memo_id ? `${todo.memo_id}` : '메모연결❌'}
      <br />
      {`날짜: ${formattedDate}`}
    </Button>
  )
}
