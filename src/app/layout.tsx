import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import type { Metadata, Viewport } from 'next'
import { Outfit, DM_Sans } from 'next/font/google'
import '@/styles/globals.scss'
import AppProvider from '@/providers/AppProvider'
import { APP_NAME } from './util/constants/constants'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-body' })

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
      <body className={`${outfit.variable} ${dmSans.variable} ${dmSans.className}`}>
        <AppProvider>{children}</AppProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
