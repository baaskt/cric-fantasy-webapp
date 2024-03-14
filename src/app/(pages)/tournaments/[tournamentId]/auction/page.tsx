'use client'

import AuctionPlayersList from '@/components/auction/AuctionPlayersList'
import LastAuctionPlayerCard from '@/components/auction/LastAuctionPlayerCard'
import CricTab from '@/components/ui/CricTab'
import { OptionsEntity } from '@/model/entities/options.interface'
import { useAuction } from '@/providers/AuctionProvider'
import React, { useEffect, useState } from 'react'

const tabOptions: OptionsEntity[] = [
  { id: 1, label: 'Marquee', value: 'MARQUEE' },
  { id: 2, label: 'Star A', value: 'STAR-A' },
  { id: 3, label: 'Star B', value: 'STAR-B' },
  { id: 4, label: 'Capped A', value: 'CAPPED-A' },
  { id: 5, label: 'Capped B', value: 'CAPPED-B' },
  { id: 6, label: 'Uncapped A', value: 'UNCAPPED-A' },
  { id: 7, label: 'Uncapped B', value: 'UNCAPPED-B' },
  { id: 8, label: 'Youngsters', value: 'YOUNGSTERS' },
]

function Auction() {
  const [selectedTab, setSelectedTab] = useState<OptionsEntity>(tabOptions[0])
  const { updateBiddingList } = useAuction()

  useEffect(() => {
    updateBiddingList()
  }, [])

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
        <LastAuctionPlayerCard categories={tabOptions}></LastAuctionPlayerCard>
      </div>
    </div>
  )
}

export default Auction
