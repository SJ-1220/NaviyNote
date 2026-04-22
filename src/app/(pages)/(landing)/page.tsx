'use client'
import Image from 'next/image'
import React from 'react'
import LogoImage from '../../../../public/images/logo-image.svg'
import TitleWhiteImage from '../../../../public/images/title-white-image.svg'
import { signIn } from 'next-auth/react'

const features = [
  {
    icon: '📝',
    title: '메모 관리',
    description:
      '활성/비활성 · 중요도 기준으로 4개 구역에 자동 분류됩니다. 드래그 앤 드롭으로 구역을 손쉽게 변경하고, 클릭 한 번으로 수정 · 삭제하세요.',
  },
  {
    icon: '✅',
    title: '할일 관리',
    description:
      '캘린더로 날짜를 설정하고 오늘 · 예정 · 지난 할일을 한눈에 확인하세요. 날짜 없는 Todo를 캘린더에 드래그하면 날짜가 자동으로 등록됩니다.',
  },
  {
    icon: '🔗',
    title: '메모 – Todo 1:1 연결',
    description:
      '메모와 할일을 서로 연결해 업무 배경을 잃지 마세요. 각 메모는 하나의 할일과 연결되어 작업 컨텍스트를 언제든지 확인할 수 있습니다.',
  },
  {
    icon: '📅',
    title: '네이버 캘린더 연동',
    description:
      'Todo를 네이버 캘린더에 바로 추가해 모든 일정을 한 공간에서 관리하세요. 로그인 시 캘린더 권한을 허용하면 즉시 연동됩니다.',
  },
]

const steps = [
  {
    number: '1',
    title: '네이버 로그인',
    description: '네이버 계정으로 간편하게 시작하세요.',
  },
  {
    number: '2',
    title: '메모 · Todo 추가',
    description: '자유롭게 메모를 작성하고 할일을 등록하세요.',
  },
  {
    number: '3',
    title: '연결 & 관리',
    description: '메모와 Todo를 연결하고 스마트하게 관리하세요.',
  },
]

function SignInButton({ className }: { className?: string }) {
  const handleSignIn = () => {
    signIn('naver').catch((error) => console.log('로그인 실패:', error))
  }
  return (
    <button
      type="button"
      onClick={handleSignIn}
      className={`bg-white text-primary font-nanumgothic_bold text-ui-md px-12 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all ${className ?? ''}`}
    >
      네이버로 로그인하기
    </button>
  )
}

export default function LandingPage() {
  return (
    <div className="font-nanumgothic_regular">
      {/* ── Hero ── */}
      <section className="bg-primary text-white">
        <div className="py-24 px-16 sm:py-16 sm:px-8 flex flex-col items-center text-center">
          {/* Brand mark */}
          <div className="flex items-center gap-6 mb-16 sm:flex-col sm:gap-4 sm:mb-8">
            <div className="relative size-32">
              <Image
                src={LogoImage}
                alt="NaviyNote 로고"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div className="relative w-96 h-20">
              <Image
                src={TitleWhiteImage}
                alt="NaviyNote"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* Tagline */}
          <h1 className="text-ui-xl font-nanumgothic_extrabold mb-6 leading-tight">
            {'메모와 할일을, '}
            <span className="text-surface">스마트하게</span>
            {' 관리하세요'}
          </h1>
          <p className="text-ui-md mb-4 max-w-4xl" style={{ opacity: 0.9 }}>
            메모와 Todo를 1:1로 연결해 생각의 맥락을 잃지 않는 일정 관리
          </p>
          <p className="text-ui-sm mb-12" style={{ opacity: 0.6 }}>
            네이버 캘린더와 연동하여 모든 일정을 통합 관리하세요
          </p>

          <SignInButton />

          <p className="mt-8 text-base" style={{ opacity: 0.5 }}>
            ⚠️ 로그인 시{' '}
            <span className="font-nanumgothic_bold" style={{ opacity: 1 }}>
              캘린더 일정담기 권한
            </span>
            을 허용해 주세요
          </p>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="p-16 sm:px-8 bg-white">
        <h2 className="text-ui-md font-nanumgothic_bold text-primary text-center mb-12">
          NaviyNote 주요 기능
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-1 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-secondary transition-all"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-ui-sm font-nanumgothic_bold text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-base text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="p-16 sm:px-8 bg-gray-50">
        <h2 className="text-ui-md font-nanumgothic_bold text-primary text-center mb-12">
          이렇게 사용하세요
        </h2>
        <div className="flex justify-center items-start sm:flex-col sm:items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="text-center flex-1 px-4 sm:px-0 sm:mb-8">
                <div className="size-16 bg-secondary text-white rounded-full flex items-center justify-center text-ui-md font-nanumgothic_bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-ui-sm font-nanumgothic_bold text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-base text-gray-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="text-secondary text-ui-xl self-center shrink-0 sm:hidden">
                  →
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-20 px-16 sm:px-8 bg-primary text-white text-center">
        <h2 className="text-ui-lg font-nanumgothic_bold mb-4">
          지금 바로 시작해 보세요
        </h2>
        <p className="text-ui-sm mb-12" style={{ opacity: 0.7 }}>
          NaviyNote는 무료로 사용할 수 있습니다
        </p>
        <SignInButton />
      </section>
    </div>
  )
}
