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
    <div className="h-[40rem] flex flex-col items-center justify-center text-center">
      <div className="mb-[3rem] text-[10rem]">4️⃣0️⃣4️⃣</div>
      <div className="text-[1.5rem] mb-[1rem]">
        😥찾을 수 없는 페이지입니다😥
      </div>
      <div className="text-[1.5rem] mb-[2rem]">
        요청하신 페이지가 사라졌거나, 잘못된 경로를 이용하셨어요
      </div>
      <Button
        className="text-[1.5rem] p-[0.5rem] bg-navy2 rounded-lg"
        type="button"
        onClick={handleHome}
      >
        홈으로 이동
      </Button>
    </div>
  )
}
