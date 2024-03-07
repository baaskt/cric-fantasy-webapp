import { setCookie, getCookie, deleteCookie } from 'cookies-next'

export const cookieHelper = () => {
  function setCookieItem(key: string, value: string): void {
    setCookie(key, value, {
      maxAge: 60 * 60 * 24 * 90, // Cookie will expire in 90 days
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      httpOnly: false, // Ensures cookie is accessible only via HTTP requests
      sameSite: 'strict', // Protects against CSRF attacks
    })
  }

  function getCookieItem(key: string): string | null {
    const value = getCookie(key)
    return value ? value : null
  }

  function removeCookieItem(key: string) {
    deleteCookie(key)
  }

  return { setCookieItem, getCookieItem, removeCookieItem }
}
