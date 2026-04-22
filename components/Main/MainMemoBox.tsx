import React from 'react'
interface MainMemoBoxProps {
  title: string
  important: boolean
}
export default function MainMemoBox({ title, important }: MainMemoBoxProps) {
  return (
    <div
      className={`w-full rounded-lg p-3 bg-white border text-gray-800 text-ui-sm ${
        important ? 'border-l-4 border-danger' : 'border-gray-200'
      }`}
    >
      <div className="line-clamp-2 leading-snug">{title}</div>
      {important && (
        <div className="mt-1 text-xs text-danger font-nanumgothic_bold">
          ⭐ 중요
        </div>
      )}
    </div>
  )
}
