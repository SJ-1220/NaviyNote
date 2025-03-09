'use client'
import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'

interface SessionWrapperProps {
  session: Session | null
  children: React.ReactNode
}

export default function SessionWrapper({
  session,
  children,
}: SessionWrapperProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>
}
