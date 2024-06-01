import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import type { Metadata, Viewport } from 'next'
import { Lexend } from 'next/font/google'
import '@/styles/globals.scss'
import AppProvider from '@/providers/AppProvider'
import { APP_NAME } from './util/constants/constants'

const lexend = Lexend({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: APP_NAME,
  description: 'Cricket Fantasy Auction',
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={`${lexend.className}`}>
        <AppProvider>{children}</AppProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
