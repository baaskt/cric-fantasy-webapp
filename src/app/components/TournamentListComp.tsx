import React from 'react'
import TournamentCard from './TournamentCardComp'
import EmptyData from './EmptyData'
import { TOURNAMENT_URL } from '@/util/constants/endpoints'
import { useRequest } from '@/hooks/useRequest'
import { CricResponse } from '@/model/types/cric-response.type'
import { TournamentEntity } from '@/model/response/tournament.interface'
import Loading from './Loading'
import { TOURNAMENT } from '@/util/constants/constants'

function TournamentList() {
  const tournamentRequest = useRequest(TOURNAMENT_URL)
  const tournamentResponse: CricResponse<TournamentEntity[]> =
    tournamentRequest.data as CricResponse<TournamentEntity[]>
  const cardsData = tournamentResponse?.result

  if (tournamentRequest.isLoading) {
    return <Loading txt={TOURNAMENT.LOADING_TXT}></Loading>
  }

  if (tournamentRequest.error) {
    return <p>Error: {tournamentRequest.error.message}</p>
  }

  if (!cardsData?.length)
    return (
      <EmptyData
        title={TOURNAMENT.NO_DATA_TITLE}
        subTitle={TOURNAMENT.NO_DATA_SUB}
      />
    )

  return (
    <div className='mt-5'>
      <div>{cardsData?.length} results</div>
      <div className='flex flex-col gap-4 mt-5 mb-5'>
        {cardsData?.map(ttEntity => (
          <TournamentCard
            key={ttEntity.tournamentId}
            tournamentData={ttEntity}
          />
        ))}
      </div>
    </div>
  )
}

export default TournamentList
