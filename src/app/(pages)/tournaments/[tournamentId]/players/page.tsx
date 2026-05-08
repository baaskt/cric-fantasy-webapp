'use client'
import Loading from '@/components/Loading'
import PlayersList from '@/components/players/PlayersList'
import CricSelect from '@/components/ui/CricSelect'
import CricTab from '@/components/ui/CricTab'
import { useRequest } from '@/hooks/useRequest'
import { OptionsEntity } from '@/model/entities/options.interface'
import { TeamEntity } from '@/model/response/team.interface'
import { CricResponse } from '@/model/types/cric-response.type'
import { useAuth } from '@/providers/AuthProvider'
import { useTournament } from '@/providers/TournamentProvider'
import { TEAMS } from '@/util/constants/endpoints'
import { useEffect, useState } from 'react'

const tabOptions: OptionsEntity[] = [
  { id: 1, label: 'All' },
  { id: 2, label: 'Batsman', value: 'Batter' },
  { id: 3, label: 'Bowler', value: 'Bowler' },
  { id: 4, label: 'Unsold', value: 'UNSOLD' },
  { id: 5, label: 'Replacement', value: 'Replacement' },
  { id: 6, label: 'Tender Sold', value: 'Tender' },
  { id: 7, label: 'Tender Unsold', value: 'TENDER_UNSOLD' },
]

export default function Players() {
  const { activeTournament } = useTournament()
  const tournamentId = activeTournament?.tournamentId || ''
  const { user } = useAuth()
  const [teamsList, setTeamsList] = useState<OptionsEntity[]>([])
  const [selectedTab, setSelectedTab] = useState<OptionsEntity>(tabOptions[0])
  const [selectedTeam, setSelectedTeam] = useState<OptionsEntity>()
  const [defaultTeam, setDefaultTeam] = useState<OptionsEntity>()
  const allTeam = {
    id: -1,
    label: 'All Teams',
    value: -1,
  }
  const teamRequest = useRequest(tournamentId ? `${TEAMS.GET_ALL_TEAMS}${tournamentId}` : '')

  useEffect(() => {
    if (teamRequest.data) {
      const teamResponse: CricResponse<TeamEntity[]> = teamRequest.data as CricResponse<
        TeamEntity[]
      >
      if (teamResponse.result) {
        prepareTeamsList(teamResponse.result)
      }
    }
  }, [teamRequest.data, user])

  const prepareTeamsList = (teamData: TeamEntity[]) => {
    const tempTeamList: OptionsEntity[] = []
    tempTeamList.push(allTeam)
    teamData.forEach(team => {
      const tempTeam: OptionsEntity = {
        id: team.teamId,
        label: team.teamName,
        value: team.teamId,
      }
      if (team.teamMembers.find(member => member.id === user?.id)) {
        setDefaultTeam(tempTeam)
        handleTeamSelect(tempTeam)
      }
      tempTeamList.push(tempTeam)
    })
    if (!defaultTeam) {
      setDefaultTeam(allTeam)
      handleTeamSelect(allTeam)
    }
    setTeamsList(tempTeamList)
  }

  const handleTeamSelect = (newSelectedTeam: OptionsEntity) => {
    setSelectedTeam(newSelectedTeam)
  }

  if (teamRequest.isValidating || teamRequest.isLoading || !selectedTeam) {
    return <Loading txt={'Loading Filters'}></Loading>
  }

  return (
    <div>
      <div className='p-5'>
        <CricTab optionList={tabOptions} onChange={setSelectedTab}></CricTab>
      </div>
      {selectedTab.id !== 4 &&
        selectedTab.id !== 5 &&
        selectedTab.id !== 6 &&
        selectedTab.id !== 7 && (
          <div className='w-64 pl-5 flex justify-center items-center'>
            <CricSelect
              defaultValue={selectedTeam?.id || defaultTeam?.id}
              label={'Fantasy Team'}
              menuList={teamsList}
              onChange={handleTeamSelect}
            />
          </div>
        )}
      <PlayersList selectedTab={selectedTab} selectedTeam={selectedTeam} />
    </div>
  )
}
