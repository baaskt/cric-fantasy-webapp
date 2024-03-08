import { useAuction } from '@/providers/AuctionProvider'
import React, { useState } from 'react'
import PlayerCard from '../PlayerCard'
import PlayerStats from '../PlayerStats'
import { STATS } from '@/util/constants/constants'
import { OptionsEntity } from '@/model/entities/options.interface'
import CricTab from '../ui/CricTab'

const tabOptions: OptionsEntity[] = [
  { id: STATS.ipl, label: 'IPL' },
  { id: STATS.t20, label: 'T20' },
]

function PlayerBidding() {
  const { auctionPlayer } = useAuction()
  const [selectedTab, setSelectedTab] = useState<OptionsEntity>(tabOptions[0])

  if (!auctionPlayer) return <></>

  const handleChange = (selectedEntity: OptionsEntity) => {
    setSelectedTab(selectedEntity)
  }

  const playerEntity = auctionPlayer.data

  return (
    <div className='m-10 flex justify-center'>
      <div></div>
      <div className='p-10 rounded-lg shadow-lg flex flex-row gap-10 w-fit'>
        <div className='flex items-center flex-col justify-between'>
          <PlayerCard playerData={playerEntity}></PlayerCard>
          <div className='mt-5 flex flex-col items-center'>
            <div className='text-2xl'>{playerEntity.basePrice}</div>
            <div className='text-sm'>Base Price</div>
          </div>
          <div className='mt-5 text-base'>{playerEntity.intlTeam}</div>
        </div>
        <div>
          <CricTab optionList={tabOptions} onChange={handleChange} />
          <PlayerStats title={selectedTab.id as string} playerData={playerEntity}></PlayerStats>
        </div>
      </div>
      <div></div>
    </div>
  )
}

export default PlayerBidding
