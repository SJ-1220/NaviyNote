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
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-0">
      {/* Logo, Title */}
      <div className="flex flex-row items-center">
        <div className="relative size-16 sm:size-24">
          <Image
            src={LogoImage}
            alt="LogoImage"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div className="ml-2 sm:ml-4 relative w-logo-title h-logo-title">
          <Image
            src={TitleImage}
            alt="TitleImage"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
      {/* Nav */}
      <nav className="flex flex-row flex-wrap justify-center gap-1 sm:ml-6 sm:gap-2">
        <div
          className={`flex justify-center items-center px-3 h-nav-item rounded-xl sm:px-4 transition-colors duration-150 ${isMainPage ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'}`}
        >
          <Link className="font-nanumgothic_regular text-ui-sm" href="/main">
            홈
          </Link>
        </div>
        <div
          className={`flex justify-center items-center px-3 h-nav-item rounded-xl sm:px-4 transition-colors duration-150 ${isMemoPage ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'}`}
        >
          <Link className="font-nanumgothic_regular text-ui-sm" href="/memo">
            메모
          </Link>
        </div>
        <div
          className={`flex justify-center items-center px-3 h-nav-item rounded-xl sm:px-4 transition-colors duration-150 ${isToDoPage ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'}`}
        >
          <Link className="font-nanumgothic_regular text-ui-sm" href="/todo">
            ToDo
          </Link>
        </div>
        <div
          className={`sm:hidden flex justify-center items-center px-3 h-nav-item rounded-xl transition-colors duration-150 ${isStatsPage ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'}`}
        >
          <Link className="font-nanumgothic_regular text-ui-sm" href="/stats">
            통계
          </Link>
        </div>
        <div
          className={`sm:hidden flex justify-center items-center px-3 h-nav-item rounded-xl transition-colors duration-150 ${isFriendPage ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'}`}
        >
          <Link className="font-nanumgothic_regular text-ui-sm" href="/friend">
            친구
          </Link>
        </div>
      </nav>
    </div>
  )
}
