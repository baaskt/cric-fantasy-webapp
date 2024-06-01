import { MatchEntity } from '@/model/response/match.response'
import { COLORS } from '@/util/colors'
import { formatDateAndTime } from '@/util/helper'
import Image from 'next/image'
import React, { useMemo } from 'react'
import ShieldIcon from '@mui/icons-material/Shield'

type MatchCardProps = {
  matchEntity: MatchEntity
  matchNumber: number
  onMatchSelect: (matchId: number) => void
}
function MatchCard(props: MatchCardProps) {
  const { matchId, matchDesc, startTime, team1SName, team2SName, team1Image, team2Image, state } =
    props.matchEntity

  const handleMatchSelect = () => {
    if (state !== 'Upcoming') {
      props.onMatchSelect(matchId)
    }
  }

  const statusColor = useMemo(
    () =>
      state === 'Complete' ? COLORS.sold : state === 'Abandon' ? COLORS.asterisk : COLORS.cricDark,
    [state],
  )

  return (
    <div
      className={`rounded-lg p-5 min-w-64 w-full md:w-64 ${state === 'Upcoming' ? 'border-solid border-2 border-slate-300 cursor-default' : 'shadow-lg cursor-pointer'}`}
      onClick={handleMatchSelect}
    >
      <div className='text-center font-bold'>{matchDesc}</div>
      <div className='text-center'>{formatDateAndTime(startTime)}</div>
      <div className='flex justify-center items-center pt-5'>
        <div className='flex items-center gap-3'>
          <TeamImg imgUrl={team1Image} />
          <div>{team1SName}</div>
        </div>
        <div className='pl-2 pr-2'>vs</div>
        <div className='flex items-center gap-3'>
          <TeamImg imgUrl={team2Image} />
          <div>{team2SName}</div>
        </div>
      </div>
      <div style={{ color: statusColor }} className='pt-5 font-semibold italic text-center'>
        {state}
      </div>
    </div>
  )
}

const TeamImg = ({ imgUrl }: { imgUrl: string }) => {
  return imgUrl ? (
    <Image src={imgUrl} alt='Club' width={40} height={40} />
  ) : (
    <ShieldIcon sx={{ color: COLORS.cricPrimary }} />
  )
}

export default MatchCard
