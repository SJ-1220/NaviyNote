import React from 'react'
interface MainMemoBoxProps {
  title: string
  important: boolean
}
export default function MainMemoBox({ title, important }: MainMemoBoxProps) {
  return (
    <div className="flex-col w-[10rem] h-[5rem] rounded-lg flex justify-center items-center text-center mx-[1rem] bg-navy2 mb-[1rem]">
      <div className="text-[1.5rem]">{title}</div>
      <div>{important ? '🌟' : ''}</div>
    </div>
  )
}
