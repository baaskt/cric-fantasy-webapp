import { SquadEntity } from '@/model/entities/squad.interface'
import React from 'react'
import PlayerCard from '../PlayerCard'

type SquadPortfolioProps = {
  squad: SquadEntity[]
}

function SquadPortfolio(props: SquadPortfolioProps) {
  const { squad } = props
  return (
    <div className='mt-5 flex gap-5'>
      {squad.map(player => (
        <PlayerCard key={player.playerId} playerData={player} showPrice={true} />
      ))}
    </div>
  )
}

export default SquadPortfolio
