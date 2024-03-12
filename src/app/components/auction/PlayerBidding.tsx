import React from 'react'
import SecondHighestBidder from './SecondHighestBidder'
import HighestBidder from './HighestBidder'
import PlayerAuctionCard from './PlayerAuctionCard'

function PlayerBidding() {
  return (
    <div className='m-5 flex justify-evenly'>
      <div className='flex items-center'>
        <SecondHighestBidder />
      </div>
      <div className='p-5 rounded-lg shadow-lg flex flex-row gap-10 w-fit border-solid border-2 border-pink-600'>
        <PlayerAuctionCard />
      </div>
      <div className='flex items-center'>
        <HighestBidder />
      </div>
    </div>
  )
}

export default PlayerBidding
