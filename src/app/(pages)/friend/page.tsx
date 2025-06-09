import SoonImage from '../../../../public/images/coming-soon-image.png'
import Image from 'next/image'

export default function FriendPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[50rem]">
      <div className="relative w-[40rem] h-[30rem]">
        <Image
          src={SoonImage}
          alt="ComingSoonImage"
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>
      <div className="text-[1.5rem] font-bold">친구 페이지는 개발 중입니다</div>
    </div>
  )
}
