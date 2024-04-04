'use client'

import { MatchProvider } from '@/providers/MatchProvider'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <MatchProvider>{children}</MatchProvider>
}
