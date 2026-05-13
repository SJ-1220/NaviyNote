'use client'
import { useCalendar } from '@/src/hooks/useCalendar'
import { Todo } from '@/src/types/todo'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
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
  const { events, calendarDropRef, handleEventDrop, handleDayCellDidMount } =
    useCalendar(todos, setTodos)

  return (
    <div
      ref={calendarDropRef}
      className="min-w-0 overflow-x-auto h-[500px] sm:h-calendar"
    >
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        editable={true}
        droppable={true}
        height="100%"
        eventDrop={handleEventDrop}
        displayEventTime={false}
        dayCellDidMount={handleDayCellDidMount}
        dateClick={(info) => {
          const clickedDate = info.dateStr
          onDateClick?.(clickedDate)
        }}
      />
    </div>
  )
}
