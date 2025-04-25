'use client'
import ToDos from '@/components/ToDo/ToDos'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export default function ToDoPage() {
  return (
    <DndProvider backend={HTML5Backend}>
      <ToDos />
    </DndProvider>
  )
}
