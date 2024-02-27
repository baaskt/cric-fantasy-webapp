import React from 'react'
import TournamentCard from './tournamentCard'
// import { TOURNAMENT_URL } from '@/util/constants/endpoints'
// import { useRequest } from '@/hooks/useRequest'

const cardsData = [
  {
    tournamentId: 1,
    tournamentName: 'Card 1',
    tournamentStartDate: '2024-03-24T08:48:34.685496',
    tournamentLocation: 'India',
    imgUrl: 'assets/images/tournament.png',
  },
  {
    tournamentId: 2,
    tournamentName: 'Card 2',
    tournamentStartDate: '2024-03-24T08:48:34.685496',
    tournamentLocation: 'India',
    imgUrl: '/logo.png',
  },
  {
    tournamentId: 3,
    tournamentName: 'Card 3',
    tournamentStartDate: '2024-03-24T08:48:34.685496',
    tournamentLocation: 'India',
    imgUrl: '/banner_logo.png',
  },
]

function TournamentList() {
  //   const { data, error } = useRequest(TOURNAMENT_URL)
  return (
    <div className='mt-5'>
      {cardsData?.length} results
      <div className='flex flex-col gap-2 mt-5'>
        {cardsData.map(ttEntity => (
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
