'use client'

import { CricHeaderRow, CricTableRow } from '@/model/types/cric-table.type'
import React, { useEffect, useState } from 'react'
import CricTable from '../ui/CricTable'
import { CricResponse } from '@/model/types/cric-response.type'
import { PLAYERS } from '@/util/constants/endpoints'
import { useRequest } from '@/hooks/useRequest'
import { PlayerEntity } from '@/model/response/player-response.interface'
import { prepareTableData } from '@/util/table'
import { TableType } from '@/model/enum/table-type.enum'
import { useTournament } from '@/providers/TournamentProvider'

const headersList: CricHeaderRow[] = [
  { key: 'pos', label: 'Position', type: 'number' },
  { key: 'teamName', label: 'Name', type: 'string' },
  { key: 'teamMembers', label: 'Participants', type: 'list' },
  { key: 'purseBalance', label: 'Purse Balance', type: 'currency' },
  { key: 'tournamentPoints', label: 'Total Points', type: 'number' },
  { key: '', label: '', type: 'icon', iconPath: '/detail' },
]

function PlayersList() {
  const { activeTournament } = useTournament()
  const [tableData, setTableData] = useState<CricTableRow[]>([])

  const tournamentId = activeTournament?.tournamentId || ''
  const PLAYERS_URL = PLAYERS.GET_ALL_PLAYERS_URL.replace('tournamentId', tournamentId)
  const playerRequest = useRequest(PLAYERS_URL)
  const playerResponse: CricResponse<PlayerEntity[]> = playerRequest.data as CricResponse<
    PlayerEntity[]
  >

  useEffect(() => {
    if (playerResponse?.result) {
      prepareTableRows(playerResponse.result)
    }
  }, [playerResponse])

  const prepareTableRows = (response: PlayerEntity[]) => {
    if (response.length) {
      const tempTableData: CricTableRow[] = prepareTableData(
        response,
        headersList,
        'playerId',
        TableType.PLAYERS,
      )
      console.log(tempTableData)
      setTableData(tempTableData)
    }
  }

  return (
    <div className='p-5'>
      <CricTable
        headerList={headersList}
        rowList={tableData}
        defOrder={'desc'}
        defOrderBy={'tournamentPoints'}
        fullWidth={false}
        // onRowSelect={navigateToTeamDetail}
      />
    </div>
  )
}

export default PlayersList
