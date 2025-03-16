import Image from 'next/image'
import Link from 'next/link'
import LogoImage from '../../public/images/logo-image.svg'
import TitleImage from '../../public/images/title-image.svg'

interface HeaderProps {
  isMainPage: boolean
  isMemoPage: boolean
  isToDoPage: boolean
  isStatsPage: boolean
  isFriendPage: boolean
}

//Logo, Title, 홈/메모/ToDo/통계/친구
export default function Header({
  isMainPage,
  isMemoPage,
  isToDoPage,
  isStatsPage,
  isFriendPage,
}: HeaderProps) {
  return (
    <div className="sm:flex-col flex items-center">
      {/* Logo, Title */}
      <div className="sm:mt-[1rem] sm:flex-col flex items-center">
        <div className="relative size-[6rem]">
          <Image
            src={LogoImage}
            alt="LogoImage"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div className="sm:mt-[1rem] ml-[1rem] relative w-[14.4rem] h-[3.2rem] sm:ml-0">
          <Image
            src={TitleImage}
            alt="TitleImage"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
      {/* 홈/메모/ToDo/통계/친구 */}
      <div className="sm:mt-[1rem] sm:flex-col ml-[3.5rem] flex items-center sm:ml-0">
        <div
          className={`sm:flex-col flex justify-center items-center w-[3.3rem] h-[3.4rem]  ${isMainPage ? 'bg-navy text-white rounded-xl' : 'bg-white text-black'}`}
        >
          <Link
            className={`font-nanumgothic_regular text-[2rem] `}
            href="/main"
          >
            홈
          </Link>
        </div>
        <div
          className={`sm:flex-col flex justify-center items-center ml-[1rem] w-[5.2rem] h-[3.4rem]   sm:ml-0 ${isMemoPage ? 'bg-navy text-white rounded-xl' : 'bg-white text-black'}`}
        >
          <Link
            className={`font-nanumgothic_regular text-[2rem] `}
            href="/memo"
          >
            메모
          </Link>
        </div>
        <div
          className={`sm:ml-0 sm:flex-col flex ml-[1rem] justify-center items-center w-[6.4rem] h-[3.4rem]  ${isToDoPage ? 'bg-navy text-white rounded-xl' : 'bg-white text-black'}`}
        >
          <Link
            className={`font-nanumgothic_regular text-[2rem] `}
            href="/todo"
          >
            ToDo
          </Link>
        </div>
        <div
          className={`sm:ml-0 sm:flex-col flex ml-[1rem] justify-center items-center w-[5.2rem] h-[3.4rem]  ${isStatsPage ? 'bg-navy text-white rounded-xl' : 'bg-white text-black'}`}
        >
          <Link
            className={`font-nanumgothic_regular text-[2rem] `}
            href="/stats"
          >
            통계
          </Link>
        </div>
        <div
          className={`sm:ml-0 sm:flex-col flex ml-[1rem] justify-center items-center w-[5.2rem] h-[3.4rem]  ${isFriendPage ? 'bg-navy text-white rounded-xl' : 'bg-white text-black'}`}
        >
          <Link
            className={`font-nanumgothic_regular text-[2rem] `}
            href="/friend"
          >
            친구
          </Link>
        </div>
      </div>
    </div>
  )
}
