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
        className={`flex-col size-[10rem] rounded-lg flex justify-center items-center text-center mb-[1.5rem] mx-[1.5rem] bg-navy2 ${isDragging ? 'text-gray-400' : 'text-white'}`}
      >
        <div className="text-[1.5rem]">{memo.content}</div>
        <div className="flex">
          {memo.active ? '표시✅' : '숨김❌'}
          {memo.important ? '중요✅' : '안중요❌'}
        </div>
        <div>{memo.connect ? '연결가능✅' : '연결불가❌'}</div>
        <div> {memo.todo_id ? `todo연결✅` : 'todo연결❌'}</div>
      </Link>
    </div>
  )
}
