'use client'

import { CricHeaderRow, CricTableRow } from '@/model/types/cric-table.type'
import React, { useEffect, useMemo, useState } from 'react'
import CricTable from '../ui/CricTable'
import { CricResponse } from '@/model/types/cric-response.type'
import { useRequest } from '@/hooks/useRequest'
import { prepareTableData } from '@/util/tables/table'
import { TableType } from '@/model/enum/table-type.enum'
import { useTournament } from '@/providers/TournamentProvider'
import { OptionsEntity } from '@/model/entities/options.interface'
import Loading from '../Loading'
import { PLAYER, TITLES } from '@/util/constants/constants'
import { getPlayersFilterUrl } from '@/util/player'
import { PlayersListEntity } from '@/model/response/player-list.response.interface'
import { useRouter } from 'next/navigation'
import { COLORS } from '@/util/colors'
import CricAnimatedDots from '../ui/CricAnimatedDots'

const headersList: CricHeaderRow[] = [
  { key: 'expand', label: '', alias: '', type: 'expand', isMobile: true },
  { key: 'pos', label: 'Position', alias: 'Pos', type: 'number', isMobile: true },
  { key: 'name', label: 'Name', type: 'string', isMobile: true },
  { key: 'intlTeam', label: 'Country', type: 'string' },
  // { key: 'clubName', label: 'Club', type: 'string' },
  { key: 'teamName', label: 'Team', type: 'string' },
  { key: 'runs', label: 'Runs', alias: 'R', type: 'number' },
  { key: 'wickets', label: 'Wickets', alias: 'W', type: 'number' },
  { key: 'catches', label: 'Catches', alias: 'C', type: 'number' },
  { key: 'totalPoints', label: 'Points', alias: 'Pts', type: 'number', isMobile: true },
  { key: '', label: 'View Player Details', type: 'icon', iconPath: '/detail' },
]

type PlayersListProp = {
  selectedTab: OptionsEntity
  selectedTeam: OptionsEntity | undefined
}

function PlayersList(props: PlayersListProp) {
  const { selectedTab, selectedTeam } = props
  const { activeTournament } = useTournament()
  const [tableData, setTableData] = useState<CricTableRow[]>([])
  const [columnList, setColumnList] = useState<CricHeaderRow[]>([])
  const [playersList, setPlayersList] = useState<PlayersListEntity[]>([])
  const [cursor, setCursor] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const router = useRouter()

  const PLAYERS_URL = useMemo(() => {
    console.log('Player', activeTournament, selectedTab, selectedTeam, cursor, hasMore)
    return activeTournament && selectedTeam && hasMore
      ? getPlayersFilterUrl(activeTournament, selectedTab, selectedTeam, cursor)
      : ''
  }, [hasMore, cursor, selectedTab, selectedTeam, activeTournament])

  const playerRequest = useRequest(PLAYERS_URL)

  useEffect(() => {
    // Reset states when filters change
    if (selectedTab && selectedTeam) {
      setPlayersList([])
      setTableData([])
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

  useEffect(() => {
    if (playersList.length) {
      const updatedColumns = getUpdatedColumns()
      setColumnList(updatedColumns)
      prepareTableRows(playersList, updatedColumns)
    }
  }, [playersList, selectedTab, selectedTeam])

  const prepareTableRows = (
    response: PlayersListEntity[],
    updatedHeadersList?: CricHeaderRow[],
  ) => {
    let tempTableData: CricTableRow[] = []
    if (response.length) {
      tempTableData = prepareTableData(
        response,
        updatedHeadersList || headersList,
        'playerId',
        TableType.PLAYERS,
        'totalPoints',
        {
          teamName: selectedTeam && selectedTeam?.id !== -1 ? selectedTeam.label : '',
        },
      )
    }
    setTableData(tempTableData)
  }

  const getUpdatedColumns = (): CricHeaderRow[] => {
    const updatedColumns: CricHeaderRow[] = []
    headersList.forEach(column => {
      if (!(column.key === 'teamName' && (selectedTeam?.id !== -1 || selectedTab.id === 4)))
        updatedColumns.push(column)
    })
    return updatedColumns
  }

  const navigateToPlayerDetail = (playerId: string | number) => {
    if (playerId && activeTournament)
      router.push(
        TITLES.PLAYER_DETAIL.fullPath
          .replace('tournamentId', activeTournament.tournamentId.toString())
          .replace('playerId', playerId.toString()),
      )
  }

  if ((playerRequest.isValidating || !tableData) && cursor === 0 && !playersList.length) {
    return <Loading txt={PLAYER.LOADING_TXT}></Loading>
  }

  return (
    <div className='p-5'>
      <CricTable
        headerList={columnList}
        rowList={tableData}
        defOrder={'desc'}
        defOrderBy={'totalPoints'}
        fullWidth={false}
        onRowSelect={navigateToPlayerDetail}
      />
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
