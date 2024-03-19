import { SquadEntity } from '@/model/entities/squad.interface'
import React from 'react'
import PlayerCard from '../PlayerCard'
import { getPlayerDisplayRole } from '@/util/player'

type SquadPortfolioProps = {
  groupedSquad: Map<string, SquadEntity[]>
}

function SquadPortfolio(props: SquadPortfolioProps) {
  const { groupedSquad } = props
  return (
    <div className='mt-5 flex flex-col gap-5'>
      {Array.from(groupedSquad).map(([role, roleList]) => (
        <div className='flex flex-col' key={role}>
          <div className='font-semibold pb-2'>
            {getPlayerDisplayRole(role, roleList.length)} ({roleList.length})
          </div>
          <div className='flex gap-5 flex-wrap'>
            {roleList.map(player => (
              <PlayerCard key={player.playerId} playerData={player} showPrice={true} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default SquadPortfolio
