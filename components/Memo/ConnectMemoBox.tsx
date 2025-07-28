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
      className="flex flex-col size-[10rem] rounded-lg justify-center items-center text-center m-[1.5rem] outline-[0.1rem] outline"
    >
      <div className="text-[1.5rem]">{memo.content}</div>
      <div>
        {memo.active ? '표시✅' : '숨김❌'}
        {memo.important ? '중요✅' : '안중요❌'}
      </div>
      <div>{memo.todo_id ? `todo연결✅` : 'todo연결❌'}</div>
    </Button>
  )
}
