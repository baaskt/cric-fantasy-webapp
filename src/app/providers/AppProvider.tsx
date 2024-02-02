'use client'

import React from 'react'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import { AuthProvider } from './AuthProvider'

export default function AppProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppRouterCacheProvider>
      <AuthProvider>{children}</AuthProvider>
    </AppRouterCacheProvider>
  )
}
