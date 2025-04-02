import React, { useRef, useEffect } from 'react'
import { useDrag } from 'react-dnd'
import { Todo } from './todosServer'

interface TodoItemProps {
  todo: Todo
}

export default function TodoItem({ todo }: TodoItemProps) {
  const todoRef = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TODO',
    item: { id: todo.id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }))

  // drag 함수가 변경될 때마다 ref.current에 연결
  useEffect(() => {
    if (todoRef.current) {
      drag(todoRef.current)
    }
  }, [drag])

  return (
    <div
      ref={todoRef}
      className={`text-green-300 {isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      {todo.task}
    </div>
  )
}
