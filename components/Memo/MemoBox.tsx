import React, { useRef } from 'react'
import { Memo } from './memosServer'
import Link from 'next/link'
import { useDrag } from 'react-dnd'

interface MemoBoxProps {
  memo: Memo
}

export default function MemoBox({ memo }: MemoBoxProps) {
  const memoId = memo.id
  const memoDragRef = useRef<HTMLDivElement>(null)
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'MEMO',
    item: { id: memoId },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }))
  drag(memoDragRef)

  return (
    <div ref={memoDragRef}>
      <Link
        passHref
        key={memoId}
        href={`/memo/memoItem/${memoId}`}
        className={`flex-col size-40 rounded-xl flex justify-center items-center text-center mb-6 mx-6 bg-white border border-gray-200 shadow-sm hover:border-secondary hover:shadow-md transition-all ${isDragging ? 'opacity-50 text-gray-400' : 'text-gray-800'}`}
      >
        <div className="text-ui-sm">{memo.content}</div>
        <div className="flex text-sm">
          {memo.active ? '표시✅' : '숨김❌'}
          {memo.important ? '중요✅' : '안중요❌'}
        </div>
        <div className="text-sm">
          {memo.connect ? '연결가능✅' : '연결불가❌'}
        </div>
        <div className="text-sm">
          {memo.todo_id ? `todo연결✅` : 'todo연결❌'}
        </div>
      </Link>
    </div>
  )
}
