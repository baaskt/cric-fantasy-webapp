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
import { prepareTableData } from '@/util/tables/table'
import { TableType } from '@/model/enum/table-type.enum'
import { useTeam } from '@/providers/TeamProvider'
import { useTournament } from '@/providers/TournamentProvider'

const headersList: CricHeaderRow[] = [
  { key: 'expand', label: '', alias: '', type: 'expand', isMobile: true },
  { key: 'pos', label: 'Position', alias: 'Pos', type: 'number', isMobile: true },
  { key: 'teamName', label: 'Team', type: 'string', isMobile: true },
  { key: 'teamMembers', label: 'Owners', type: 'list' },
  { key: 'purseBalance', label: 'Purse Balance', type: 'currency' },
  { key: 'tournamentPoints', label: 'Total Points', alias: 'Pts', type: 'number', isMobile: true },
  // { key: 'playingXI', label: 'Playing XI', type: 'number' }, // TODO: Disable after everyone sets their XI
  { key: '', label: 'View Team Details', type: 'icon', iconPath: '/detail' },
]

function TeamList() {
  const { activeTournament } = useTournament()
  const tournamentId = activeTournament?.tournamentId || ''
  const [tableData, setTableData] = useState<CricTableRow[]>([])
  const [teamList, setTeamList] = useState<TeamEntity[]>([])
  const { markActiveTeam } = useTeam()
  const router = useRouter()

  const teamRequest = useRequest(tournamentId ? `${TEAMS.GET_ALL_TEAMS}${tournamentId}` : '')
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
    if (selectedTeam) markActiveTeam(selectedTeam.teamId)
    router.push('teams/detail')
  }

  return (
    <CricTable
      headerList={headersList}
      rowList={tableData}
      defOrder={'desc'}
      defOrderBy={'tournamentPoints'}
      fullWidth={false}
      onRowSelect={navigateToTeamDetail}
    />
  )
}

export default TeamList
