'use client'

import AuctionPlayersList from '@/components/auction/AuctionPlayersList'
import LastAuctionPlayerCard from '@/components/auction/LastAuctionPlayerCard'
import CricTab from '@/components/ui/CricTab'
import { OptionsEntity } from '@/model/entities/options.interface'
import { useAuction } from '@/providers/AuctionProvider'
import { useTournament } from '@/providers/TournamentProvider'
import React, { useEffect, useState } from 'react'

function Auction() {
  const { activeCategory, updateBiddingList } = useAuction()
  const { activeTournament } = useTournament()
  const [selectedTab, setSelectedTab] = useState<OptionsEntity>()
  const [playerReset, setPlayerReset] = useState<boolean>(false)
  const [playerCategories, setPlayerCategories] = useState<OptionsEntity[]>([])

  useEffect(() => {
    updateBiddingList()
  }, [])

  useEffect(() => {
    if (activeCategory) {
      setPlayerReset(false)
      setSelectedTab(activeCategory)
    }
  }, [activeCategory])

  useEffect(() => {
    if (!activeTournament?.basePrice) return

    const categoryList = Object.entries(activeTournament.basePrice)
      .sort(([, priceA], [, priceB]) => priceB - priceA)
      .map(([category], index) => ({
        id: index + 1,
        label: category,
        value: category,
      }))
    
      setPlayerCategories(categoryList)
      if (!activeCategory) {
        setSelectedTab(categoryList[0])
      }
  }, [activeTournament])

  const handleChange = (selectedEntity: OptionsEntity) => {
    setSelectedTab(selectedEntity)
  }

  if (!selectedTab) return <></>

  return (
    <div className='m-0 md:m-5'>
      <div className='flex justify-between flex-col-reverse md:flex-row gap-5 md:gap-0'>
        <div>
          <CricTab
            optionList={playerCategories}
            selectedTab={selectedTab}
            onChange={handleChange}
          />
          <div>
            <AuctionPlayersList
              selectedTab={selectedTab}
              categories={playerCategories}
              onPlayerReset={() => setPlayerReset(true)}
            />
          </div>
        </div>
        <div className='flex items-start'>
          <LastAuctionPlayerCard
            categories={playerCategories}
            playerReset={playerReset}
          ></LastAuctionPlayerCard>
        </div>
      </div>
    </div>
  )
}

export default Auction
