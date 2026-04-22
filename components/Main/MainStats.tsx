import MainFirstChart from './MainFirstChart'

export default function MainStats() {
  return (
    <div>
      <div className="mt-16 mb-8 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="text-ui-sm mb-4 font-bold text-primary">
          이번달에 할일이 가장 많은 요일은?
        </div>
        <div className="text-base mb-4 text-gray-500">
          서비스 준비중입니다. 예시 화면
        </div>
        <MainFirstChart />
      </div>
      <div className="mt-16 mb-8 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="text-ui-sm mb-4 font-bold text-primary">
          최근 일주일 중 가장 할일이 많았던 날은?
        </div>
        <div className="text-base mb-4 text-gray-500">
          서비스 준비중입니다. 예시 화면
        </div>
        <div className="text-ui-sm text-gray-700">
          <div className="font-extrabold">🥇 수요일 4개</div>
          <div className="font-bold">🥈 토요일 2개</div>
          <div>🥉 화요일 1개</div>
        </div>
      </div>
    </div>
  )
}
