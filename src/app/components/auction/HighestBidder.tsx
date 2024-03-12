import { useAuction } from '@/providers/AuctionProvider'
import { biddingString } from '@/util/bidding'
import { COLORS } from '@/util/colors'
import React from 'react'
import CricButton from '../ui/CricButton'
import GavelIcon from '@mui/icons-material/Gavel'

function HighestBidder() {
  const { highestBidder } = useAuction()

  return (
    highestBidder && (
      <div>
        <div className='p-2 rounded-lg border-solid border-4 border-pink-600 text-center'>
          <div className='text-2xl'>{highestBidder.amount}</div>
          <div className='text-md'>( {biddingString(highestBidder.amount)} )</div>
          <div style={{ color: COLORS.cricPrimary }}>{highestBidder.teamName}</div>
        </div>
        <div className='mt-5 flex justify-center'>
          <CricButton
            btnTxt='Hammer'
            startIcon={<GavelIcon />}
            bgColor={COLORS.lightRed}
            onClick={() => {}}
          ></CricButton>
        </div>
      </div>
    )
  )
}

export default HighestBidder
