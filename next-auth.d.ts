declare module 'next-auth/providers/naver' {
  import { OAuthConfig, OAuthUserConfig } from 'next-auth/providers'

  export interface NaverProfile {
    id: string
    name: string
    email: string
    profile_image: string
  }

  const NaverProvider: <P extends NaverProfile>(
    options: OAuthUserConfig<P>
  ) => OAuthConfig<P>

  export default NaverProvider
}
