'use client'
import { useSession } from 'next-auth/react'
export default function CheckAccess() {
  const { data: session } = useSession()
  console.log('CheckAccess session accessToken:', session?.accessToken)
  return <div>accessToken:{session?.accessToken}</div>
}
