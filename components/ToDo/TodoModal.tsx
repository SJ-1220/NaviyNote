'use client'
import { useParams } from 'next/navigation'
import React from 'react'
import { Todo } from './todosServer'
import useTodoStore from '@/src/store/todoStore'

const TodoModal = (todo: Todo) => {
  const { todoId } = useParams()
  const todolist = useTodoStore((state) => state.todolist)
  console.log('zustand에 저장된 todos', todolist)
  return (
    <div>
      <div>TodoModal</div>
      <div>{todoId}</div>
    </div>
  )
}
export default TodoModal
