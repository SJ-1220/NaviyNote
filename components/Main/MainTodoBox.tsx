import React from 'react'
interface MainTodoBoxProps {
  title: string
  date?: string | null
  important: boolean
}
export default function MainTodoBox({
  title,
  date,
  important,
}: MainTodoBoxProps) {
  const newDate = date ? date.split('T')[0] : '날짜 없음'

  return (
    <div className="flex-col w-[15rem] h-[5rem] rounded-lg flex justify-center items-center text-center mx-[1rem] bg-navy2">
      <div className="text-[1.5rem]">{title}</div>
      {important && (
        <div className="flex">
          <div className="mr-[1rem]">{newDate}</div>
          <div>{important ? '🌟' : ''}</div>
        </div>
      )}
      {!important && <div>{newDate}</div>}
      <div></div>
    </div>
  )
}
