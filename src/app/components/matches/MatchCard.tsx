import { MatchEntity } from '@/model/response/match.response'
import { COLORS } from '@/util/colors'
import { formatDateAndTime, getFirstLetters } from '@/util/helper'
import Image from 'next/image'
import React, { useMemo } from 'react'

type MatchCardProps = {
  matchEntity: MatchEntity
  matchNumber: number
}
function MatchCard(props: MatchCardProps) {
  const { matchDesc, startTime, team1, team2, team1Image, team2Image, state } = props.matchEntity
  const team1Shortname = getFirstLetters(team1)
  const team2Shortname = getFirstLetters(team2)

  const statusColor = useMemo(
    () =>
      state === 'complete' ? COLORS.sold : state === 'abandoned' ? COLORS.unsold : COLORS.cricDark,
    [state],
  )
  return (
    <div className='cursor-pointer shadow-lg rounded-lg p-5 min-w-64'>
      <div className='text-center font-bold'>{matchDesc}</div>
      <div className='text-center'>{formatDateAndTime(startTime)}</div>
      <div className='flex items-center pt-5'>
        <div className='flex items-center gap-3'>
          <Image src={team1Image ? team1Image : ''} alt='Club 1' width={40} height={40} />
          <div>{team1Shortname}</div>
        </div>
        <div className='pl-2 pr-2'>vs</div>
        <div className='flex items-center gap-3'>
          <Image src={team2Image ? team2Image : ''} alt='Club 2' width={40} height={40} />
          <div>{team2Shortname}</div>
        </div>
      </div>
      <div style={{ color: statusColor }} className='pt-5 font-semibold italic text-center'>
        {state}
      </div>
    </div>
  )
}

export default MatchCard
