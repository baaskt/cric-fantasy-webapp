import { useAuction } from '@/providers/AuctionProvider'
import { biddingString } from '@/util/bidding'
import { COLORS } from '@/util/colors'
import React from 'react'

function SecondHighestBidder() {
  const { secondHighestBidder } = useAuction()

  return (
    secondHighestBidder && (
      <div
        className='rounded-lg shadow-lg'
        style={{ backgroundColor: COLORS.cricPrimaryLight, color: COLORS.white }}
      >
        <div className='text-center'>
          <div className='ml-5 mr-5 p-2 rounded-b-xl text-sm bg-amber-300 text-slate-600'>
            Active Bidder
          </div>
          <div>
            <div className='mt-5'>{secondHighestBidder.teamName}</div>
            <div className='mt-3 text-2xl font-bold'>₹ {secondHighestBidder.amount}</div>
            <div className='mb-3 text-md'>( {biddingString(secondHighestBidder.amount)} )</div>
          </div>
        </div>
      </div>
    )
  )
}

export default SecondHighestBidder
