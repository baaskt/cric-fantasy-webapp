import { TeamPointsEntity } from '@/model/response/team-points.interface'
import React, { useEffect, useState } from 'react'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
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
    let data: SpinPlayersListEntity[] = []
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
    data = data.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
    setSpinData(data)
  }

  if (!spinData?.length) return <></>

  return (
    <div className='flex flex-col mt-4'>
      <div className='flex gap-1 p-2 items-center'>
        <AutoFixHighIcon style={{ color: COLORS.cricPrimary }} />
        <div className='text-xl p-1'>Spin Wizards</div>
      </div>
      <div className='flex flex-wrap md:gap-2'>
        {spinData?.map(player => (
          <PlayerCard
            key={player.playerId}
            name={player.name}
            imageUrl={player.imageUrl}
            clubName={player.clubName}
            points={player.totalPoints ? player.totalPoints.toString() : ''}
            teamName={player.teamName}
            showPoints={true}
          ></PlayerCard>
        ))}
      </div>
    </div>
  )
}

export default SpinWizards
