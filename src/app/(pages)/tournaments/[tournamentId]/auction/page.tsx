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
  { id: 9, label: 'Unsold', value: 'UNSOLD' },
]

function Auction() {
  const { activeCategory, updateBiddingList } = useAuction()
  const [selectedTab, setSelectedTab] = useState<OptionsEntity>(
    activeCategory ? activeCategory : tabOptions[0],
  )

  useEffect(() => {
    updateBiddingList()
  }, [])

  useEffect(() => {
    if (activeCategory) {
      setSelectedTab(activeCategory)
    }
  }, [activeCategory])

  const handleChange = (selectedEntity: OptionsEntity) => {
    setSelectedTab(selectedEntity)
  }

  return (
    <div className='m-5'>
      <div className='flex justify-between flex-col-reverse md:flex-row gap-5 md:gap-0'>
        <div>
          <CricTab optionList={tabOptions} selectedTab={selectedTab} onChange={handleChange} />
          <div>
            <AuctionPlayersList selectedTab={selectedTab} categories={tabOptions} />
          </div>
        </div>
        <div className='flex'>
          <LastAuctionPlayerCard categories={tabOptions}></LastAuctionPlayerCard>
        </div>
      </div>
    </div>
  )
}

export default Auction
