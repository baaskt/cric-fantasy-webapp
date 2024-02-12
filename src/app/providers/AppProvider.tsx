'use client'

import React from 'react'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import { AuthProvider } from './AuthProvider'
import { ThemeProvider } from '@mui/material'
import { globalTheme } from '@/styles/themes/global'

export default function AppProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={globalTheme}>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}
