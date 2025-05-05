'use client'
import TodoModal from '@/components/ToDo/TodoModal'
import React from 'react'

const TodoInterceptPage = () => {
  console.log('modal route intercept')
  return (
    <>
      <TodoModal />
    </>
  )
}
export default TodoInterceptPage
