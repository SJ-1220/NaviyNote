'use client'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { fetchTodos, Todo } from './todosServer'
import useTodoStore from '@/src/store/todoStore'
import { useSession } from 'next-auth/react'

const TodoModal = () => {
  const { todoId } = useParams()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const todolist = useTodoStore((state) => state.todolist)
  const setTodosStore = useTodoStore((state) => state.setTodosStore)
  // 기본 route에서는 todolist가 비어있어서 zustand에서 가져오기
  useEffect(() => {
    const fetchData = async () => {
      if (todolist.length === 0 && session?.user?.email) {
        try {
          const fetchModalTodos = await fetchTodos(session.user.email)
          setTodosStore(fetchModalTodos)
        } catch (error) {
          console.log(error)
        }
      }
      setLoading(false)
    }
    fetchData()
  }, [session, todolist.length, setTodosStore])
  const todo = todolist.find((todo: Todo) => todo.id === todoId)
  if (loading) {
    return <div>Loading...</div>
  }
  if (!todo) {
    return <div>Todo not found</div>
  }
  // console.log('zustand에 저장된 todos', todolist)
  return (
    <div className="fixed inset-0 bg-black/20 flex justify-center items-center">
      <div className="bg-black rounded-lg p-[4rem]">
        <div>TodoModal</div>
        <div>{todo.task}</div>
        <div>{todo.id}</div>
      </div>
    </div>
  )
}
export default TodoModal
