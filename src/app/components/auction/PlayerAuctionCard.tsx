import React, { useState } from 'react'
import PlayerCard from '../PlayerCard'
import CricButton from '../ui/CricButton'
import { COLORS } from '@/util/colors'
import CricTab from '../ui/CricTab'
import PlayerStats from '../PlayerStats'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import { OptionsEntity } from '@/model/entities/options.interface'
import { STATS } from '@/util/constants/constants'
import { useAuction } from '@/providers/AuctionProvider'

const tabOptions: OptionsEntity[] = [
  { id: STATS.ipl, label: 'IPL' },
  { id: STATS.t20, label: 'T20' },
]

function PlayerAuctionCard() {
  const { auctionPlayer, highestBidder } = useAuction()
  const [selectedTab, setSelectedTab] = useState<OptionsEntity>(tabOptions[0])

  if (!auctionPlayer) return <></>
  const playerEntity = auctionPlayer.player

  const handleChange = (selectedEntity: OptionsEntity) => {
    setSelectedTab(selectedEntity)
  }

  return (
    <>
      <div className='flex items-center flex-col justify-between'>
        <PlayerCard playerData={playerEntity}></PlayerCard>
        <div className='mt-5 flex flex-col items-center'>
          <div className='text-2xl'>{playerEntity.basePrice}</div>
          <div className='text-sm'>Base Price</div>
        </div>
        <div className='mt-5 text-base'>{playerEntity.intlTeam}</div>
        {!highestBidder?.amount && (
          <CricButton
            btnTxt='Mark as unsold'
            startIcon={<NotInterestedIcon />}
            bgColor={COLORS.lightRed}
            onClick={() => {}}
          ></CricButton>
        )}
      </div>
      <div className='pl-5 pr-5'>
        <CricTab optionList={tabOptions} onChange={handleChange} />
        <PlayerStats title={selectedTab.id as string} playerData={playerEntity}></PlayerStats>
      </div>
    </>
  )
}

export default PlayerAuctionCard
