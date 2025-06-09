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
  return (
    <div>
      <div>title:{title}</div>
      <div>date:{date}</div>
      <div>important:{important}</div>
    </div>
  )
}
