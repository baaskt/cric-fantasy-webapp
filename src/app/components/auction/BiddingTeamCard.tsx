import { TeamEntity } from '@/model/response/team.interface'
import { currencyToString } from '@/util/bidding'
import { COLORS } from '@/util/colors'
import React from 'react'

type BiddingTeamCardProps = {
  teamData: TeamEntity
  onBidding: (teamData: TeamEntity) => void
}

function BiddingTeamCard(props: BiddingTeamCardProps) {
  const { teamName, purseBalance } = props.teamData
  return (
    <div
      className='flex flex-col items-center cursor-pointer shadow-lg rounded-lg p-0'
      onClick={() => props.onBidding(props.teamData)}
    >
      <div className='flex flex-col items-center'>
        <div
          className='w-24 h-24 rounded-full flex justify-center items-center text-2xl transform transition-transform hover:scale-110'
          style={{ backgroundColor: COLORS.gray }}
        >
          {teamName[0]}
        </div>
        <div className='flex flex-col items-center p-1'>
          <div>{teamName}</div>
          <div>Balance: {purseBalance}</div>
          <div>( {currencyToString(purseBalance)} )</div>
        </div>
      </div>
    </div>
  )
}

export default BiddingTeamCard
