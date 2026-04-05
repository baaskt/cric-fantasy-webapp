'use client'

import React from 'react'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import { AuthProvider } from './AuthProvider'
import { ThemeProvider } from '@mui/material'
import { globalTheme } from '@/styles/themes/global'
import { MatchProvider } from './MatchProvider'
import { TeamProvider } from '@/providers/TeamProvider'
import { TournamentProvider } from '@/providers/TournamentProvider'
export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={globalTheme}>
        <TournamentProvider>
          <TeamProvider>
            <MatchProvider>
              <AuthProvider>{children}</AuthProvider>
            </MatchProvider>
          </TeamProvider>
        </TournamentProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}
