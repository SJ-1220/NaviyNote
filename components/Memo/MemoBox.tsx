import Link from 'next/link'
import { useRef } from 'react'
import { useDrag } from 'react-dnd'
import { Memo } from './memosServer'

interface MemoBoxProps {
  memo: Memo
  isDraggable?: boolean
}

export default function MemoBox({ memo, isDraggable = true }: MemoBoxProps) {
  const memoId = memo.id
  const memoDragRef = useRef<HTMLDivElement>(null)
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'MEMO',
    item: { id: memoId },
    canDrag: isDraggable,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }))
  drag(memoDragRef)

  return (
    <div
      ref={memoDragRef}
      className={isDraggable ? 'cursor-grab' : 'cursor-default'}
    >
      <Link
        passHref
        key={memoId}
        href={`/memo/memoItem/${memoId}`}
        className={`size-36 sm:size-40 rounded-xl flex flex-col justify-center items-center text-center bg-white border border-gray-200 shadow-sm hover:border-secondary hover:shadow-md transition-all gap-1 sm:gap-2 p-2 sm:p-3 ${isDragging ? 'opacity-50' : ''}`}
      >
        <div
          className={`text-ui-sm line-clamp-3 leading-snug ${isDragging ? 'text-gray-400' : 'text-gray-800'}`}
        >
          {memo.content}
        </div>
        <div className="flex gap-1 flex-wrap justify-center">
          <span
            className={`text-sm px-1.5 py-0.5 rounded-full font-nanumgothic_bold ${memo.active ? 'bg-secondary/10 text-secondary' : 'bg-gray-100 text-gray-400'}`}
          >
            {memo.active ? '활성' : '비활성'}
          </span>
          <span
            className={`text-sm px-1.5 py-0.5 rounded-full font-nanumgothic_bold ${memo.important ? 'bg-danger/10 text-danger' : 'bg-gray-100 text-gray-400'}`}
          >
            {memo.important ? '중요' : '일반'}
          </span>
        </div>
        {memo.todo_id && (
          <div className="text-sm text-secondary">🔗 Todo연결</div>
        )}
      </Link>
    </div>
  )
}
