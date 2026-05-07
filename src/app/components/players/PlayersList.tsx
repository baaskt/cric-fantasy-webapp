'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { CricResponse } from '@/model/types/cric-response.type'
import { useRequest } from '@/hooks/useRequest'
import { useTournament } from '@/providers/TournamentProvider'
import { OptionsEntity } from '@/model/entities/options.interface'
import Loading from '../Loading'
import { PLAYER, TITLES } from '@/util/constants/constants'
import { getPlayersFilterUrl } from '@/util/player'
import { PlayersListEntity } from '@/model/response/player-list.response.interface'
import { useRouter } from 'next/navigation'
import { COLORS } from '@/util/colors'
import CricAnimatedDots from '../ui/CricAnimatedDots'
import { convertDriveUrl } from '@/util/helper'
import PlayerListCard from './PlayerListCard'

type PlayersListProp = {
  selectedTab: OptionsEntity
  selectedTeam: OptionsEntity | undefined
}

function PlayersList(props: PlayersListProp) {
  const { selectedTab, selectedTeam } = props
  const { activeTournament } = useTournament()
  const [playersList, setPlayersList] = useState<PlayersListEntity[]>([])
  const [cursor, setCursor] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const router = useRouter()
  const [search, setSearch] = useState('')
  const PLAYERS_URL = useMemo(() => {
    return activeTournament && selectedTeam && hasMore
      ? getPlayersFilterUrl(activeTournament, selectedTab, selectedTeam, cursor)
      : ''
  }, [hasMore, cursor, selectedTab, selectedTeam, activeTournament])

  const playerRequest = useRequest(PLAYERS_URL)

  useEffect(() => {
    // Reset states when filters change
    if (selectedTab && selectedTeam) {
      setPlayersList([])
      setCursor(0)
      setHasMore(true)
    }
  }, [selectedTab, selectedTeam])

  useEffect(() => {
    if (playerRequest.data) {
      const playerResponse: CricResponse<PlayersListEntity[]> = playerRequest.data as CricResponse<
        PlayersListEntity[]
      >
      if (playerResponse?.result) {
        const updatedPlayerList = [...playersList, ...playerResponse.result]
        setPlayersList(updatedPlayerList)
        if (playerResponse.meta) {
          setCursor(playerResponse.meta.nextCursor)
          setHasMore(playerResponse.meta.hasMore)
        }
      }
    }
  }, [playerRequest.data])

  const navigateToPlayerDetail = (playerId: number) => {
    if (playerId && activeTournament)
      router.push(
        TITLES.PLAYER_DETAIL.fullPath
          .replace('tournamentId', activeTournament.tournamentId.toString())
          .replace('playerId', playerId.toString()),
      )
  }

  const filteredPlayers = playersList.filter(player => {
    const lower = search.toLowerCase()
    return Object.values(player).some(value => value && String(value).toLowerCase().includes(lower))
  })

  const aggregatePoints = filteredPlayers.reduce(
    (acc, player) => {
      const totalPoints = player.totalPoints || 0
      const playingXI = player.totalPlayingXIPoints || 0
      const milestone = player.totalMilestonePoints || 0

      const diff = totalPoints - playingXI

      acc.totalPoints += totalPoints
      acc.playingXI += playingXI
      acc.totalMilestone += milestone
      acc.totalDiff += diff

      return acc
    },
    {
      totalPoints: 0,
      playingXI: 0,
      totalMilestone: 0,
      totalDiff: 0,
    },
  )

  if ((playerRequest.isValidating || playerRequest.isLoading) && cursor === 0) {
    return <Loading txt={PLAYER.LOADING_TXT}></Loading>
  }

  if (!playersList.length) {
    return <p className='text-center text-md text-indigo-500 py-3'>No players found.</p>
  }

  return (
    <div className='p-5'>
      {/* 🔍 Search Bar */}
      <div className='relative mb-4 mt-2'>
        <input
          type='text'
          placeholder='Search players by any field...'
          value={search}
          onChange={e => setSearch(e.target.value)}
          className='w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400'
        />
        <span className='absolute left-3 top-3 text-gray-400'>🔍</span>
        {search && (
          <button onClick={() => setSearch('')} className='absolute right-3 top-2 text-gray-500'>
            ✕
          </button>
        )}
      </div>
      <div className='text-indigo-500 flex'>
        {`${filteredPlayers.length} ${search ? `/ ${playersList.length}` : ''} Players`}
        {hasMore && <CricAnimatedDots bgColor={COLORS.cricPrimary} />}
      </div>
      <div className='grid grid-cols-3 gap-2 mt-2 mb-4'>
        {[
          { val: aggregatePoints.playingXI, lbl: 'Total Points' },
          { val: aggregatePoints.totalMilestone, lbl: 'Total Milestone Points' },
          { val: aggregatePoints.totalDiff, lbl: 'Total Missed Points' },
        ].map(s => (
          <div
            key={s.lbl}
            className='bg-white rounded-2xl px-2.5 py-3 text-center border border-indigo-100'
          >
            <p className='text-[17px] font-medium text-indigo-700 leading-none'>{s.val}</p>
            <p className='text-[10px] text-[#8b8bb8] mt-1 uppercase tracking-wider'>{s.lbl}</p>
          </div>
        ))}
      </div>
      <div className='mt-2 flex flex-col gap-3 w-full'>
        {filteredPlayers.map((player, playerIndex) => {
          const diff = player.totalPoints - player.totalPlayingXIPoints
          const playerUrl = convertDriveUrl(player.imageUrl)
          return (
            <PlayerListCard
              key={player.playerId}
              soldStatus={selectedTab.value?.toString()}
              playerUrl={playerUrl}
              diff={diff}
              player={player}
              playerIndex={playerIndex}
              onPlayerDetail={navigateToPlayerDetail}
            />
          )
        })}
      </div>
      {hasMore && (
        <div
          className='flex flex-row gap-2 items-center text-center justify-center mt-2'
          style={{ color: COLORS.cricPrimary }}
        >
          <div>Loading more players...</div>
          <CricAnimatedDots bgColor={COLORS.cricPrimary} />
        </div>
      )}
    </div>
  )
}

export default PlayersList
