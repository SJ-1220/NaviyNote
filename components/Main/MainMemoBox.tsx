import React from 'react'
interface MainMemoBoxProps {
  title: string
  important: boolean
}
export default function MainMemoBox({ title, important }: MainMemoBoxProps) {
  return (
    <div
      className={`flex-col w-[12rem] h-[5rem] rounded-lg flex justify-center items-center text-center bg-navy2 mb-[1rem] ${important ? 'outline outline-[0.2rem] outline-red' : ''}`}
    >
      <div className="text-[1.5rem]">{title}</div>
    </div>
  )
}
