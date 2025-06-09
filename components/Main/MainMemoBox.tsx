import React from 'react'
interface MainMemoBoxProps {
  title: string
  important: boolean
}
export default function MainMemoBox({ title, important }: MainMemoBoxProps) {
  return (
    <div>
      <div>title:{title}</div>
      <div>important:{important}</div>
    </div>
  )
}
