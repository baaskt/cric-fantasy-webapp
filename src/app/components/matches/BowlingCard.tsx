import { BowlingCardEntity } from '@/model/response/match-detail.interface'
import { COLORS } from '@/util/colors'
import React from 'react'

const headerList = [
  { name: 'Bowlers' },
  { name: 'O' },
  { name: 'M' },
  { name: 'R' },
  { name: 'W' },
  { name: 'D' },
  { name: 'Eco.' },
]

type BowlingCardProps = {
  bowlingData: BowlingCardEntity[]
}

function BowlingCard(props: BowlingCardProps) {
  const { bowlingData } = props
  const bowlPlayers = bowlingData.filter(bowl => bowl.overs)

  return (
    <div className='pt-5'>
      <div
        style={{ backgroundColor: COLORS.cricPrimary, color: COLORS.white }}
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
      {bowlPlayers.map(bowlEntity => (
        <div key={bowlEntity.bowlerId} className='flex items-center'>
          <div
            style={{ color: COLORS.cricPrimary }}
            className={`flex flex-row gap-2 w-[40%] md:w-[50%] p-2 md:pl-5`}
          >
            {bowlEntity.bowlName}
            <div>{bowlEntity.isOverseas ? <div>&#9992;</div> : <></>}</div>
          </div>
          <div className={`w-[8%] md:w-[10%] p-2 text-center`}>{bowlEntity.overs}</div>
          <div className={`w-[8%] md:w-[10%] p-2 text-center`}>{bowlEntity.maidens}</div>
          <div className={`w-[8%] md:w-[10%] p-2 text-center`}>{bowlEntity.runs}</div>
          <div className={`w-[8%] md:w-[10%] p-2 text-center`}>{bowlEntity.wickets}</div>
          <div className={`w-[8%] md:w-[10%] p-2 text-center`}>
            {bowlEntity.dots ? bowlEntity.dots : 0}
          </div>
          <div className={`w-[8%] md:w-[10%] p-2 text-center`}>{bowlEntity.economy}</div>
        </div>
      ))}
    </div>
  )
}

export default BowlingCard
