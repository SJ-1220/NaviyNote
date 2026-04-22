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
      className="flex flex-col size-40 rounded-xl justify-center items-center text-center m-6 border border-gray-200 bg-white hover:border-secondary hover:shadow-sm transition-all text-gray-800 cursor-pointer"
    >
      <div className="text-ui-sm">{memo.content}</div>
      <div className="text-sm">
        {memo.active ? '표시✅' : '숨김❌'}
        {memo.important ? '중요✅' : '안중요❌'}
      </div>
      <div className="text-sm">
        {memo.todo_id ? `todo연결✅` : 'todo연결❌'}
      </div>
    </Button>
  )
}
