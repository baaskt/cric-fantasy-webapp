import React, { useEffect } from 'react'
import TournamentCard from './TournamentCard'
import EmptyData from '../EmptyData'
import { TOURNAMENTS } from '@/util/constants/endpoints'
import { useRequest } from '@/hooks/useRequest'
import { CricResponse } from '@/model/types/cric-response.type'
import { TournamentEntity } from '@/model/response/tournament.interface'
import Loading from '../Loading'
import { TOURNAMENT } from '@/util/constants/constants'
import { OptionsEntity } from '@/model/entities/options.interface'
import { useTournament } from '@/providers/TournamentProvider'
import { COLORS } from '@/util/colors'

type TournamentListProps = {
  selectedTab: OptionsEntity
}

function TournamentList(props: TournamentListProps) {
  const { tournamentList, setTournamentList } = useTournament()
  const TOURNAMENT_URL = `${TOURNAMENTS.GET_ALL_URL}${props.selectedTab?.id === 1 ? false : true}`
  const tournamentRequest = useRequest(TOURNAMENT_URL)
  const tournamentResponse: CricResponse<TournamentEntity[]> =
    tournamentRequest.data as CricResponse<TournamentEntity[]>

  useEffect(() => {
    if (tournamentResponse?.result) {
      const sortedTournamentList = sortByStartDateDesc(tournamentResponse?.result)
      setTournamentList(sortedTournamentList)
    }
  }, [tournamentResponse?.result])

  const sortByStartDateDesc = (data: TournamentEntity[]) => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.tournamentStartDate ?? 0).getTime()
      const dateB = new Date(b.tournamentStartDate ?? 0).getTime()
      return dateB - dateA
    })
  }

  if (tournamentRequest.isLoading) {
    return <Loading txt={TOURNAMENT.LOADING_TXT}></Loading>
  }

  if (tournamentRequest.error) {
    return <p>Error: {tournamentRequest.error.message}</p>
  }

  if (!tournamentList?.length)
    return <EmptyData title={TOURNAMENT.NO_DATA_TITLE} subTitle={TOURNAMENT.NO_DATA_SUB} />

  return (
    <div className='mt-5'>
      <div className='pb-5' style={{ color: COLORS.cricPrimary }}>
        {tournamentList?.length} {tournamentList?.length > 1 ? 'results' : 'result'}
      </div>
      <div className='flex flex-col gap-4 mb-5'>
        {tournamentList?.map(ttEntity => (
          <TournamentCard key={ttEntity.tournamentId} tournamentData={ttEntity} />
        ))}
      </div>
    </div>
  )
}

export default TournamentList
