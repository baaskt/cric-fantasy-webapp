import { useAuction } from '@/providers/AuctionProvider'
import { biddingString } from '@/util/bidding'
import { COLORS } from '@/util/colors'
import React from 'react'

function SecondHighestBidder() {
  const { secondHighestBidder } = useAuction()

  return (
    secondHighestBidder && (
      <div className='p-2 rounded-lg border-solid border-2 border-pink-600 text-center'>
        <div className='text-2xl'>{secondHighestBidder.amount}</div>
        <div className='text-md'>( {biddingString(secondHighestBidder.amount)} )</div>
        <div style={{ color: COLORS.darkGray }}>{secondHighestBidder.teamName}</div>
      </div>
    )
  )
}

export default SecondHighestBidder
