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
    <div
      className={`flex-col w-52 h-20 rounded-lg flex justify-center items-center text-center mx-4 bg-secondary text-white ${important ? 'outline outline-2 outline-danger' : ''}`}
    >
      <div className="text-ui-sm">{title}</div>
      {important && (
        <div className="flex">
          <div className="mr-4">{newDate}</div>
        </div>
      )}
      {!important && <div>{newDate}</div>}
    </div>
  )
}
