'use client'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { EventChangeArg } from '@fullcalendar/core'
import { useEffect, useState } from 'react'
import { Todo, updateTodo } from './todosServer'
import { useSession } from 'next-auth/react'
import { EventInput } from '@fullcalendar/core'

interface CalendarProps {
  todos: Todo[]
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

export default function Calendar({ todos, setTodos }: CalendarProps) {
  const { data: session } = useSession()
  const [events, setEvents] = useState<EventInput[]>([])

  useEffect(() => {
    setEvents(
      todos
        .filter((todo: Todo) => todo.date)
        .map((todo: Todo) => ({
          id: todo.id,
          title: todo.task,
          start: todo.date ? new Date(todo.date) : undefined,
        }))
    )
  }, [todos])

  const handleEventDrop = async (eventDropInfo: EventChangeArg) => {
    const todoId = eventDropInfo.event.id
    if (!todoId || !session?.user?.email) return

    const updatedDate = eventDropInfo.event.startStr
    try {
      await updateTodo(todoId, { date: updatedDate }, session.user.email)
      setTodos((prevTodos) =>
        prevTodos.map((todo: Todo) =>
          todo.id === todoId ? { ...todo, date: updatedDate } : todo
        )
      )
    } catch (error) {
      console.log('Error updating date:', error)
    }
  }
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      editable={true}
      droppable={true}
      eventDrop={handleEventDrop}
    />
  )
}
