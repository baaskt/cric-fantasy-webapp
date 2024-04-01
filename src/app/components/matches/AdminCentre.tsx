import { OptionsEntity } from '@/model/entities/options.interface'
import { MatchDetailEntity } from '@/model/response/match-detail.interface'
import React, { useEffect, useState } from 'react'
import CricSelect from '../ui/CricSelect'

type AdminCentreProps = {
  scoreCardData: MatchDetailEntity
}

function AdminCentre(props: AdminCentreProps) {
  const { scoreCardData } = props
  const [playersList, setPlayersList] = useState<OptionsEntity[]>([])
  //   const [juryPlayer, setJuryPlayer] = useState<POMEntity>(scoreCardData.peoplePlayerOfTheMatch)

  useEffect(() => {
    if (scoreCardData) {
      const tempPlayersList: OptionsEntity[] = []
      const inningsOnePlayers = scoreCardData.inningsOne.batting
      const inningsTwoPlayers = scoreCardData.inningsTwo.batting
      const totalPlayers = [...inningsOnePlayers, ...inningsTwoPlayers]
      totalPlayers.forEach(player => {
        const tempPlayer: OptionsEntity = {
          id: player.batId,
          label: player.batName,
          value: player.batId,
        }
        tempPlayersList.push(tempPlayer)
      })
      setPlayersList(tempPlayersList)
    }
  }, [scoreCardData])

  const handlePlayerSelect = (selectedPlayer: OptionsEntity) => {
    console.log(selectedPlayer)
  }

  return (
    <div>
      <div>
        <div className='flex gap-2'>
          <div>Players</div>
          <div>Dots</div>
        </div>
        <div className='w-48'>
          <CricSelect
            label={'Select Jury Player'}
            menuList={playersList}
            onChange={handlePlayerSelect}
          />
        </div>
      </div>
    </div>
  )
}

export default AdminCentre
