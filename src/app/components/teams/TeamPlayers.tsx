import React, { useMemo, useState } from 'react'
import CricTab from '../ui/CricTab'
import { OptionsEntity } from '@/model/entities/options.interface'
import { useAuth } from '@/providers/AuthProvider'
import { TeamDetailEntity } from '@/model/response/team-detail.interface'
import MatchHistory from './MatchHistory'
import TeamView from './TeamView'

import PlayingXIHistory from '../players/PlayingXIHistory'
import { MatchHistoryDetails } from '@/model/response/match-history-response.interface'
import MatchPreviewList from '../matches/MatchPreviewList'

const tabOptions: OptionsEntity[] = [
  { id: 1, label: 'Squad', value: 'squad' },
  { id: 2, label: 'Match History', value: 'matchHistory' },
  // { id: 3, label: 'Playing XI History', value: 'playerHistory' },
]

type TeamPlayersProps = {
  teamDetail: TeamDetailEntity
  matchHistory: MatchHistoryDetails[]
}

function TeamPlayers(props: TeamPlayersProps) {
  const { matchHistory, teamDetail } = props
  const { squad, teamMembers, teamId, playingXIHistory } = teamDetail
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState<OptionsEntity>(tabOptions[0])

  const handleChange = (selectedEntity: OptionsEntity) => {
    setSelectedTab(selectedEntity)
  }

  const findTabsSubText = () => {
    const updatedTabs = [...tabOptions]
    updatedTabs.forEach(tab => {
      // const playingXICount = squad.filter(player => player.playingXI).length
      tab.subText = tab.id === 1 ? `(${squad.length})` : ''
    })
    return updatedTabs
  }

  const findTeamOwner = (): boolean => {
    const teamMemberIndex = teamMembers.findIndex(member => member.id === user?.id)
    return teamMemberIndex !== -1 ? true : false
  }

  const isTeamOwner = useMemo(() => findTeamOwner(), [teamMembers, user])
  const updatedTabs = useMemo(() => findTabsSubText(), [squad])

  if (!updatedTabs) return <>Loading</>

  return (
    <div className='flex flex-col'>
      <MatchPreviewList showUpcomingMatches></MatchPreviewList>
      <div className='bg-white border-b'>
        <CricTab optionList={updatedTabs} selectedTab={selectedTab} onChange={handleChange} />
      </div>

      <div className='flex'>
        {selectedTab.id === 1 ? (
          <TeamView squad={squad} isXIChangeAllowed={isTeamOwner} teamId={teamId} />
        ) : selectedTab.id === 2 ? (
          <MatchHistory matchHistory={matchHistory} />
        ) : selectedTab.id === 3 ? (
          <PlayingXIHistory squad={squad} playingXIHistory={playingXIHistory} />
        ) : null}
      </div>
    </div>
  )
}

export default TeamPlayers
