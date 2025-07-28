import MainFirstChart from './MainFirstChart'

export default function MainStats() {
  return (
    <div>
      <div className="mt-[4rem] mb-[2rem] justify-items-center p-[1rem] outline-dashed outline-white bg-lightnavy text-navy rounded-lg">
        <div className="text-[1.5rem] mb-[1rem]">
          이번달에 할일이 가장 많은 요일은?
        </div>
        <div className="text-[1rem] mb-[1rem]">
          서비스 준비중입니다. 예시 화면
        </div>
        <MainFirstChart />
      </div>
      <div className="mt-[4rem] mb-[2rem] justify-items-center p-[1rem] outline-dashed outline-white bg-lightnavy text-navy rounded-lg">
        <div className="text-[1.5rem] mb-[1rem]">
          최근 일주일 중 가장 할일이 많았던 날은?
        </div>
        <div className="text-[1rem] mb-[1rem]">
          서비스 준비중입니다. 예시 화면
        </div>
        <div className="text-[1.5rem]">
          <div className="font-extrabold">🥇 수요일 4개</div>
          <div className="font-bold">🥈 토요일 2개</div>
          <div>🥉 화요일 1개</div>
        </div>
      </div>
    </div>
  )
}
