import Image from 'next/image'
import SoonImage from '../../../../public/images/coming-soon-image.png'

export default function StatsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-coming-soon text-gray-800">
      <div className="relative w-[95%] h-[20rem] sm:w-[40rem] sm:h-[30rem] mx-auto">
        <Image
          src={SoonImage}
          alt="ComingSoonImage"
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>
      <div className="text-ui-sm font-bold font-nanumgothic_bold text-gray-600">
        통계 페이지는 개발 중입니다
      </div>
    </div>
  )
}
