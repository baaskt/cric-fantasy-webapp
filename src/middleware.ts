import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const authRoutes = ['/login', '/signup']
const protectedRoutes = ['/tournaments', '/dashboard']

export function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname
  const totalRoutes = [...authRoutes, ...protectedRoutes].find(route =>
    pathName.includes(route),
  )
  const accessToken = cookies().get('accessToken')?.value
  if (!totalRoutes || (!accessToken && !isAuthRoute(pathName))) {
    return redirectRoute(request, authRoutes[0])
  }
}

const isAuthRoute = (pathName: string): boolean => {
  return authRoutes.includes(pathName)
}

const redirectRoute = (request: NextRequest, pathName: string) => {
  const url = request.nextUrl.clone()
  url.pathname = pathName
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
