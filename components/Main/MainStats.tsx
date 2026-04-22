import MainFirstChart from './MainFirstChart'

export default function MainStats() {
  return (
    <div>
      <div className="my-8 p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col items-center w-full overflow-hidden">
        <div className="text-ui-sm mb-4 font-bold font-nanumgothic_bold text-primary text-center">
          이번달에 할일이 가장 많은 요일은?
        </div>
        <div className="text-base mb-4 text-gray-500 text-center font-nanumgothic_regular">
          서비스 준비중입니다. 예시 화면
        </div>
        <div className="w-full">
          <MainFirstChart />
        </div>
      </div>
      <div className="my-8 p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col items-center">
        <div className="text-ui-sm mb-4 font-bold font-nanumgothic_bold text-primary text-center">
          최근 일주일 중 가장 할일이 많았던 날은?
        </div>
        <div className="text-base mb-4 text-gray-500 text-center font-nanumgothic_regular">
          서비스 준비중입니다. 예시 화면
        </div>
        <div className="text-ui-sm text-gray-700 flex flex-col items-center text-center">
          <div className="font-extrabold font-nanumgothic_extrabold">
            🥇 수요일 4개
          </div>
          <div className="font-bold font-nanumgothic_bold">🥈 토요일 2개</div>
          <div className="font-nanumgothic_regular">🥉 화요일 1개</div>
        </div>
      </div>
    </div>
  )
}
