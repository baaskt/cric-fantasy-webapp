import { useAuction } from '@/providers/AuctionProvider'
import React, { useState } from 'react'
import PlayerCard from '../PlayerCard'
import PlayerStats from '../PlayerStats'
import { STATS } from '@/util/constants/constants'
import { OptionsEntity } from '@/model/entities/options.interface'
import CricTab from '../ui/CricTab'
import CricButton from '../ui/CricButton'
import { COLORS } from '@/util/colors'

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
    <div className='m-5 flex justify-center'>
      <div></div>
      <div className='p-5 rounded-lg shadow-lg flex flex-row gap-10 w-fit border-solid border-2 border-pink-600'>
        <div className='flex items-center flex-col justify-between'>
          <PlayerCard playerData={playerEntity}></PlayerCard>
          <div className='mt-5 flex flex-col items-center'>
            <div className='text-2xl'>{playerEntity.basePrice}</div>
            <div className='text-sm'>Base Price</div>
          </div>
          <div className='mt-5 text-base'>{playerEntity.intlTeam}</div>
          <CricButton
            btnTxt='Mark as unsold'
            color={COLORS.lightRed}
            onClick={() => {}}
          ></CricButton>
        </div>
        <div className='pl-5 pr-5'>
          <CricTab optionList={tabOptions} onChange={handleChange} />
          <PlayerStats title={selectedTab.id as string} playerData={playerEntity}></PlayerStats>
        </div>
      </div>
      <div></div>
    </div>
  )
}

export default PlayerBidding
