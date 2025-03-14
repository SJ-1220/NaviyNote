import LogoImage from '../public/images/logo-image.svg'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="h-[8.6rem] sm:h-[11rem] sm:flex-col w-full flex justify-center ">
      <div className="sm:flex-col w-[100rem] flex justify-between items-center sm:w-full">
        <div className="flex sm:flex-col">
          <div className="bg-navy text-white rounded-xl flex justify-center items-center w-[7.9rem] h-[3.4rem]">
            <Link
              className={`font-nanumgothic_regular text-[2rem] `}
              href="https://github.com/SJ-1220/NaviyNote"
              target="_blank"
              passHref
            >
              Github
            </Link>
          </div>
          <div className="sm:hidden text-[2rem] ml-[2rem] font-nanumgothic_regular">
            NaviyNote는 SJ-1220가 만든 캘린더 프로젝트입니다
          </div>
        </div>
        <div className="relative size-[6rem] sm:mt-[1rem]">
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
