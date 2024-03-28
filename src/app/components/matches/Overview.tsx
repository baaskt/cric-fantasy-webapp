import { MatchDetailEntity } from '@/model/response/match-detail.interface'
import { useTournament } from '@/providers/TournamentProvider'
import { getTeamColors } from '@/util/helper'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import POMCard from './POMCard'
import MatchScore from './MatchScore'

type OverviewProps = {
  scoreCardData: MatchDetailEntity | undefined
}

function Overview(props: OverviewProps) {
  const { scoreCardData } = props
  const inningsOne = scoreCardData?.inningsOne
  const inningsTwo = scoreCardData?.inningsTwo
  const { activeMatch } = useTournament()
  const team1Url = activeMatch?.team1Image || ''
  const team2Url = activeMatch?.team2Image || ''
  const [gradientColor, setGradientColor] = useState('')

  useEffect(() => {
    if (activeMatch) {
      console.log(activeMatch?.team1SName)
      const bannerColor = getTeamColors(activeMatch?.team1SName, activeMatch?.team2SName)
      console.log(bannerColor)
      setGradientColor(bannerColor)
    }
  }, [activeMatch])

  if (!gradientColor) return
  console.log(gradientColor)

  return (
    <div>
      <div className={`p-5 ${gradientColor}`}>
        <div className='flex items-end w-full justify-around'>
          <div className='flex flex-col items-center'>
            <Image
              src={team1Url}
              alt='team1'
              width='0'
              height='0'
              sizes='100vw'
              className='w-[100px] h-auto md:w-[180px]'
            />
            <div className='pt-5 text-center text-md md:text-xl'>{activeMatch?.team1}</div>
            {inningsOne && <MatchScore score={inningsOne.score} />}
          </div>
          <div className='flex flex-col items-center'>
            <Image
              src={team2Url}
              alt='team1'
              width='0'
              height='0'
              sizes='100vw'
              className='w-[100px] h-auto md:w-[180px]'
            />
            <div className='pt-5 text-center text-md md:text-xl'>{activeMatch?.team2}</div>
            {inningsTwo && <MatchScore score={inningsTwo.score} />}
          </div>
        </div>
        <div className='text-center text-lg mt-5 md:text-2xl'>{scoreCardData?.status}</div>
      </div>
      {scoreCardData && (
        <div className='flex flex-row justify-center gap-5'>
          <POMCard
            title={'Player of the Match'}
            isMatchComplete={scoreCardData.isMatchComplete}
            playerData={scoreCardData.playerOfTheMatch}
          />
          <POMCard
            title={'Jury Player of the Match'}
            isMatchComplete={scoreCardData.isMatchComplete}
            playerData={scoreCardData.peoplePlayerOfTheMatch}
          />
        </div>
      )}
    </div>
  )
}

export default Overview
