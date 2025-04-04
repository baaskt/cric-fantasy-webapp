import { TeamEntity } from '@/model/response/team.interface'
import { currencyToString } from '@/util/bidding'
import { convertDriveUrl } from '@/util/helper'
import React from 'react'

type BiddingTeamCardProps = {
  teamData: TeamEntity
  isHighestBidder: boolean
  isSecondHighestBidder: boolean
  onBidding: (teamData: TeamEntity) => void
}

function BiddingTeamCard(props: BiddingTeamCardProps) {
  const { teamName, purseBalance, imgUrl, squadCount } = props.teamData
  const ALTERNATE_IMAGE_SRC = '/assets/images/default_img.jpg'
  const teamUrl = convertDriveUrl(imgUrl)
  return (
    <div
      className={`${'flex flex-col items-center cursor-pointer shadow-lg rounded-lg p-0 border-t-4 border-b-4'} ${props.isHighestBidder ? 'border-t-indigo-600' : ''} ${props.isSecondHighestBidder ? 'border-b-indigo-300' : ''}`}
      onClick={() => props.onBidding(props.teamData)}
    >
      <div className='flex flex-col items-center justify-between h-full'>
        <img
          src={teamUrl || ALTERNATE_IMAGE_SRC}
          alt='team img'
          width='0'
          height='0'
          sizes='100vw'
          className='w-[180px] h-auto'
        />
        <div className='flex flex-col items-center p-1'>
          <div>{teamName}</div>
          <div>Balance: {currencyToString(purseBalance)}</div>
          <div>Squad Count: {squadCount} / 12</div>
          {/* <div>Balance: {purseBalance}</div>
          <div>( {currencyToString(purseBalance)} )</div> */}
        </div>
      </div>
    </div>
  )
}

export default BiddingTeamCard
