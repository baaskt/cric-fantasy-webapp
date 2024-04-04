import { BattingCardEntity } from '@/model/response/match-detail.interface'
import { COLORS } from '@/util/colors'
import React from 'react'

const headerList = [
  { name: 'Batters' },
  { name: 'R' },
  { name: 'B' },
  { name: '4s' },
  { name: '6s' },
  { name: 'S/R' },
]

type BattingCardProps = {
  battingData: BattingCardEntity[]
  isVictory: boolean
}

function BattingCard(props: BattingCardProps) {
  const { battingData, isVictory } = props
  const batPlayers = battingData.filter(bat => bat.outDesc)
  const toBatPlayers = battingData
    .filter(bat => !bat.outDesc)
    .map(bat => bat.batName)
    .join(', ')

  return (
    <div>
      <div
        style={{
          backgroundColor: isVictory ? COLORS.cricPrimaryLight : COLORS.cricPrimary,
          color: COLORS.white,
        }}
        className='flex items-center'
      >
        {headerList.map((header, index) => (
          <div
            className={`${index === 0 ? 'w-[40%] md:w-[50%]' : 'w-[8%] md:w-[10%]'} p-2 text-center`}
            key={header.name}
          >
            {header.name}
          </div>
        ))}
      </div>
      {batPlayers.map(batEntity => (
        <div key={batEntity.batId} className='flex items-center'>
          <div className={`w-[40%] md:w-[50%] p-2 md:pl-5`}>
            <div style={{ color: COLORS.cricPrimary }} className='flex flex-row gap-2'>
              <div>{`${batEntity.batName} ${batEntity.outDesc === 'not out' ? '*' : ''}`}</div>
              <div>{batEntity.isOverseas ? <div>&#9992;</div> : <></>}</div>
              <div>{!batEntity.runs ? <div>&#129414;</div> : <></>}</div>
            </div>
            <div className='text-slate-500'>{batEntity.outDesc}</div>
          </div>
          <div className={`w-[8%] md:w-[10%] p-2 text-center`}>{batEntity.runs}</div>
          <div className={`w-[8%] md:w-[10%] p-2 text-center`}>{batEntity.balls}</div>
          <div className={`w-[8%] md:w-[10%] p-2 text-center`}>{batEntity.fours}</div>
          <div className={`w-[8%] md:w-[10%] p-2 text-center`}>{batEntity.sixes}</div>
          <div className={`w-[8%] md:w-[10%] p-2 text-center`}>{batEntity.strikeRate}</div>
        </div>
      ))}
      <div className='pl-5'>
        <div className='font-semibold'>To Bat</div>
        <div className='flex gap-2 text-slate-500'>{toBatPlayers}</div>
      </div>
    </div>
  )
}

export default BattingCard
