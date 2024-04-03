'use client'

import { TeamProvider } from '@/providers/TeamProvider'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TeamProvider>{children}</TeamProvider>
}
