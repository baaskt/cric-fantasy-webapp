'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { CricResponse } from '@/model/types/cric-response.type'
import { useRequest } from '@/hooks/useRequest'
import { useTournament } from '@/providers/TournamentProvider'
import Loading from '../Loading'
import { PLAYER, TITLES } from '@/util/constants/constants'
import { PlayersListEntity } from '@/model/response/player-list.response.interface'
import { useRouter } from 'next/navigation'
import { convertDriveUrl } from '@/util/helper'
import PlayerListCard from './PlayerListCard'
import { PLAYERS } from '@/util/constants/endpoints'
import { SoldStatus } from '@/model/enum/sold-status.enum'

function UpcomingTenderPlayers() {
  const { activeTournament } = useTournament()
  const [playersList, setPlayersList] = useState<PlayersListEntity[]>([])
  const router = useRouter()

  const PLAYERS_URL = useMemo(() => {
    return activeTournament
      ? PLAYERS.GET_PLAYERS_URL.replace('tournamentId', activeTournament.tournamentId).concat(
          'soldStatus=UNSOLD&&cursor=0&limit=3',
        )
      : ''
  }, [activeTournament])

  const playerRequest = useRequest(PLAYERS_URL)

  useEffect(() => {
    if (playerRequest.data) {
      const playerResponse: CricResponse<PlayersListEntity[]> = playerRequest.data as CricResponse<
        PlayersListEntity[]
      >
      if (playerResponse?.result) {
        const updatedPlayerList = [...playersList, ...playerResponse.result]
        const top3Players = updatedPlayerList
          .sort((a, b) => b.totalPoints - a.totalPoints) // DESC
          .slice(0, 3)
        setPlayersList(top3Players)
      }
    }
  }, [playerRequest.data])

  if ((playerRequest.isValidating || playerRequest.isLoading) && !playersList.length) {
    return <Loading txt={PLAYER.LOADING_TXT}></Loading>
  }

  const navigateToPlayerDetail = (playerId: number) => {
    if (playerId && activeTournament)
      router.push(
        TITLES.PLAYER_DETAIL.fullPath
          .replace('tournamentId', activeTournament.tournamentId.toString())
          .replace('playerId', playerId.toString()),
      )
  }

  return (
    <div className='p-2'>
      <div className='rounded-lg mt-4 p-5 bg-gradient-to-br from-indigo-800 via-indigo-600 to-indigo-400 '>
        <div className='text-white font-pacifico text-md'>Upcoming players in tender</div>
        <div className='text-sm text-gray-400'>Top 3 unsold players</div>
      </div>
      <div className='mt-2 flex flex-col gap-3 w-full'>
        {playersList.map((player, playerIndex) => {
          const diff = player.totalPoints - player.totalPlayingXIPoints
          const playerUrl = convertDriveUrl(player.imageUrl)
          return (
            <PlayerListCard
              key={player.playerId}
              soldStatus={SoldStatus.UNSOLD.toString()}
              playerUrl={playerUrl}
              diff={diff}
              player={player}
              playerIndex={playerIndex}
              onPlayerDetail={navigateToPlayerDetail}
            />
          )
        })}
      </div>
    </div>
  )
}

export default UpcomingTenderPlayers
