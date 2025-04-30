'use client'
import { useParams } from 'next/navigation'
import React from 'react'
import { Todo } from './todosServer'

const TodoModal = (todo: Todo) => {
  const { todoId } = useParams()
  console.log('todoId', todoId)
  return <div>TodoModal</div>
}
export default TodoModal
