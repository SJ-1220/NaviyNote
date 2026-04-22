'use client'
import Button from '../Button'
import { Memo } from './memosServer'

interface ConnectMemoBoxProps {
  memo: Memo
  memoFetch: (memoContent: string) => void
}

export default function ConnectMemoBox({
  memo,
  memoFetch,
}: ConnectMemoBoxProps) {
  const memoId = memo.id
  const memoContent = memo.content
  return (
    <Button
      type="button"
      key={memoId}
      onClick={() => memoFetch(memoContent)}
      className="flex flex-col size-36 sm:size-40 rounded-xl justify-center items-center text-center border border-gray-200 bg-white hover:border-secondary hover:shadow-sm transition-all cursor-pointer gap-1 sm:gap-2 p-2 sm:p-3"
    >
      <div className="text-ui-sm text-gray-800 line-clamp-3 leading-snug">
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
    </Button>
  )
}
