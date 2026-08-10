import React, { useState } from 'react'
import CricButton from '../ui/CricButton'
import { COLORS } from '@/util/colors'
import CricTab from '../ui/CricTab'
import PlayerStats from '../PlayerStats'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import { OptionsEntity } from '@/model/entities/options.interface'
import { ALTERNATE_PLAYER_IMAGE_SRC, STATS } from '@/util/constants/constants'
import { useAuction } from '@/providers/AuctionProvider'
import { SellPlayerRequest } from '@/model/request/sell-player-request.type'
import { useMutateRequest } from '@/hooks/useMutateRequest'
import { PLAYERS } from '@/util/constants/endpoints'
import { HttpMethod } from '@/model/enum/http-method.enum'
import { SoldStatus } from '@/model/enum/sold-status.enum'
import { CricResponse } from '@/model/types/cric-response.type'
import { useRouter } from 'next/navigation'
import { useTournament } from '@/providers/TournamentProvider'
import { currencyToString } from '@/util/bidding'
import { useSWRConfig } from 'swr'
import { AuctionPlayerEntity } from '@/model/response/auction-player-response.interface'
import UndoIcon from '@mui/icons-material/Undo'
import { convertDriveUrl } from '@/util/helper'

const tabOptions: OptionsEntity[] = [
  { id: STATS.ipl, label: 'Stats' },
  // { id: STATS.t20, label: 'T20' },
]

function PlayerAuctionCard() {
  const { activeTournament } = useTournament()
  const {
    activeCategory,
    auctionPlayer,
    highestBidder,
    updatePlayer,
    biddingHistory,
    undoBidding,
  } = useAuction()
  const { mutate } = useSWRConfig()

  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState<OptionsEntity>(tabOptions[0])
  const tournamentId = activeTournament?.tournamentId || ''
  const SELL_PLAYER_URL =
    tournamentId && auctionPlayer?.player && auctionPlayer.player.playerId
      ? PLAYERS.SELL_PLAYER.replace('tournamentId', tournamentId).replace(
          'playerId',
          auctionPlayer?.player.playerId.toString(),
        )
      : ''
  const unsoldPlayerRequest = useMutateRequest(SELL_PLAYER_URL, HttpMethod.PUT)

  if (!auctionPlayer) return <></>
  const playerEntity = auctionPlayer?.player

  const handleChange = (selectedEntity: OptionsEntity) => {
    setSelectedTab(selectedEntity)
  }

  const handleUnSoldPlayer = () => {
    void setPlayerUnsold()
  }

  const handleUndo = () => {
    undoBidding()
  }

  const setPlayerUnsold = async () => {
    const payload: SellPlayerRequest = {
      soldStatus: SoldStatus.UNSOLD,
      teamId: '',
      soldAmount: 0,
      teamMaxBid: [],
    }
    try {
      const response: CricResponse<string> = (await unsoldPlayerRequest.trigger(
        payload as never,
      )) as CricResponse<string>
      console.log(response)
    } catch (e) {
      console.log(e)
    } finally {
      void mutatePlayersList()
      router.push(`${'/tournaments/'}${activeTournament?.tournamentId}${'/auction'}`)
    }
  }

  const mutatePlayersList = async () => {
    const updatedPlayer: AuctionPlayerEntity = {
      playerId: playerEntity.playerId,
      name: playerEntity.name,
      role: playerEntity.role,
      basePrice: playerEntity.basePrice,
      clubName: playerEntity.clubName,
      soldStatus: SoldStatus.UNSOLD,
      category: playerEntity.category,
    }
    const PLAYERS_URL = `${PLAYERS.GET_AUCTION_PLAYERS_URL.replace('tournamentId', tournamentId)}${activeCategory?.value}`
    const updatedList = updatePlayer(playerEntity.playerId, updatedPlayer)
    await mutate(PLAYERS_URL, updatedList)
  }

  const playerUrl = convertDriveUrl(playerEntity.imageUrl)

  return (
    <div className='w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl flex'>
      {/* Player Header */}
      <div className='relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50 pb-6'>
        {/* Subtle background decoration */}
        <div className='pointer-events-none absolute h-40 w-40 rounded-full bg-indigo-100/40 blur-3xl' />

        <div className='relative flex flex-col items-center'>
          {/* Player */}
          <div className='drop-shadow-lg'>
            <img
              src={playerUrl || ALTERNATE_PLAYER_IMAGE_SRC}
              alt='player profile'
              width='0'
              height='0'
              sizes='100vw'
              className='w-[200px] h-[200px]'
            />
          </div>

          {/* Player metadata */}
          <div className='mt-5 flex flex-wrap items-center justify-center gap-3 px-6'>
            <div className='text-center text-md font-bold text-violet-700 bg-violet-100 rounded-lg p-3'>
              {playerEntity.name}
            </div>
            {/* Role */}
            <div className='text-center rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-600 w-full'>
              {playerEntity.role}
            </div>

            {/* Club */}
            {playerEntity.clubName && (
              <div className='rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-700'>
                {playerEntity.clubName}
              </div>
            )}

            {/* International team */}
            <div className='flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-600'>
              {playerEntity.intlTeam}

              {playerEntity.intlTeam !== 'India' && <span>🏏</span>}
            </div>

            {/* Base Price */}
            <div className='mt-3 flex items-center gap-4 rounded-2xl border border-indigo-100 bg-white px-6 py-3 shadow-sm'>
              <div>
                <div className='text-xs font-semibold uppercase tracking-wider text-slate-400'>
                  Base Price
                </div>

                <div className='mt-0.5 text-xl font-extrabold tracking-tight text-slate-900'>
                  {playerEntity.basePrice}
                </div>
              </div>

              <div className='h-10 w-px bg-slate-200' />

              <div className='text-sm font-semibold text-indigo-600'>
                {currencyToString(playerEntity.basePrice)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className='border-t border-slate-100 px-6 pb-6 pt-5 bg-gradient-to-br from-pink-50 via-white to-indigo-200'>
        {/* Tabs */}
        <div className='flex justify-center'>
          <CricTab optionList={tabOptions} onChange={handleChange} />
        </div>

        {/* Stats */}
        <div className='mt-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-4'>
          <PlayerStats title={selectedTab.id as string} playerData={playerEntity} />
        </div>

        {/* Action */}
        {!highestBidder?.amount && (
          <div className='mt-5'>
            <CricButton
              btnTxt='Mark as unsold'
              startIcon={<NotInterestedIcon />}
              bgColor={COLORS.lightRed}
              onClick={() => handleUnSoldPlayer()}
              isLoading={unsoldPlayerRequest.isMutating}
              isFullWidth={true}
            />
          </div>
        )}

        {highestBidder?.amount && (
          <div className='mt-5'>
            <CricButton
              btnTxt={`Undo (${biddingHistory.length})`}
              startIcon={<UndoIcon />}
              bgColor={COLORS.cricPrimary}
              onClick={() => handleUndo()}
              isFullWidth={true}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default PlayerAuctionCard
