export default function LoadingPage() {
  return (
    <div className="h-page-loading flex flex-col justify-center items-center gap-4">
      <div className="text-ui-mega text-primary animate-pulse">◌</div>
      <div className="text-ui-sm text-gray-500 font-nanumgothic_regular">
        데이터가 로딩되고 있습니다
      </div>
    </div>
  )
}
