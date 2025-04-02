'use client'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { EventChangeArg, EventInput } from '@fullcalendar/core'
import { useEffect, useState, useRef } from 'react'
import { Todo, updateTodo } from './todosServer'
import { useSession } from 'next-auth/react'
import { useDrop } from 'react-dnd'
import { DayCellMountArg } from '@fullcalendar/core'

interface CalendarProps {
  todos: Todo[]
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

export default function Calendar({ todos, setTodos }: CalendarProps) {
  const { data: session } = useSession()
  const [events, setEvents] = useState<EventInput[]>([])
  const calendarAllDayRef = useRef<HTMLTableCellElement[]>([])
  const calendarDropRef = useRef<HTMLDivElement>(null)

  // Todo의 날짜 update
  const handleDrop = async (calendarDroppedDate: string, todoId: string) => {
    if (!todoId || !session?.user?.email) return
    try {
      await updateTodo(
        todoId,
        { date: calendarDroppedDate },
        session.user.email
      )
      setTodos((prevTodos) =>
        prevTodos.map((todo: Todo) =>
          todo.id === todoId ? { ...todo, date: calendarDroppedDate } : todo
        )
      )
    } catch (error) {
      console.log('Error updating date:', error)
    }
  }

  // 특정 todo가 캘린더에 드롭된 좌표를 통해 날짜를 찾아, todo와 캘린더를 update
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TODO',
    drop: (item: { id: string }, monitor) => {
      // calendarDropDayInfo : 캘린더에 드롭된 좌표 반환
      const calendarDroppedInfo = monitor.getClientOffset()
      if (calendarDroppedInfo) {
        const dropX = calendarDroppedInfo.x
        const dropY = calendarDroppedInfo.y
        const calendarDroppedPoint = calendarAllDayRef.current.find((point) => {
          if (!point) return false
          const rect = point.getBoundingClientRect()
          return (
            dropX >= rect.left &&
            dropX <= rect.right &&
            dropY >= rect.top &&
            dropY <= rect.bottom
          )
        })
        if (calendarDroppedPoint) {
          const calendarDroppedDate = calendarDroppedPoint.dataset.date
          if (calendarDroppedDate) {
            handleDrop(calendarDroppedDate, item.id)
          }
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }))

  // drop 함수가 변경될 때마다 calendarDropRef.current에 연결
  useEffect(() => {
    drop(calendarDropRef.current)
  }, [drop])

  // todos 배열이 변경될 때마다 캘린더에 표시할 events 배열을 업데이트
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

  // 캘린더 내에서 todo를 드래그앤드롭했을 때 todo와 calendar를 upate하는 함수
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

  // DayCellMountArg : FullCalendar에서 제공하는 날짜 셀에 대한 정보
  const handleDayCellDidMount = (info: DayCellMountArg) => {
    calendarAllDayRef.current.push(info.el as HTMLTableCellElement)
    // info.el.dataset.date : info에서 날짜만 추출
    info.el.dataset.date = info.date.toISOString().split('T')[0]
  }

  useEffect(() => {
    return () => {
      calendarAllDayRef.current = []
    }
  }, [])

  return (
    <div ref={calendarDropRef} className={isOver ? 'bg-gray-200' : ''}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        editable={true}
        droppable={true}
        eventDrop={handleEventDrop}
        dayCellDidMount={handleDayCellDidMount}
      />
    </div>
  )
}
