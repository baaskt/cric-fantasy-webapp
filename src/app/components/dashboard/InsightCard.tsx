import React, { useMemo } from 'react'
import { InsightsType } from '@/model/enum/insight-type.enum'
import { InsightsEntity } from '@/model/response/insights-response.interface'
import SportsCricketIcon from '@mui/icons-material/SportsCricket'
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import { COLORS } from '@/util/colors'

type InsightCardProps = {
  title: string
  type: string
  data: InsightsEntity[]
}
function InsightCard(props: InsightCardProps) {
  const { title, type, data } = props

  const valueType = useMemo(
    () =>
      type === InsightsType.RUNS.toString()
        ? 'runs'
        : type === InsightsType.WICKETS.toString()
          ? 'wickets'
          : 'points',
    [type],
  )

  const typeIcon = useMemo(
    () =>
      type === InsightsType.RUNS.toString() ? (
        <SportsCricketIcon />
      ) : type === InsightsType.WICKETS.toString() ? (
        <SportsBaseballIcon />
      ) : (
        <WorkspacePremiumIcon />
      ),
    [type],
  )

  return (
    <div
      style={{ backgroundColor: COLORS.cricPrimaryUltraLight }}
      className='p-5 rounded-lg w-full md:w-fit md:min-w-64'
    >
      <div className='flex flex-row justify-between'>
        <div className='flex flex-col gap-2 justify-between'>
          <div className='text-sm md:text-md'>{title}</div>
          <div className='font-bold text-md md:text-xl'>
            {data.map(players => players.name).join(' / ')}
          </div>
          <div className='flex gap-2 items-center'>
            <div style={{ color: COLORS.cricPrimary }} className='font-bold text-lg md:text-2xl'>
              {data[0].value ? data[0].value : 0}
            </div>{' '}
            <span>{valueType}</span>
          </div>
        </div>
        <div style={{ color: COLORS.cricPrimary }}>{typeIcon}</div>
      </div>
    </div>
  )
}

export default InsightCard
