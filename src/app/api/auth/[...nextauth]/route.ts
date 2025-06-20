import NextAuth from 'next-auth'
import NaverProvider from 'next-auth/providers/naver'

const handler = NextAuth({
  providers: [
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
      authorization: {
        url: 'https://nid.naver.com/oauth2.0/authorize',
        params: {
          response_type: 'code',
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl + '/main'
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      if (token && token.accessToken) {
        session.accessToken = token.accessToken as string
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
