import { TournamentEntity } from '@/model/entities/tournament.interface'
import { Card, CardActionArea, CardContent, Typography } from '@mui/material'
import Image from 'next/image'

type TournamentCardProps = {
  tournamentData: TournamentEntity
}

const TournamentCard = (props: TournamentCardProps) => {
  const tournamentData: TournamentEntity = props.tournamentData
  return (
    <Card className='flex'>
      <CardActionArea className='flex flex-row justify-start'>
        <Image
          src={tournamentData.imgUrl}
          width={0}
          height={0}
          sizes='100vw'
          alt='Brand Logo'
          style={{ width: 'auto', height: 220 }}
          unoptimized
        />
        <CardContent>
          <Typography gutterBottom variant='h6' component='div'>
            {tournamentData.tournamentName}
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            {tournamentData.tournamentStartDate}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {tournamentData.tournamentLocation}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default TournamentCard
