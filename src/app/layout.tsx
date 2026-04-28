import Footer from '@/components/Footer'
import { HeaderWrapper } from '@/components/Header/HeaderClients'
import GoogleAnalytics from '@/lib/GoogleAnalytics'
import { Toaster } from 'sonner'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import localFont from 'next/font/local'
import SessionWrapper from './api/auth/[...nextauth]/SessionWrapper'
import './globals.css'

const NanumGothicRegular = localFont({
  src: '../../public/fonts/NanumGothic-Regular.ttf',
  variable: '--font-nanumgothic-regular',
  weight: '400',
})

const NanumGothicBold = localFont({
  src: '../../public/fonts/NanumGothic-Bold.ttf',
  variable: '--font-nanumgothic-bold',
  weight: '700',
})
const NanumGothicExtraBold = localFont({
  src: '../../public/fonts/NanumGothic-ExtraBold.ttf',
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
      lang="ko"
      className={`${NanumGothicRegular.variable} ${NanumGothicBold.variable} ${NanumGothicExtraBold.variable}`}
    >
      <body>
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        ) : (
          <></>
        )}
        <SessionWrapper session={session}>
          <HeaderWrapper />
        </SessionWrapper>
        <SessionWrapper session={session}>
          <div className="flex justify-center bg-gray-50 overflow-x-hidden">
            <div className="w-full max-w-content px-4 sm:px-8">{children}</div>
          </div>
        </SessionWrapper>
        <Footer />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
