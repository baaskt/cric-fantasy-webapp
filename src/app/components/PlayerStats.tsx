import React, { useEffect, useState } from 'react'
import {
  BattingEntity,
  BowlingEntity,
  PlayerEntity,
} from '@/model/response/player-response.interface'
import StatCard from './StatCard'
import { CricMenuEntity } from '@/model/types/cric-menu.type'
import SportsCricketOutlinedIcon from '@mui/icons-material/SportsCricketOutlined'
import SportsBaseballOutlinedIcon from '@mui/icons-material/SportsBaseballOutlined'
import { KeyValueType } from '@/model/types/cric-table.type'
import { STATS } from '@/util/constants/constants'
import { Divider } from '@mui/material'
import { COLORS } from '@/util/colors'

type PlayerStatsProps = {
  title: string
  playerData: Partial<PlayerEntity>
}

const battingStatList: CricMenuEntity[] = [
  { label: 'Matches', icon: SportsCricketOutlinedIcon, value: 'matches' },
  { label: 'Runs', icon: SportsCricketOutlinedIcon, value: 'runs' },
  { label: 'Strike Rate', icon: SportsCricketOutlinedIcon, value: 'sr' },
  { label: '50s', icon: SportsCricketOutlinedIcon, value: '50s' },
  { label: '100s', icon: SportsCricketOutlinedIcon, value: '100s' },
]

const bowlingStatList: CricMenuEntity[] = [
  { label: 'Wickets', icon: SportsBaseballOutlinedIcon, value: 'wickets' },
  { label: 'Economy', icon: SportsBaseballOutlinedIcon, value: 'eco' },
  { label: '4 wicket haul', icon: SportsBaseballOutlinedIcon, value: '4w' },
  { label: '5 wicket haul', icon: SportsBaseballOutlinedIcon, value: '5w' },
]

function PlayerStats(props: PlayerStatsProps) {
  const isT20: boolean = props.title === STATS.t20 ? true : false
  const [battingList, setBattingList] = useState<CricMenuEntity[]>([])
  const [bowlingList, setBowlingList] = useState<CricMenuEntity[]>([])
  const playerBatStat = isT20 ? props.playerData.t20?.batting : props.playerData.ipl?.batting
  const playerBowlStat = isT20 ? props.playerData.t20?.bowling : props.playerData.ipl?.bowling

  useEffect(() => {
    if (props.playerData && playerBatStat && playerBowlStat) {
      const battingStats = preparePlayerStats(battingStatList, playerBatStat)
      setBattingList(battingStats)
      const bowlingStats = preparePlayerStats(bowlingStatList, playerBowlStat)
      setBowlingList(bowlingStats)
    }
  }, [playerBatStat, playerBowlStat, props.playerData])

  const preparePlayerStats = (
    statsList: CricMenuEntity[],
    stats: BattingEntity | BowlingEntity,
  ) => {
    const tempMenuList: CricMenuEntity[] = []
    statsList.forEach(statEntity => {
      const statData = stats as never as KeyValueType
      const menuEntity = {
        icon: statEntity.icon,
        label: statEntity.label,
        value: statData[statEntity.value] as never,
      }
      tempMenuList.push(menuEntity)
    })
    return tempMenuList
  }

  return (
    <div className='pt-5'>
      <div className='text-lg text-center'>{props.title}</div>
      <div className='flex gap-5 mt-3'>
        <StatCard title='Batting' menuList={battingList}></StatCard>
        <Divider
          orientation='vertical'
          flexItem
          sx={{ borderWidth: 2, borderColor: COLORS.cricPrimaryLight }}
        />
        <StatCard title='Bowling' menuList={bowlingList}></StatCard>
      </div>
    </div>
  )
}

export default PlayerStats
