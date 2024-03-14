import { TournamentEntity } from '@/model/response/tournament.interface'
import { COLORS } from '@/util/colors'
import { Typography } from '@mui/material'
import Image from 'next/image'
import EventIcon from '@mui/icons-material/Event'
import IconMenu from '../IconMenu'
import PlaceIcon from '@mui/icons-material/Place'
import TournamentStatus from './TournamentStatus'
import { MouseEvent, useState } from 'react'
import TournamentAction from './TournamentAction'
import { useTournament } from '@/providers/TournamentProvider'
import { useRouter } from 'next/navigation'

type TournamentCardProps = {
  tournamentData: TournamentEntity
}

const TournamentCard = (props: TournamentCardProps) => {
  const { markActiveTournament } = useTournament()
  const router = useRouter()
  const tournamentData: TournamentEntity = props.tournamentData
  const {
    imgUrl,
    tournamentName,
    tournamentStartDate,
    tournamentEndDate,
    tournamentLocation,
    tournamentStatus,
    tournamentId,
  } = tournamentData
  const ALTERNATE_IMAGE_SRC = '/assets/images/default_img.jpg'
  const [imgSrc, setImgSrc] = useState(imgUrl ? imgUrl : ALTERNATE_IMAGE_SRC)

  const viewTournament = (event: MouseEvent<HTMLDivElement>) => {
    console.log(event)
    markActiveTournament(tournamentData)
    router.push(`${'tournaments'}/${tournamentId}/dashboard`)
  }

  return (
    <div
      className='card flex flex-row justify-between cursor-pointer'
      onClick={e => viewTournament(e)}
    >
      <div className='flex flex-row'>
        <Image
          src={imgSrc}
          width={0}
          height={0}
          alt='Tournament Banner'
          style={{ width: 400, height: 220 }}
          onError={() => setImgSrc(ALTERNATE_IMAGE_SRC)}
          unoptimized
        />
        <div className='p-5'>
          <Typography variant='h6' component='div'>
            {tournamentName}
          </Typography>
          <IconMenu
            icon={<EventIcon />}
            label1={tournamentStartDate}
            label2={tournamentEndDate}
            separator='to'
            color={COLORS.cricPrimary}
            type={'date'}
          />
          <IconMenu icon={<PlaceIcon />} label1={tournamentLocation} color={COLORS.cricLabel} />
        </div>
      </div>
      <div className='flex flex-col justify-between items-center p-5'>
        <TournamentStatus status={tournamentStatus}></TournamentStatus>
        <TournamentAction tournamentData={tournamentData}></TournamentAction>
      </div>
    </div>
  )
}

export default TournamentCard
