'use client'

import AuctionPlayersList from '@/components/auction/AuctionPlayersList'
import LastAuctionPlayerCard from '@/components/auction/LastAuctionPlayerCard'
import CricTab from '@/components/ui/CricTab'
import { OptionsEntity } from '@/model/entities/options.interface'
import React, { useState } from 'react'

const tabOptions: OptionsEntity[] = [
  { id: 1, label: 'Marquee Players', value: 'marquee' },
  { id: 2, label: 'Batsman', value: 'batter' },
  { id: 3, label: 'Bowler', value: 'bowler' },
  { id: 4, label: 'All Rounder', value: 'all-rounder' },
  { id: 5, label: 'Wicket Keeper', value: 'wicket-keeper' },
]

function Auction() {
  const [selectedTab, setSelectedTab] = useState<OptionsEntity>(tabOptions[0])

  const handleChange = (selectedEntity: OptionsEntity) => {
    setSelectedTab(selectedEntity)
  }

  return (
    <div className='m-5'>
      <div className='flex flex-row justify-between'>
        <CricTab optionList={tabOptions} onChange={handleChange} />
      </div>
      <div className='flex justify-between'>
        <AuctionPlayersList selectedTab={selectedTab} categories={tabOptions} />
        <LastAuctionPlayerCard></LastAuctionPlayerCard>
      </div>
    </div>
  )
}

export default Auction
