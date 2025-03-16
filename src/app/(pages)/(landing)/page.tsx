'use client'
import Image from 'next/image'
import LogoImage from '../../../../public/images/logo-image.svg'
import TitleWhiteImage from '../../../../public/images/title-white-image.svg'
import { signIn } from 'next-auth/react'

export default function LandingPage() {
  const handleSignIn = () => {
    signIn('naver').catch((error) => console.log('로그인 실패:', error))
  }
  return (
    <div className="flex h-[120rem] sm:h-[140rem] justify-center">
      {/* 왼쪽 */}
      <div className="flex flex-col items-center justify-center flex-1">
        {/* Title, Logo */}
        <div className="relative w-[33rem] h-[7rem]">
          <Image
            src={TitleWhiteImage}
            alt="TitleWhiteImage"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div className="mt-[5rem] relative size-[27.3rem]">
          <Image
            src={LogoImage}
            alt="LogoImage"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div className="mt-[5rem] flex justify-center items-center w-[30rem] text-navy bg-white h-[7rem] rounded-xl">
          <button
            type="button"
            onClick={handleSignIn}
            className="text-[3.2rem] font-nanumgothic_bold"
          >
            지금 시작하기
          </button>
        </div>
      </div>
      {/* 오른쪽 */}
      <div className="flex flex-col items-center justify-center flex-1">
        {/* 사이트 소개 */}
        <div>
          <div className="mb-[6rem] text-[3.2rem] font-nanumgothic_bold text-right">
            사이트 소개
          </div>
          <div className="mb-[3.1rem] text-[2.3rem] font-nanumgothic_regular">
            네이버 캘린더로 일정을 관리하는 SJ-1220이 본인에 맞춰 제작한
            웹사이트입니다.
          </div>
          <div className="mb-[3.1rem] text-[2.3rem] font-nanumgothic_regular">
            NaviyNote는 메모와 TODO 리스트를 관리하고, 네이버 캘린더와 연동하여
            효율적인 일정 관리를 지원합니다.
          </div>
        </div>
        {/* 주요 기능 소개 */}
        <div>
          <div className="mb-[6rem] text-[3.2rem] font-nanumgothic_bold text-right">
            주요 기능 소개
          </div>
          <div>
            <div className="underline underline-offset-[0.7rem] text-[2.3rem] font-nanumgothic_regular">
              메모 관리
            </div>
            <div className="mb-[3.1rem] text-[2rem]">
              간편한 메모 추가와 삭제로 중요한 정보를 놓지지 않아요
            </div>
          </div>
          <div>
            <div className="underline underline-offset-[0.7rem] text-[2.3rem] font-nanumgothic_regular">
              할일 관리
            </div>
            <div className="mb-[3.1rem] text-[2rem]">
              일정을 관리하고, 언제든지 추가 및 삭제할 수 있어요
            </div>
          </div>
          <div>
            <div className="underline underline-offset-[0.7rem] text-[2.3rem] font-nanumgothic_regular">
              친구 태그
            </div>
            <div className="mb-[3.1rem] text-[2rem]">
              친구와의 일정을 따로 확인할 수 있어요
            </div>
          </div>
          <div>
            <div className="underline underline-offset-[0.7rem] text-[2.3rem] font-nanumgothic_regular">
              통계 확인
            </div>
            <div className="mb-[3.1rem] text-[2rem]">
              가장 바쁜 날을 분석하여 효율적인 일정 계획을 할 수 있어요
            </div>
            <div className="underline underline-offset-[0.7rem] text-[2.3rem] font-nanumgothic_regular">
              네이버 캘린더 연동
            </div>
            <div className="text-[2rem]">
              TODO를 네이버 캘린더에 쉽게 추가하여 일정을 최적화할 수 있어요
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
