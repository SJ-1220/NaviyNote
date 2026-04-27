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
      className={`rounded-xl p-3 bg-white border text-gray-800 text-ui-sm ${
        important
          ? 'border-l-4 border-gray-200 border-l-danger'
          : 'border-gray-200'
      }`}
    >
      <div className="font-nanumgothic_bold mb-1 line-clamp-2 leading-snug">
        {title}
      </div>
      <div className="text-sm text-gray-500">{newDate}</div>
    </div>
  )
}
