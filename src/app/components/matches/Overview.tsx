import { MatchDetailEntity } from '@/model/response/match-detail.interface'
import { getTeamColors } from '@/util/helper'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import POMCard from './POMCard'
import MatchScore from './MatchScore'
// import Confetti from 'react-confetti'
import { useMatch } from '@/providers/MatchProvider'

type OverviewProps = {
  scoreCardData: MatchDetailEntity | undefined
}

function Overview(props: OverviewProps) {
  const { scoreCardData } = props
  const inningsOne = scoreCardData?.inningsOne
  const inningsTwo = scoreCardData?.inningsTwo
  const { activeMatch } = useMatch()
  const team1Url = activeMatch?.team1Image || ''
  const team2Url = activeMatch?.team2Image || ''
  const [gradientColor, setGradientColor] = useState({ fromColor: '', toColor: '' })
  const team1DivRef = React.useRef<HTMLDivElement>(null)
  const team2DivRef = React.useRef<HTMLDivElement>(null)
  // const isInnings1Won =
  //   inningsOne && inningsTwo && inningsOne.score.runs > inningsTwo.score.runs ? true : false

  useEffect(() => {
    if (activeMatch) {
      const bannerColor = getTeamColors(activeMatch?.team1SName, activeMatch?.team2SName)
      setGradientColor(bannerColor)
    }
  }, [activeMatch])

  if (!gradientColor) return

  return (
    <div>
      <div
        className='p-5 rounded-lg'
        style={{
          background: `linear-gradient(90deg, ${gradientColor.fromColor} 9%, ${gradientColor.toColor} 91%)`,
        }}
      >
        <div className='flex items-end w-full justify-around'>
          <div
            className='flex flex-col items-center'
            ref={team1DivRef}
            style={{ position: 'relative' }}
          >
            {/* {scoreCardData?.isMatchComplete && !isInnings1Won && (
              <Confetti
                width={team1DivRef.current?.clientWidth}
                height={team1DivRef.current?.clientWidth}
              />
            )} */}
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
          <div
            className='flex flex-col items-center'
            ref={team2DivRef}
            style={{ position: 'relative' }}
          >
            {/* {scoreCardData?.isMatchComplete && !isInnings1Won && (
              <Confetti
                width={team2DivRef.current?.clientWidth}
                height={team2DivRef.current?.clientWidth}
              />
            )} */}
            <Image
              src={team2Url}
              alt='team2'
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
