import React, { useMemo, useState } from 'react'
import CricTab from '../ui/CricTab'
import { OptionsEntity } from '@/model/entities/options.interface'
import PlayingXI from './PlayingXI'
import SquadPortfolio from './SquadPortfolio'
import { useAuth } from '@/providers/AuthProvider'
import { TeamDetailEntity } from '@/model/response/team-detail.interface'
import { groupPlayersByRole } from '@/util/player'
import MatchHistory from './MatchHistory'

const tabOptions: OptionsEntity[] = [
  { id: 1, label: 'Playing XI', value: 'PlayingXI' },
  { id: 2, label: 'Squad', value: 'Squad' },
  { id: 3, label: 'Match History', value: 'History' },
]

type TeamPlayersProps = {
  teamDetail: TeamDetailEntity
  matchHistory: MatchHistoryDetails[]
}

function TeamPlayers(props: TeamPlayersProps) {
  const { matchHistory, teamDetail } = props
  const { squad, teamMembers, teamId } = teamDetail
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState<OptionsEntity>(tabOptions[0])

  const handleChange = (selectedEntity: OptionsEntity) => {
    setSelectedTab(selectedEntity)
  }

  const findTabsSubText = () => {
    const updatedTabs = [...tabOptions]
    updatedTabs.forEach(tab => {
      // const playingXICount = squad.filter(player => player.playingXI).length
      tab.subText = tab.id === 2 ? `(${squad.length})` : ''
    })
    return updatedTabs
  }

  const findTeamOwner = (): boolean => {
    const teamMemberIndex = teamMembers.findIndex(member => member.id === user?.id)
    return teamMemberIndex !== -1 ? true : false
  }

  const isTeamOwner = useMemo(() => findTeamOwner(), [teamMembers, user])
  const updatedTabs = useMemo(() => findTabsSubText(), [squad])
  const groupedSquad = useMemo(() => groupPlayersByRole(squad), [squad])

  if (!updatedTabs) return <>Loading</>

  return (
    <div className='flex flex-col h-screen'>
      <div className='bg-white border-b'>
        <CricTab optionList={updatedTabs} selectedTab={selectedTab} onChange={handleChange} />
      </div>

      <div className='flex'>
        {selectedTab.id === 1 ? (
          <PlayingXI squad={squad} isXIChangeAllowed={isTeamOwner} teamId={teamId} />
        ) : selectedTab.id === 2 ? (
          <SquadPortfolio groupedSquad={groupedSquad} />
        ) : selectedTab.id === 3 ? (
          <MatchHistory matchHistory={matchHistory} />
        ) : null}
      </div>
    </div>
  )
}

export default TeamPlayers
