'use client'

import { useRequest } from '@/hooks/useRequest'
import { TeamEntity } from '@/model/response/team.interface'
import { CricResponse } from '@/model/types/cric-response.type'
import { CricHeaderRow, CricTableRow } from '@/model/types/cric-table.type'
import { TEAMS } from '@/util/constants/endpoints'
import React, { useEffect, useState } from 'react'
import CricTable from '../ui/CricTable'
import Loading from '../Loading'
import { TEAM } from '@/util/constants/constants'
import { useRouter } from 'next/navigation'
import { prepareTableData } from '@/util/table'
import { TableType } from '@/model/enum/table-type.enum'
import { useTeam } from '@/providers/TeamProvider'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import { COLORS } from '@/util/colors'

const headersList: CricHeaderRow[] = [
  { key: 'expand', label: '', alias: '', type: 'expand', isMobile: true },
  { key: 'pos', label: 'Position', alias: 'Pos', type: 'number', isMobile: true },
  { key: 'teamName', label: 'Team', type: 'string', isMobile: true },
  { key: 'teamMembers', label: 'Owners', type: 'list' },
  { key: 'purseBalance', label: 'Purse Balance', type: 'currency' },
  { key: 'tournamentPoints', label: 'Total Points', alias: 'Pts', type: 'number', isMobile: true },
  { key: '', label: 'View Team Details', type: 'icon', iconPath: '/detail' },
]

function DashboardTeams() {
  const [tableData, setTableData] = useState<CricTableRow[]>([])
  const [teamList, setTeamList] = useState<TeamEntity[]>([])
  const { markActiveTeam } = useTeam()
  const router = useRouter()

  const teamRequest = useRequest(TEAMS.GET_ALL_TEAMS)
  const teamResponse: CricResponse<TeamEntity[]> = teamRequest.data as CricResponse<TeamEntity[]>

  useEffect(() => {
    if (teamResponse?.result) {
      prepareTableRows(teamResponse.result)
    }
  }, [teamResponse])

  const prepareTableRows = (response: TeamEntity[]) => {
    if (response.length) {
      const tempTableData: CricTableRow[] = prepareTableData(
        response,
        headersList,
        'teamId',
        TableType.TEAMS,
        'tournamentPoints',
      )
      setTableData(tempTableData)
      setTeamList(response)
    }
  }

  if (teamRequest.isLoading) {
    return <Loading txt={TEAM.LOADING_TXT}></Loading>
  }

  if (!teamResponse?.result?.length) {
    return <p className='p-5'>No teams found</p>
  }

  const navigateToTeamDetail = (rowId: string | number) => {
    const selectedTeam = teamList.find(team => team.teamId === rowId)
    if (selectedTeam) markActiveTeam(selectedTeam)
    router.push('teams/detail')
  }

  return (
    <div className='p-5 pt-0'>
      <div className='flex gap-2 p-3 items-center'>
        <LeaderboardIcon style={{ color: COLORS.cricPrimary }} />
        <div className='text-xl'>Leaderboard</div>
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
