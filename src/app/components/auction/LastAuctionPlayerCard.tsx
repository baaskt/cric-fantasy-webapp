import { useRequest } from '@/hooks/useRequest'
import { CricResponse } from '@/model/types/cric-response.type'
import { PLAYERS } from '@/util/constants/endpoints'
import React, { useEffect } from 'react'
import PlayerCard from '../PlayerCard'
import Image from 'next/image'
import CricButton from '../ui/CricButton'
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined'
import { LastAuctionPlayerEntity } from '@/model/response/last-aucton-player.response.interface'
import { SoldStatus } from '@/model/enum/sold-status.enum'
import { useAuction } from '@/providers/AuctionProvider'
import { biddingString } from '@/util/bidding'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { COLORS } from '@/util/colors'
import { useRouter } from 'next/navigation'
import { OptionsEntity } from '@/model/entities/options.interface'

type LastAuctionPlayerCardProps = {
  categories: OptionsEntity[]
}

function LastAuctionPlayerCard(props: LastAuctionPlayerCardProps) {
  const { categories } = props
  const { setActiveCategory, setLastAuctionplayer } = useAuction()
  const router = useRouter()
  const lastauctionPlayerRequest = useRequest(
    PLAYERS.LAST_AUCTIONED_URL.replace('tournamentId', '088e579a-3966-4b49-9555-ea1b3a087496'),
  )
  const lastauctionPlayerResponse: CricResponse<LastAuctionPlayerEntity> =
    lastauctionPlayerRequest.data as CricResponse<LastAuctionPlayerEntity>
  const playerData: LastAuctionPlayerEntity | undefined =
    lastauctionPlayerResponse?.result && lastauctionPlayerResponse.result

  useEffect(() => {
    if (lastauctionPlayerResponse?.result) {
      setLastAuctionplayer(lastauctionPlayerResponse.result)
      findActiveCategory(lastauctionPlayerResponse.result)
    }
  }, [setLastAuctionplayer, lastauctionPlayerResponse])

  if (!playerData) {
    return <></>
  }

  const findActiveCategory = (lastAuctionPlayer: LastAuctionPlayerEntity) => {
    if (lastAuctionPlayer.completedAuctionCategories?.length) {
      console.log('')
    } else {
      setActiveCategory(categories[0].value || '')
    }
  }

  const continueAuction = () => {
    const redirectUrl = 'auction/board'
    router.push(redirectUrl)
  }

  return (
    <div className='rounded-lg shadow-lg flex flex-col items-center p-5 w-[30%] h-fit'>
      <div className='p-5 text-lg font-bold'>Last Player in Auction</div>
      <div className='flex flex-col items-center gap-10'>
        <div className='flex items-center justify-between'>
          <PlayerCard playerData={playerData} />
          <Image
            src={
              playerData.soldStatus === SoldStatus.SOLD.toString()
                ? '/assets/images/sold.png'
                : '/assets/images/unsold.png'
            }
            alt='sold status'
            width={200}
            height={80}
            className='-rotate-11'
          />
        </div>
        <div className='flex items-center gap-4'>
          <div className='flex self-start'>
            <AutoAwesomeIcon style={{ color: COLORS.cricPrimaryLight }} />
          </div>
          <div className='flex flex-col items-center'>
            <div className='text-lg'>{playerData.teamName}</div>
            <div>{biddingString(playerData.soldAmount)}</div>
          </div>
          <div className='flex self-end'>
            <AutoAwesomeIcon style={{ color: COLORS.cricPrimaryLight }} />
          </div>
        </div>

        <CricButton
          startIcon={<PlayArrowOutlinedIcon />}
          isFullWidth={true}
          onClick={() => continueAuction()}
          btnTxt={`Continue auction for ${'marquee'} players`}
        ></CricButton>
      </div>
    </div>
  )
}

export default LastAuctionPlayerCard
