import React from 'react'
import { Memo } from './memosServer'

interface MemoBoxProps {
  memo: Memo
}
export default function MemoBox({ memo }: MemoBoxProps) {
  return (
    <div>
      {memo.content}
      <br />
      {memo.todo_id}
      {memo.active ? '표시✅' : '숨김❌'}
      {memo.important ? '중요✅' : '안중요❌'}
      {memo.connect ? '연결가능✅' : '연결불가❌'}
      {memo.todo_id}
    </div>
  )
}
