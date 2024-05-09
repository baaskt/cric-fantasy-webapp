'use client'

import { useRequest } from '@/hooks/useRequest'
import { CricResponse } from '@/model/types/cric-response.type'
import { CricHeaderRow, CricTableRow } from '@/model/types/cric-table.type'
import { TEAMS } from '@/util/constants/endpoints'
import React, { useEffect, useState } from 'react'
import CricTable from '../ui/CricTable'
import Loading from '../Loading'
import { DASHBOARD } from '@/util/constants/constants'
import { useRouter } from 'next/navigation'
import { prepareTableData } from '@/util/tables/table'
import { TableType } from '@/model/enum/table-type.enum'
import { useTeam } from '@/providers/TeamProvider'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import { COLORS } from '@/util/colors'
import { useTournament } from '@/providers/TournamentProvider'
import { TeamPointsEntity } from '@/model/response/team-points.interface'
import { formatDateAndTime } from '@/util/helper'

const headersList: CricHeaderRow[] = [
  { key: 'expand', label: '', alias: '', type: 'expand', isMobile: true },
  { key: 'position', label: 'Position', alias: 'Pos', type: 'stock', isMobile: true },
  { key: 'teamName', label: 'Team', type: 'string', isMobile: true },
  { key: 'points', label: 'Match Points', alias: '', type: 'number', isMobile: false },
  { key: 'statPoints', label: 'Milestone Points', alias: '', type: 'number', isMobile: false },
  { key: 'tournamentPoints', label: 'Total Points', alias: 'Pts', type: 'stock', isMobile: true },
  { key: '', label: 'View Team Details', type: 'icon', iconPath: '/detail' },
]

function DashboardTeams() {
  const { activeTournament } = useTournament()
  const tournamentId = activeTournament?.tournamentId || ''
  const [tableData, setTableData] = useState<CricTableRow[]>([])
  const [teamList, setTeamList] = useState<TeamPointsEntity[]>([])
  const { markActiveTeam } = useTeam()
  const router = useRouter()

  const teamRequest = useRequest(tournamentId ? `${TEAMS.GET_TEAM_POINTS}${tournamentId}` : '')

  useEffect(() => {
    if (teamRequest.data) {
      const teamResponse: CricResponse<TeamPointsEntity[]> = teamRequest.data as CricResponse<
        TeamPointsEntity[]
      >
      if (teamResponse.result) {
        prepareTableRows(teamResponse.result)
      }
    }
  }, [teamRequest.data])

  const prepareTableRows = (response: TeamPointsEntity[]) => {
    if (response.length) {
      const tempTableData: CricTableRow[] = prepareTableData(
        response,
        headersList,
        'teamId',
        TableType.DASHBOARD,
        'tournamentPoints',
      )
      setTableData(tempTableData)
      setTeamList(response)
    }
  }

  if (teamRequest.isValidating) {
    return <Loading txt={DASHBOARD.LOADING_TXT}></Loading>
  }

  if (!teamRequest.isValidating && !teamList.length) {
    return <Loading txt={'Fetching Stats...'}></Loading>
  }

  const navigateToTeamDetail = (teamId: string | number) => {
    const selectedTeam = teamList.find(team => team.teamId === teamId)
    if (selectedTeam) markActiveTeam(teamId.toString())
    router.push('teams/detail')
  }

  return (
    <div className='p-5 pt-0'>
      <div className='flex gap-2 p-3 flex-col md:flex-row'>
        <div className='flex gap-2 items-center'>
          <LeaderboardIcon style={{ color: COLORS.cricPrimary }} />
          <div className='text-xl'>Leaderboard</div>
        </div>
        <div className='text-sm italic text-gray-500 md:text-lg'>{`( Last updated : ${formatDateAndTime(teamList[0].pointsUpdatedAt, true)} )`}</div>
      </div>
      <CricTable
        headerList={headersList}
        rowList={tableData}
        defOrder={'desc'}
        defOrderBy={'tournamentPoints'}
        fullWidth={false}
        onRowSelect={navigateToTeamDetail}
        hideSearch={true}
      />
    </div>
  )
}

export default DashboardTeams
