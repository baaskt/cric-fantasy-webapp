import { useRequest } from '@/hooks/useRequest'
import { TeamEntity } from '@/model/response/team.interface'
import { CricResponse } from '@/model/types/cric-response.type'
import { CricHeaderRow, CricTableRow } from '@/model/types/cric-table.type'
import { TEAMS } from '@/util/constants/endpoints'
import { prepareTeamTable } from '@/util/helper'
import React, { useEffect, useState } from 'react'
import CricTable from './ui/CricTable'
import Loading from './Loading'
import { TEAM } from '@/util/constants/constants'

const headersList: CricHeaderRow[] = [
  { key: 'pos', label: 'Position', type: 'number' },
  { key: 'teamName', label: 'Team', type: 'string' },
  { key: 'teamMembers', label: 'Participants', type: 'number' },
  { key: 'purseBalance', label: 'Purse Balance', type: 'number' },
  { key: 'tournamentPoints', label: 'Total Points', type: 'number' },
  { key: '', label: '', type: 'icon', iconPath: '/detail' },
]

function TeamList() {
  const [tableData, setTableData] = useState<CricTableRow[]>([])

  const teamRequest = useRequest(TEAMS.GET_ALL_TEAMS)
  const teamResponse: CricResponse<TeamEntity[]> = teamRequest.data as CricResponse<TeamEntity[]>

  useEffect(() => {
    if (teamResponse?.result) {
      prepareTableData(teamResponse.result)
    }
  }, [teamResponse])

  const prepareTableData = (teamList: TeamEntity[]) => {
    if (teamList.length) {
      const tempTableData: CricTableRow[] = prepareTeamTable(teamList, headersList)
      setTableData(tempTableData)
    }
  }

  if (teamRequest.isLoading) {
    return <Loading txt={TEAM.LOADING_TXT}></Loading>
  }

  if (!teamResponse?.result?.length) {
    return <p className='p-5'>No teams found</p>
  }

  return (
    <div className='p-5'>
      <CricTable headerList={headersList} rowList={tableData} />
    </div>
  )
}

export default TeamList
