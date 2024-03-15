import { useRequest } from '@/hooks/useRequest'
import { CricResponse } from '@/model/types/cric-response.type'
import { PLAYERS } from '@/util/constants/endpoints'
import React, { useEffect } from 'react'
import PlayerCard from '../PlayerCard'
import Image from 'next/image'
import CricButton from '../ui/CricButton'
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined'
import {
  LastAuctionPlayerDetailEntity,
  LastAuctionPlayerEntity,
} from '@/model/response/last-aucton-player.response.interface'
import { SoldStatus } from '@/model/enum/sold-status.enum'
import { useAuction } from '@/providers/AuctionProvider'
import { currencyToString } from '@/util/bidding'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { COLORS } from '@/util/colors'
import { useRouter } from 'next/navigation'
import { OptionsEntity } from '@/model/entities/options.interface'
import { NO_CACHE } from '@/util/constants/constants'
import { useTournament } from '@/providers/TournamentProvider'

type LastAuctionPlayerCardProps = {
  categories: OptionsEntity[]
}

function LastAuctionPlayerCard(props: LastAuctionPlayerCardProps) {
  const { categories } = props
  const { activeCategory, setAuctionCompleted, setActiveCategory, setLastAuctionplayer } =
    useAuction()
  const { activeTournament, setSubTitle } = useTournament()
  const router = useRouter()
  const lastauctionPlayerRequest = useRequest(
    PLAYERS.LAST_AUCTIONED_URL.replace('tournamentId', activeTournament?.tournamentId || ''),
    NO_CACHE,
  )
  const lastauctionPlayerResponse: CricResponse<LastAuctionPlayerEntity> =
    lastauctionPlayerRequest.data as CricResponse<LastAuctionPlayerEntity>
  const playerData: LastAuctionPlayerDetailEntity | undefined =
    lastauctionPlayerResponse?.result && lastauctionPlayerResponse.result.player

  const setDefaultCategory = () => {
    const activeCategory = categories[0]
    setSubTitle(activeCategory.label)
    setActiveCategory(activeCategory)
  }

  useEffect(() => {
    setDefaultCategory()
  }, [])

  useEffect(() => {
    if (lastauctionPlayerResponse?.result) {
      setLastAuctionplayer(lastauctionPlayerResponse.result.player)
      findActiveCategory(lastauctionPlayerResponse.result.completedAuctionCategories)
    }
  }, [setLastAuctionplayer, lastauctionPlayerResponse])

  if (!playerData) {
    return <></>
  }

  const findActiveCategory = (completedAuctionCategories: string[]) => {
    if (completedAuctionCategories?.length) {
      if (completedAuctionCategories?.length === categories.length) {
        setAuctionCompleted(true)
      } else {
        for (let i = 0; i < categories.length; ++i) {
          const existingCategory = categories[i]
          if (!completedAuctionCategories.includes(existingCategory.value as string)) {
            setSubTitle(existingCategory.label)
            setActiveCategory(existingCategory)
            break
          }
        }
      }
    } else {
      setDefaultCategory()
    }
  }

  const continueAuction = () => {
    const redirectUrl = 'auction/board'
    router.push(redirectUrl)
  }

  return (
    <div className='rounded-lg shadow-lg flex flex-col items-center p-5 h-fit'>
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
        {playerData.soldAmount > 0 && playerData.teamName && (
          <div className='flex items-center gap-4'>
            <div className='flex self-start'>
              <AutoAwesomeIcon style={{ color: COLORS.cricPrimaryLight }} />
            </div>
            <div className='flex flex-col items-center'>
              <div className='text-lg'>{playerData.teamName}</div>
              <div>{currencyToString(playerData.soldAmount)}</div>
            </div>
            <div className='flex self-end'>
              <AutoAwesomeIcon style={{ color: COLORS.cricPrimaryLight }} />
            </div>
          </div>
        )}
        <CricButton
          startIcon={<PlayArrowOutlinedIcon />}
          isFullWidth={true}
          onClick={() => continueAuction()}
          btnTxt={`Continue auction for ${activeCategory?.label} players`}
        ></CricButton>
      </div>
    </div>
  )
}

export default LastAuctionPlayerCard
