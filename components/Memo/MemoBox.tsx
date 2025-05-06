import React from 'react'
import { Memo } from './memosServer'
import Link from 'next/link'

interface MemoBoxProps {
  memo: Memo
}
export default function MemoBox({ memo }: MemoBoxProps) {
  const memoId = memo.id
  return (
    <Link
      passHref
      key={memoId}
      href={`/memo/memoItem/${memoId}`}
      className="size-[10rem] rounded-lg flex justify-center items-center text-center mb-[1.5rem] mx-[1.5rem] bg-blue-800 text-white "
    >
      <div>
        {memo.content}
        <br />
        {memo.active ? '표시✅' : '숨김❌'}
        {memo.important ? '중요✅' : '안중요❌'}
        <br />
        {memo.connect ? '연결가능✅' : '연결불가❌'}
        <br />
        {memo.todo_id ? `${memo.todo_id}` : 'todo연결❌'}
      </div>
    </Link>
  )
}
