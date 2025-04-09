import React, { useRef, useEffect } from 'react'
import { useDrag } from 'react-dnd'
import { Todo } from './todosServer'
import TodoBox from './TodoBox'

interface NoDateTodosProps {
  todo: Todo
}

export default function NoDateTodos({ todo }: NoDateTodosProps) {
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
  if (todo.date) {
    return null
  }
  return (
    <div ref={todoRef}>
      <TodoBox todo={todo} isDragging={isDragging} />
    </div>
  )
}
