import LogoImage from '../public/images/logo-image.svg'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="h-header sm:h-44 sm:flex-col w-full flex justify-center bg-white border-t border-gray-200">
      <div className="sm:flex-col w-content flex justify-between items-center sm:w-full">
        <div className="flex sm:flex-col items-center">
          <div className="bg-primary text-white rounded-xl flex justify-center items-center px-4 h-nav-item">
            <Link
              className="font-nanumgothic_regular text-ui-md"
              href="https://github.com/SJ-1220/NaviyNote"
              target="_blank"
              passHref
            >
              Github
            </Link>
          </div>
          <div className="sm:hidden text-ui-md ml-8 font-nanumgothic_regular text-gray-600">
            NaviyNote는 SJ-1220가 만든 캘린더 프로젝트입니다
          </div>
        </div>
        <div className="relative size-24 sm:mt-4">
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
