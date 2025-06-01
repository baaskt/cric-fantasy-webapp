import React, { useEffect, useState } from 'react'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import { COLORS } from '@/util/colors'
import PlayerCard from '../PlayerCard'
import { useTournament } from '@/providers/TournamentProvider'
import { TournamentStatsEntity } from '@/model/response/tournament.interface'
import { convertToSentenceCase } from '@/util/helper'

function TournamentStats() {
  const { activeTournament } = useTournament()
  const [statData, setStatData] = useState<TournamentStatsEntity>()

  useEffect(() => {
    if (activeTournament?.stats) {
      setStatData(activeTournament.stats)
    }
  }, [activeTournament])

  if (!statData) return <></>

  return (
    <div className='flex flex-col'>
      <div className='flex gap-1 items-center'>
        <AutoFixHighIcon style={{ color: COLORS.cricPrimary }} />
        <div className='text-xl p-1'>Stat Pack</div>
      </div>
      <div className='flex flex-col gap-4 mt-4'>
        {Object.entries(statData).map(([category, players]) => (
          <div key={category}>
            <div className='text-xl mb-2'>{convertToSentenceCase(category)}</div>
            <div className='flex flex-wrap md:gap-2'>
              {players?.map(player => (
                <PlayerCard
                  key={player.playerId}
                  name={player.name}
                  imageUrl={player.imageUrl}
                  points={player.value.toString()}
                  showPoints={true}
                  hidePointsLabel={true}
                ></PlayerCard>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TournamentStats
