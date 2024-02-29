import React from 'react'
import TournamentCard from './tournamentCard'
import EmptyData from './emptyData'
// import { TOURNAMENT_URL } from '@/util/constants/endpoints'
// import { useRequest } from '@/hooks/useRequest'

const cardsData = [
  {
    tournamentId: 1,
    tournamentName: 'Indian Premiere League 2024',
    tournamentStartDate: '2024-03-24T08:48:34.685496',
    tournamentLocation: 'India',
    imgUrl: 'assets/images/tournament.png',
  },
  {
    tournamentId: 2,
    tournamentName: 'Indian Premiere League 2024',
    tournamentLocation: 'India',
    imgUrl: 'assets/images/tournament.png',
  },
  {
    tournamentId: 3,
    tournamentName: 'Indian Premiere League 2024',
    tournamentStartDate: '2024-03-24T08:48:34.685496',
    imgUrl: 'assets/images/tournament.png',
  },
  {
    tournamentId: 4,
    tournamentName: 'Indian Premiere League 2024',
    tournamentStartDate: '2024-03-24T08:48:34.685496',
    tournamentLocation: 'India',
    imgUrl: 'assets/images/tournament.png',
  },
  {
    tournamentId: 5,
    tournamentName: 'Indian Premiere League 2024',
    tournamentStartDate: '2024-03-24T08:48:34.685496',
    tournamentLocation: 'India',
    imgUrl: 'assets/images/tournament.png',
  },
]

function TournamentList() {
  //   const { data, error } = useRequest(TOURNAMENT_URL)
  if (!cardsData?.length) return <EmptyData />

  return (
    <div className='mt-5'>
      <div>{cardsData?.length} results</div>
      <div className='flex flex-col gap-4 mt-5 mb-5'>
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
