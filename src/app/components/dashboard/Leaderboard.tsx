import React, { useEffect, useState } from 'react'
import CricTable from '../ui/CricTable'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import { COLORS } from '@/util/colors'
import { convertUtcToLocal } from '@/util/helper'
import { TeamPointsEntity } from '@/model/response/team-points.interface'
import { CricHeaderRow, CricTableRow } from '@/model/types/cric-table.type'
import { prepareTableData } from '@/util/tables/table'
import { TableType } from '@/model/enum/table-type.enum'
import { useRouter } from 'next/navigation'
import { useTeam } from '@/providers/TeamProvider'

const headersList: CricHeaderRow[] = [
  { key: 'expand', label: '', alias: '', type: 'expand', isMobile: true },
  { key: 'position', label: 'Position', alias: 'Pos', type: 'stock', isMobile: true },
  { key: 'teamName', label: 'Team', type: 'string', isMobile: true },
  { key: 'points', label: 'Match Points', alias: '', type: 'number', isMobile: false },
  { key: 'statPoints', label: 'Milestone Points', alias: '', type: 'number', isMobile: false },
  { key: 'tournamentPoints', label: 'Total Points', alias: 'Pts', type: 'stock', isMobile: true },
  { key: '', label: 'View Team Details', type: 'icon', iconPath: '/detail' },
]

type LeaderboardProps = {
  teamList: TeamPointsEntity[]
}
function Leaderboard(props: LeaderboardProps) {
  const { teamList } = props
  const { markActiveTeam } = useTeam()
  const router = useRouter()
  const [tableData, setTableData] = useState<CricTableRow[]>([])

  useEffect(() => {
    if (teamList?.length) {
      prepareTableRows(teamList)
    }
  }, [teamList])

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
    }
  }

  const navigateToTeamDetail = (teamId: string | number) => {
    const selectedTeam = teamList.find(team => team.teamId === teamId)
    if (selectedTeam) markActiveTeam(teamId.toString())
    router.push('teams/detail')
  }

  return (
    <>
      <div className='flex gap-2 p-3 flex-col md:flex-row'>
        <div className='flex gap-2 items-center'>
          <LeaderboardIcon style={{ color: COLORS.cricPrimary }} />
          <div className='text-xl'>Leaderboard</div>
        </div>
        {teamList[0].pointsUpdatedAt && (
          <div className='text-sm italic text-gray-500 md:text-lg'>{`( Last updated : ${convertUtcToLocal(teamList[0].pointsUpdatedAt)} )`}</div>
        )}
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
    </>
  )
}

export default Leaderboard
