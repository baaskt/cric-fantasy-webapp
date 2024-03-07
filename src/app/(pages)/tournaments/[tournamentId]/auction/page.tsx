'use client'

import AuctionPlayersList from '@/components/auction/AuctionPlayersList'
import LastAuctionPlayerCard from '@/components/auction/LastAuctionPlayerCard'
import CricTab from '@/components/ui/CricTab'
import { OptionsEntity } from '@/model/entities/options.interface'
import { AuctionProvider } from '@/providers/AuctionProvider'
import React, { useState } from 'react'

const tabOptions: OptionsEntity[] = [
  { id: 1, label: 'Marquee Players', value: 'Marquee' },
  { id: 2, label: 'Batsman', value: 'Batter' },
  { id: 3, label: 'Bowler', value: 'Bowler' },
  { id: 4, label: 'All Rounder', value: 'All Rounder' },
  { id: 5, label: 'Wicket Keeper', value: 'Wicket Keeper' },
]

function Auction() {
  const [selectedTab, setSelectedTab] = useState<OptionsEntity>(tabOptions[0])

  const handleChange = (selectedEntity: OptionsEntity) => {
    setSelectedTab(selectedEntity)
  }

  return (
    <AuctionProvider>
      <div className='m-5'>
        <div className='flex flex-row justify-between'>
          <CricTab optionList={tabOptions} onChange={handleChange} />
        </div>
        <div className='flex justify-between'>
          <AuctionPlayersList selectedTab={selectedTab} />
          <LastAuctionPlayerCard></LastAuctionPlayerCard>
        </div>
      </div>
    </AuctionProvider>
  )
}

export default Auction
