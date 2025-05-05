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
  setTodos: (todos: Todo[]) => void
  onDateClick?: (date: string) => void
}

export default function Calendar({
  todos,
  setTodos,
  onDateClick,
}: CalendarProps) {
  const { data: session } = useSession()
  const [events, setEvents] = useState<EventInput[]>([])
  const calendarAllDayRef = useRef<HTMLTableCellElement[]>([])
  const calendarDropRef = useRef<HTMLDivElement>(null)

  // Todo를 캘린더에 드롭했을 때 해당 todo의 날짜를 업데이트하는 함수
  const handleDrop = async (calendarDroppedDate: string, todoId: string) => {
    if (!todoId || !session?.user?.email) return
    try {
      const calendarCorrectedDate = new Date(calendarDroppedDate)
      calendarCorrectedDate.setDate(calendarCorrectedDate.getDate() + 1)

      await updateTodo(
        todoId,
        { date: calendarCorrectedDate.toISOString().split('T')[0] },
        session.user.email
      )
      const newTodos = todos.map((todo: Todo) =>
        todo.id === todoId
          ? {
              ...todo,
              date: calendarCorrectedDate.toISOString().split('T')[0],
            }
          : todo
      )
      setTodos(newTodos)
    } catch (error) {
      console.log('Error updating date:', error)
    }
  }

  // todo가 캘린더에 드롭된 좌표를 통해 날짜를 찾는 함수
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
  // 날짜가 있는 todo만 필터링하여 캘린더에 표시
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

  // 캘린더 내에서 todo를 드래그앤드롭하여 날짜를 변경했을 때 db에서 해당 todo의 날짜를 업데이트하는 함수
  const handleEventDrop = async (eventDropInfo: EventChangeArg) => {
    const todoId = eventDropInfo.event.id
    if (!todoId || !session?.user?.email) return

    const updatedDate = eventDropInfo.event.startStr
    try {
      await updateTodo(todoId, { date: updatedDate }, session.user.email)
      const newTodos = todos.map((todo: Todo) =>
        todo.id === todoId ? { ...todo, date: updatedDate } : todo
      )
      setTodos(newTodos)
    } catch (error) {
      console.log('Error updating date:', error)
    }
  }

  // DayCellMountArg : FullCalendar에서 제공하는 날짜 셀에 대한 정보
  // 각 날짜가 화면에 마운트될 때(처음 보여질 때) 호출되는 함수
  const handleDayCellDidMount = (info: DayCellMountArg) => {
    calendarAllDayRef.current.push(info.el as HTMLTableCellElement)
    // info에서 날짜만 추출해서 data-date 속성에 저장
    info.el.dataset.date = info.date.toISOString().split('T')[0]
  }

  // 컴포넌트가 언마운트될 때(페이지 이동이나 레이아웃 변경으로 안보여질 때) calendarAllDayRef.current 초기화하는 함수
  // 메모리 누수 방지
  useEffect(() => {
    return () => {
      calendarAllDayRef.current = []
    }
  }, [])

  return (
    <div ref={calendarDropRef}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        editable={true}
        droppable={true}
        eventDrop={handleEventDrop}
        dayCellDidMount={handleDayCellDidMount}
        dateClick={(info) => {
          const clickedDate = info.dateStr
          onDateClick?.(clickedDate)
        }}
      />
    </div>
  )
}
