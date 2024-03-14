import { useAuction } from '@/providers/AuctionProvider'
import { currencyToString } from '@/util/bidding'
import { COLORS } from '@/util/colors'
import React from 'react'
import CricButton from '../ui/CricButton'
import GavelIcon from '@mui/icons-material/Gavel'

function HighestBidder() {
  const { highestBidder } = useAuction()

  return (
    highestBidder && (
      <div
        className='rounded-lg shadow-lg'
        style={{ backgroundColor: COLORS.cricPrimary, color: COLORS.white }}
      >
        <div className='text-center'>
          <div className='ml-5 mr-5 p-2 rounded-b-xl text-sm bg-amber-300 text-black'>
            Highest Bidder
          </div>
          <div className='p-3'>
            <div className='mt-5'>{highestBidder.teamName}</div>
            <div className='mt-3 text-2xl font-bold'>₹ {highestBidder.amount}</div>
            <div className='text-md'>( {currencyToString(highestBidder.amount)} )</div>
          </div>
        </div>
        <div className='p-4 mt-5 flex justify-center'>
          <CricButton
            btnTxt='Hammer Down'
            startIcon={<GavelIcon />}
            color={COLORS.cricPrimary}
            bgColor={COLORS.white}
            onClick={() => {}}
            isFullWidth={true}
          ></CricButton>
        </div>
      </div>
    )
  )
}

export default HighestBidder
