'use client'

import Button from '@/components/Button'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="h-not-found flex flex-col items-center justify-center text-center text-gray-800">
      <div className="mb-8 text-ui-mega">⚠️</div>
      <div className="text-ui-md font-nanumgothic_bold mb-2 text-primary">
        문제가 발생했습니다.
      </div>
      <div className="text-ui-sm font-nanumgothic_regular mb-2 text-gray-500">
        Something went wrong
      </div>
      <div className="text-ui-caption mb-10 text-gray-500">
        예기치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
      </div>
      <div className="flex gap-4">
        <Button
          className="text-ui-sm py-3 px-10 bg-secondary text-white rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all"
          type="button"
          onClick={reset}
        >
          다시 시도
        </Button>
        <Button
          className="text-ui-sm py-3 px-10 border border-secondary text-secondary rounded-full hover:bg-secondary/10 transition-all"
          type="button"
          onClick={() => router.push('/')}
        >
          홈으로 가기
        </Button>
      </div>
    </div>
  )
}
