interface MainMemoBoxProps {
  title: string
  important: boolean
}
export default function MainMemoBox({ title, important }: MainMemoBoxProps) {
  return (
    <div
      className={`w-full rounded-xl p-3 bg-white border text-gray-800 text-ui-sm ${
        important
          ? 'border-l-4 border-gray-200 border-l-danger'
          : 'border-gray-200'
      }`}
    >
      <div className="line-clamp-2 leading-snug">{title}</div>
    </div>
  )
}
