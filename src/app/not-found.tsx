'use client'
import Button from '@/components/Button'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function NotFound() {
  const router = useRouter()
  const handleHome = () => {
    router.push('/')
  }
  return (
    <div className="h-not-found flex flex-col items-center justify-center text-center text-gray-800">
      <div className="mb-8 text-ui-mega">4️⃣0️⃣4️⃣</div>
      <div className="text-ui-sm font-nanumgothic_bold mb-2 text-primary">
        페이지를 찾을 수 없습니다
      </div>
      <div className="text-ui-caption mb-10 text-gray-500">
        요청하신 페이지가 사라졌거나, 잘못된 경로를 이용하셨어요
      </div>
      <Button
        className="text-ui-sm py-3 px-10 bg-secondary text-white rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all"
        type="button"
        onClick={handleHome}
      >
        홈으로 이동
      </Button>
    </div>
  )
}
