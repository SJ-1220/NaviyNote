import type { Metadata } from 'next'
import './globals.css'
import { getServerSession } from 'next-auth'
import SessionWrapper from '../api/auth/[...nextauth]/SessionWrapper'
import Footer from '@/components/Footer'
import localFont from 'next/font/local'
import { HeaderWrapper } from '@/components/Header/HeaderClients'

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
      className={`${NanumGothicRegular.variable} ${NanumGothicBold.variable} ${NanumGothicExtraBold.variable}`}
    >
      <body>
        <SessionWrapper session={session}>
          <HeaderWrapper />
        </SessionWrapper>
        <SessionWrapper session={session}>
          <div className="flex justify-center bg-navy text-white">
            {/* 테스트용 */}
            {/* <div className="bg-slate-300 w-[100rem]">{children}</div> */}
            {/* 확인용 */}
            <div className="w-[100rem]">{children}</div>
          </div>
        </SessionWrapper>
        <Footer />
      </body>
    </html>
  )
}
