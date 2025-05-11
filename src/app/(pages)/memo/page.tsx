'use client'
import Memos from '@/components/Memo/Memos'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export default function MemoPage() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Memos />
    </DndProvider>
  )
}
