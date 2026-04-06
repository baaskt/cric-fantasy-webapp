import { SquadEntity } from '@/model/entities/squad.interface'
import React, { useMemo, useState } from 'react'
import SquadPortfolio from './SquadPortfolio'
import PlayingXI from './PlayingXI'
import { COLORS } from '@/util/colors'
import WindowIcon from '@mui/icons-material/Window'
import ListIcon from '@mui/icons-material/List'
import { groupPlayersByRole } from '@/util/player'
import { useMatch } from '@/providers/MatchProvider'

interface TeamViewProps {
  squad: SquadEntity[]
  isXIChangeAllowed: boolean
  teamId: string
}

function TeamView(props: TeamViewProps) {
  const { upcomingMatches } = useMatch()
  const { squad, isXIChangeAllowed, teamId } = props
  const [isListView, setIsListView] = useState<boolean>(true)
  const groupedSquad = useMemo(() => groupPlayersByRole(squad), [squad])

  return (
    <div className='p-2 w-full'>
      <div className='flex justify-end gap-4'>
        <div
          onClick={() => setIsListView(true)}
          className={`${isListView ? 'bg-violet-200' : ''} rounded-lg flex items-center p-2 gap-2`}
        >
          <ListIcon sx={{ color: COLORS.cricPrimary }} /> List
        </div>
        <div
          onClick={() => setIsListView(false)}
          className={`${!isListView ? 'bg-violet-200' : ''} rounded-lg flex items-center p-2 gap-2`}
        >
          <WindowIcon sx={{ color: COLORS.cricPrimary }} /> Grid
        </div>
      </div>
      {isListView ? (
        <PlayingXI
          squad={squad}
          isXIChangeAllowed={isXIChangeAllowed}
          teamId={teamId}
          upcomingMatches={upcomingMatches}
        />
      ) : (
        <SquadPortfolio groupedSquad={groupedSquad} />
      )}
    </div>
  )
}

export default TeamView
