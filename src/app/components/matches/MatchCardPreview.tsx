import { MatchEntity } from '@/model/response/match.response'
import { COLORS } from '@/util/colors'
import Image from 'next/image'
import React from 'react'
import ShieldIcon from '@mui/icons-material/Shield'

type MatchCardPreviewProps = {
  matchEntity: MatchEntity
  matchNumber: number
}
function MatchCardPreview(props: MatchCardPreviewProps) {
  const { startTime, team1SName, team2SName, team1Image, team2Image } = props.matchEntity
  const date = new Date(startTime)
  const month = date.toLocaleString('en-US', { month: 'short' }) // Apr
  const day = date.getDate()
  return (
    <div
      className={`flex flex-row gap-4 rounded-lg w-full md:w-64 border-solid border-2 border-violet-200 cursor-default`}
    >
      <div className='flex flex-col text-center text-lg font-bold bg-violet-200 p-2'>
        <div>{month}</div>
        <div>{day}</div>
      </div>
      <div className='flex justify-center items-center'>
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

export default MatchCardPreview
