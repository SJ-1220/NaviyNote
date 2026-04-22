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
      <div className="mb-12 text-ui-mega">4️⃣0️⃣4️⃣</div>
      <div className="text-ui-sm mb-4 text-gray-600">
        😥찾을 수 없는 페이지입니다😥
      </div>
      <div className="text-ui-sm mb-8 text-gray-600">
        요청하신 페이지가 사라졌거나, 잘못된 경로를 이용하셨어요
      </div>
      <Button
        className="text-ui-sm py-2 px-4 bg-secondary text-white rounded-lg"
        type="button"
        onClick={handleHome}
      >
        홈으로 이동
      </Button>
    </div>
  )
}
