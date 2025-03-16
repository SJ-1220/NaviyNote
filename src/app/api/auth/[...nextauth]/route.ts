import NextAuth from 'next-auth'
import NaverProvider from 'next-auth/providers/naver'

const handler = NextAuth({
  providers: [
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl + '/main'
    },
  },
})

export { handler as GET, handler as POST }
