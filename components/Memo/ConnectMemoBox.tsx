'use client'
import React from 'react'
import { Memo } from './memosServer'
import Button from '../Button'

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
      className="flex flex-col size-[10rem] rounded-lg justify-center items-center text-center m-[1.5rem] outline-offset-0 outline"
    >
      <div className="text-[1.5rem]">{memo.content}</div>
      <div>
        {memo.active ? '표시✅' : '숨김❌'}
        {memo.important ? '중요✅' : '안중요❌'}
      </div>
      <div>{memo.connect ? '연결가능✅' : '연결불가❌'}</div>
      {/* connect는 나중에 뺄거임. 확인용 */}
      <div>{memo.todo_id ? `todo연결✅` : 'todo연결❌'}</div>
    </Button>
  )
}
