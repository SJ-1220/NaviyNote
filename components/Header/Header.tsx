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
      <div className="sm:mt-4 sm:flex-col flex items-center">
        <div className="relative size-24">
          <Image
            src={LogoImage}
            alt="LogoImage"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div className="sm:mt-4 ml-4 relative w-logo-title h-logo-title sm:ml-0">
          <Image
            src={TitleImage}
            alt="TitleImage"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
      {/* Nav */}
      <nav className="sm:mt-4 sm:flex-col ml-14 flex items-center gap-2 sm:ml-0 sm:gap-0">
        <div
          className={`flex justify-center items-center px-4 h-nav-item rounded-xl ${isMainPage ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'}`}
        >
          <Link className="font-nanumgothic_regular text-ui-md" href="/main">
            홈
          </Link>
        </div>
        <div
          className={`flex justify-center items-center px-4 h-nav-item rounded-xl ${isMemoPage ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'}`}
        >
          <Link className="font-nanumgothic_regular text-ui-md" href="/memo">
            메모
          </Link>
        </div>
        <div
          className={`flex justify-center items-center px-4 h-nav-item rounded-xl ${isToDoPage ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'}`}
        >
          <Link className="font-nanumgothic_regular text-ui-md" href="/todo">
            ToDo
          </Link>
        </div>
        <div
          className={`flex justify-center items-center px-4 h-nav-item rounded-xl ${isStatsPage ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'}`}
        >
          <Link className="font-nanumgothic_regular text-ui-md" href="/stats">
            통계
          </Link>
        </div>
        <div
          className={`flex justify-center items-center px-4 h-nav-item rounded-xl ${isFriendPage ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'}`}
        >
          <Link className="font-nanumgothic_regular text-ui-md" href="/friend">
            친구
          </Link>
        </div>
      </nav>
    </div>
  )
}
