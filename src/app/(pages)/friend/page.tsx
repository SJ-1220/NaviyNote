import Image from 'next/image'
import SoonImage from '../../../../public/images/coming-soon-image.png'

export default function FriendPage() {
  return (
    <div className="flex flex-col items-center justify-center h-coming-soon text-gray-800">
      <div className="relative w-[40rem] h-[30rem]">
        <Image
          src={SoonImage}
          alt="ComingSoonImage"
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>
      <div className="text-ui-sm font-bold font-nanumgothic_bold text-gray-600">
        친구 페이지는 개발 중입니다
      </div>
    </div>
  )
}
