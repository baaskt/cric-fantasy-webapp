import { useRequest } from '@/hooks/useRequest'
import { TeamEntity } from '@/model/response/team.interface'
import { CricResponse } from '@/model/types/cric-response.type'
import { CricHeaderRow, CricTableRow } from '@/model/types/cric-table.type'
import { TEAMS } from '@/util/constants/endpoints'
import { prepareTeamTable } from '@/util/helper'
import React, { useEffect, useState } from 'react'
import CricTable from './ui/CricTable'
import Loading from './Loading'
import { NO_CACHE, TEAM } from '@/util/constants/constants'
import { useTournament } from '@/providers/TournamentProvider'
import { useRouter } from 'next/navigation'

const headersList: CricHeaderRow[] = [
  { key: 'pos', label: 'Position', type: 'number' },
  { key: 'teamName', label: 'Team', type: 'string' },
  { key: 'teamMembers', label: 'Participants', type: 'list' },
  { key: 'purseBalance', label: 'Purse Balance', type: 'currency' },
  { key: 'tournamentPoints', label: 'Total Points', type: 'number' },
  { key: '', label: '', type: 'icon', iconPath: '/detail' },
]

function TeamList() {
  const [tableData, setTableData] = useState<CricTableRow[]>([])
  const [teamList, setTeamList] = useState<TeamEntity[]>([])
  const { markActiveTeam } = useTournament()
  const router = useRouter()

  const teamRequest = useRequest(TEAMS.GET_ALL_TEAMS, NO_CACHE)
  const teamResponse: CricResponse<TeamEntity[]> = teamRequest.data as CricResponse<TeamEntity[]>

  useEffect(() => {
    if (teamResponse?.result) {
      prepareTableData(teamResponse.result)
    }
  }, [teamResponse])

  const prepareTableData = (teamsResponse: TeamEntity[]) => {
    if (teamsResponse.length) {
      const tempTableData: CricTableRow[] = prepareTeamTable(teamsResponse, headersList)
      setTableData(tempTableData)
      setTeamList(teamsResponse)
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
    <div className='p-5'>
      <CricTable
        headerList={headersList}
        rowList={tableData}
        defOrder={'desc'}
        defOrderBy={'tournamentPoints'}
        fullWidth={false}
        onRowSelect={navigateToTeamDetail}
      />
    </div>
  )
}

export default TeamList
