import { useCallback, useEffect } from 'react'

export function useScrollLock() {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return useCallback(() => {
    document.body.style.overflow = ''
  }, [])
}
