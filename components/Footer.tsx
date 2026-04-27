import Image from 'next/image'
import Link from 'next/link'
import LogoImage from '../public/images/logo-image.svg'

export default function Footer() {
  return (
    <footer className="w-full flex flex-col items-center justify-center px-4 py-6 bg-white border-t border-gray-200 overflow-x-hidden sm:flex-row sm:h-header sm:px-8 sm:py-0">
      <div className="w-full flex flex-col items-center gap-3 sm:flex-row sm:w-content sm:justify-between sm:gap-0">
        {/* Left group: on sm+ shows [Github] [Description] in a row */}
        <div className="w-full flex flex-col items-center gap-3 sm:flex-row sm:w-auto sm:gap-0">
          {/* Mobile order-2: Github + Logo side by side; sm+ order-1: Github only */}
          <div className="order-2 sm:order-1 flex flex-row items-center justify-center gap-4 sm:gap-0">
            <div className="bg-primary text-white rounded-xl flex justify-center items-center px-4 h-nav-item">
              <Link
                className="font-nanumgothic_regular text-ui-sm"
                href="https://github.com/SJ-1220/NaviyNote"
                target="_blank"
                passHref
              >
                Github
              </Link>
            </div>
            {/* Logo shown only on mobile, paired with Github button */}
            <div className="sm:hidden relative size-16">
              <Image
                src={LogoImage}
                alt="LogoImage"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* Mobile order-1 (above Github+Logo); sm+ order-2 (after Github) */}
          <div className="order-1 sm:order-2 text-center text-ui-sm sm:text-ui-caption sm:ml-8 font-nanumgothic_regular text-gray-600">
            NaviyNote는 SJ-1220가 만든 캘린더 프로젝트입니다
          </div>
        </div>

        {/* Logo: desktop only, far right */}
        <div className="hidden sm:block relative sm:size-24">
          <Image
            src={LogoImage}
            alt="LogoImage"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
    </footer>
  )
}
