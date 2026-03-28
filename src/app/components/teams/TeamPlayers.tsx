import React, { useEffect, useMemo, useState } from 'react'
import CricTab from '../ui/CricTab'
import { OptionsEntity } from '@/model/entities/options.interface'
import { useAuth } from '@/providers/AuthProvider'
import { TeamDetailEntity } from '@/model/response/team-detail.interface'
import MatchHistory from './MatchHistory'
import TeamView from './TeamView'
import { useTournament } from '@/providers/TournamentProvider'
import { MATCHES } from '@/util/constants/endpoints'
import { useRequest } from '@/hooks/useRequest'
import { MatchEntity } from '@/model/response/match.response'
import { CricResponse } from '@/model/types/cric-response.type'
import MatchCardPreview from '../matches/MatchCardPreview'
import CricAnimatedDots from '../ui/CricAnimatedDots'
import PlayingXIHistory from '../players/PlayingXIHistory'

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
  const { activeTournament } = useTournament()
  const tournamentId = activeTournament?.tournamentId || ''
  const matchRequest = useRequest(tournamentId ? `${MATCHES.GET_ALL}${tournamentId}` : '')

  const [upcomingMatches, setUpcomingMatches] = useState<MatchEntity[]>([])

  useEffect(() => {
    if (matchRequest.data) {
      const matchresponse: CricResponse<MatchEntity[]> = matchRequest.data as CricResponse<
        MatchEntity[]
      >
      if (matchresponse.result) {
        const top2Upcoming = matchresponse.result
          .filter(item => item.state === 'Upcoming')
          .slice(0, 3)
        setUpcomingMatches(top2Upcoming)
      }
    }
  }, [matchRequest?.data])

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
      {matchRequest.isLoading ? (
        <CricAnimatedDots></CricAnimatedDots>
      ) : (
        <>
          {upcomingMatches.length ? <div className='font-bold'>Upcoming matches</div> : null}
          <div className='flex flex-row flex-wrap justify-center gap-3 p-5'>
            {upcomingMatches.map((matchEntity, matchIndex) => (
              <MatchCardPreview
                key={matchIndex}
                matchEntity={matchEntity}
                matchNumber={matchIndex + 1}
              ></MatchCardPreview>
            ))}
          </div>
        </>
      )}
      <div className='bg-white border-b'>
        <CricTab optionList={updatedTabs} selectedTab={selectedTab} onChange={handleChange} />
      </div>

      <div className='flex'>
        {selectedTab.id === 1 ? (
          <TeamView
            squad={squad}
            isXIChangeAllowed={isTeamOwner}
            teamId={teamId}
            upcomingMatches={upcomingMatches}
          />
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
