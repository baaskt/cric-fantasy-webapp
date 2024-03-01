import { TournamentEntity } from '@/model/response/tournament.interface'
import { COLORS } from '@/util/colors'
import { Typography } from '@mui/material'
import Image from 'next/image'
import EventIcon from '@mui/icons-material/Event'
import IconMenu from './IconMenu'
import PlaceIcon from '@mui/icons-material/Place'

type TournamentCardProps = {
  tournamentData: TournamentEntity
}

const TournamentCard = (props: TournamentCardProps) => {
  const tournamentData: TournamentEntity = props.tournamentData
  const {
    imgUrl,
    tournamentName,
    tournamentStartDate,
    tournamentEndDate,
    tournamentLocation,
  } = tournamentData
  return (
    <div className='card flex flex-row justify-start max-w-[80%]'>
      <Image
        src={imgUrl}
        width={0}
        height={0}
        alt='Brand Logo'
        style={{ width: 440, height: 220 }}
        placeholder='blur'
        blurDataURL={'/assets/images/tournament.png'}
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
        <IconMenu
          icon={<PlaceIcon />}
          label1={tournamentLocation}
          color={COLORS.cricLabel}
        />
      </div>
    </div>
  )
}

export default TournamentCard
