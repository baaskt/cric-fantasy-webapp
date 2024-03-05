import React from 'react'
import TournamentAdminActionBtn from './TournamentAdminActionBtn'
import TournamentUserActionBtn from './TournamentUserActionBtn'
import { TournamentEntity } from '@/model/response/tournament.interface'

type TournamentActionProps = {
  tournamentData: TournamentEntity
}

function TournamentAction(props: TournamentActionProps) {
  const { isHost } = props.tournamentData
  return (
    <div className='flex flex-row gap-2 items-center'>
      {
        <TournamentUserActionBtn
          tournamentData={props.tournamentData}
        ></TournamentUserActionBtn>
      }
      {isHost && (
        <TournamentAdminActionBtn
          tournamentData={props.tournamentData}
        ></TournamentAdminActionBtn>
      )}
    </div>
  )
}

export default TournamentAction
