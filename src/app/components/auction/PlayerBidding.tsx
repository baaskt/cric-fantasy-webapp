import React from 'react'
import SecondHighestBidder from './SecondHighestBidder'
import HighestBidder from './HighestBidder'
import PlayerAuctionCard from './PlayerAuctionCard'
import AuctionTimer from './AuctionTimer'

function PlayerBidding() {
  return (
    <div className='m-5 flex justify-evenly'>
      <div className='flex items-center basis-1/3 justify-center'>
        <SecondHighestBidder />
      </div>
      <div className='flex flex-row p-5 rounded-lg shadow-lg gap-10 w-fit'>
        <PlayerAuctionCard />
      </div>
      <div className='flex flex-col gap-4 items-center basis-1/3 justify-center'>
        <HighestBidder />
        <AuctionTimer />
      </div>
    </div>
  )
}

export default PlayerBidding
