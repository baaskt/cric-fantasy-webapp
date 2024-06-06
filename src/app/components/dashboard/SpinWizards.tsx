import { TeamPointsEntity } from '@/model/response/team-points.interface'
import React, { useEffect, useState } from 'react'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import { COLORS } from '@/util/colors'
import PlayerCard from '../PlayerCard'
import { SpinPlayersListEntity } from '@/model/entities/spin-players.interface'

type SpinWizardsProps = {
  teamList: TeamPointsEntity[]
}

function SpinWizards(props: SpinWizardsProps) {
  const { teamList } = props
  const [spinData, setSpinData] = useState<SpinPlayersListEntity[]>([])

  useEffect(() => {
    if (teamList?.length) {
      prepareSpinData()
    }
  }, [teamList])

  const prepareSpinData = () => {
    const data: SpinPlayersListEntity[] = []
    teamList.forEach(teamEntity => {
      const spinPlayer = teamEntity.spinPlayer?.length ? teamEntity.spinPlayer[0] : null
      if (spinPlayer) {
        const tempSpinData: SpinPlayersListEntity = {
          imageUrl: spinPlayer.imageUrl,
          name: spinPlayer.name,
          playerId: spinPlayer.playerId,
          totalPoints: spinPlayer.totalPoints,
          clubName: spinPlayer.clubName,
          teamName: teamEntity.teamName,
        }
        data.push(tempSpinData)
      }
    })
    setSpinData(data)
  }

  return (
    <div className='flex gap-2 p-3 flex-col'>
      <div className='flex gap-2 items-center'>
        <CardGiftcardIcon style={{ color: COLORS.cricPrimary }} />
        <div className='text-xl'>Spin Wizards</div>
      </div>
      <div className='flex gap-5 flex-wrap'>
        {spinData?.map(player => (
          <PlayerCard
            key={player.playerId}
            name={player.name}
            imageUrl={player.imageUrl}
            clubName={player.clubName}
            points={player.totalPoints ? player.totalPoints.toString() : ''}
            teamName={player.teamName}
          ></PlayerCard>
        ))}
      </div>
    </div>
  )
}

export default SpinWizards
