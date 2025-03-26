import { SquadEntity } from '@/model/entities/squad.interface'
import React from 'react'
import PlayerCard from '../PlayerCard'
import { PLAYER_ROLES } from '@/util/player'

type SquadPortfolioProps = {
  groupedSquad: Map<string, SquadEntity[]>
}

function SquadPortfolio(props: SquadPortfolioProps) {
  const { groupedSquad } = props

  return (
    <div className='mt-5 flex flex-col gap-5'>
      {PLAYER_ROLES.map(role => (
        <div className='flex flex-col' key={role}>
          {groupedSquad.get(role)?.length && (
            <div className='font-semibold pb-2'>
              {role} ({groupedSquad.get(role)?.length})
            </div>
          )}
          <div className='flex flex-wrap md:gap-2'>
            {groupedSquad
              .get(role)
              ?.map(player => (
                <PlayerCard
                  key={player.playerId}
                  name={player.name}
                  imageUrl={player.imageUrl}
                  soldAmount={player.soldAmount}
                  role={player.role}
                  clubName={player.clubSName}
                  showPrice={true}
                  desc={player.playingXI ? 'Playing XI' : 'Benched'}
                ></PlayerCard>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default SquadPortfolio
