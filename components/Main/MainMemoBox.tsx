import React from 'react'
interface MainMemoBoxProps {
  title: string
  important: boolean
}
export default function MainMemoBox({ title, important }: MainMemoBoxProps) {
  return (
    <div
      className={`flex-col w-48 h-20 rounded-lg flex justify-center items-center text-center bg-secondary text-white mb-4 ${important ? 'outline outline-2 outline-danger' : ''}`}
    >
      <div className="text-ui-sm">{title}</div>
    </div>
  )
}
