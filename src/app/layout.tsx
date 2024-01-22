import type { Metadata } from 'next'
import { Lexend } from 'next/font/google'
import '@/styles/globals.scss'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'

const lexend = Lexend({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CriKCC Fantasy',
  description: 'Cricket Fantasy Auction',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={lexend.className}>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
    </html>
  )
}
