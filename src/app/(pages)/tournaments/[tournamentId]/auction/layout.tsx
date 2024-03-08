'use client'

import React from 'react'
import { AuctionProvider } from '@/providers/AuctionProvider'

function layout({ children }: { children: React.ReactNode }) {
  return <AuctionProvider>{children}</AuctionProvider>
}

export default layout
