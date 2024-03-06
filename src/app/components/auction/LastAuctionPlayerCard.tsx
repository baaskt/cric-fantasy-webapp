import { useRequest } from '@/hooks/useRequest'
import { AuctionPlayersResponse } from '@/model/response/auction-players-response.interface'
import { CricResponse } from '@/model/types/cric-response.type'
import { ROOSTER } from '@/util/constants/endpoints'
import React from 'react'
import PlayerCard from '../PlayerCard'
import Image from 'next/image'
import CricButton from '../ui/CricButton'
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined'

function LastAuctionPlayerCard() {
  const lastauctionPlayerRequest = useRequest(ROOSTER.LAST_AUCTIONED_URL)
  const lastauctionPlayerResponse: CricResponse<AuctionPlayersResponse[]> =
    lastauctionPlayerRequest.data as CricResponse<AuctionPlayersResponse[]>
  const playerData: AuctionPlayersResponse | undefined =
    lastauctionPlayerResponse?.result && lastauctionPlayerResponse.result[0]

  if (!playerData) {
    return <></>
  }

  return (
    <div className='rounded-lg shadow-lg flex flex-col items-center p-5'>
      <div className='p-5 text-lg font-bold'>Last Player in Auction</div>
      <div className='flex flex-col items-center gap-10'>
        <div className='flex items-center justify-between'>
          <PlayerCard playerData={playerData} />
          <Image
            src={
              playerData.isSold === 'Y'
                ? '/assets/images/sold.png'
                : '/assets/images/unsold.png'
            }
            alt='sold status'
            width={200}
            height={80}
            className='-rotate-11'
          />
        </div>
        <CricButton
          startIcon={<PlayArrowOutlinedIcon />}
          isFullWidth={true}
          onClick={() => {}}
          btnTxt={`Continue auction for ${'marquee'} players`}
        ></CricButton>
      </div>
    </div>
  )
}

export default LastAuctionPlayerCard
