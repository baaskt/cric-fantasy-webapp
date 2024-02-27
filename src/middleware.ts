import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { TITLES } from '@/util/constants/constants'

const authRoutes = [TITLES.SIGNIN.path, TITLES.SIGNUP.path]
const protectedRoutes = [
  TITLES.DASHBOARD.path,
  TITLES.TOURNAMENTS.path,
  TITLES.PLAYERS.path,
  TITLES.TEAMS.path,
]
const totalRoutes = [...authRoutes, ...protectedRoutes]

export function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname
  const isValidRoute = totalRoutes.find(route => pathName.includes(route))
  const accessToken = cookies().get('accessToken')?.value
  if (!isValidRoute || (!accessToken && !isAuthRoute(pathName))) {
    console.log(1)
    return redirectRoute(request, TITLES.SIGNIN.path)
  } else if (accessToken && isAuthRoute(pathName)) {
    console.log(2)
    return redirectRoute(request, TITLES.DASHBOARD.fullPath)
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
      source: '/((?!_next/static|_next/image|assets/images|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
