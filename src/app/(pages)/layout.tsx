import type { Metadata } from 'next'
import './globals.css'
import { getServerSession } from 'next-auth'
import SessionWrapper from '../api/auth/[...nextauth]/SessionWrapper'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import localFont from 'next/font/local'

const NanumGothicRegular = localFont({
  src: '../../../public/fonts/NanumGothic-Regular.ttf',
  variable: '--font-nanumgothic-regular',
  weight: '400',
})

const NanumGothicBold = localFont({
  src: '../../../public/fonts/NanumGothic-Bold.ttf',
  variable: '--font-nanumgothic-bold',
  weight: '700',
})
const NanumGothicExtraBold = localFont({
  src: '../../../public/fonts/NanumGothic-ExtraBold.ttf',
  variable: '--font-nanumgothic-extrabold',
  weight: '800',
})

export const metadata: Metadata = {
  title: 'NaviyNote',
  description: 'NaviyNote by SJ-1220',
}
interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession()
  return (
    <html
      lang="kr"
      className={` ${NanumGothicRegular.variable} ${NanumGothicBold.variable} ${NanumGothicExtraBold.variable}`}
    >
      <body>
        <Header />
        <SessionWrapper session={session}>{children}</SessionWrapper>
        <Footer />
      </body>
    </html>
  )
}
