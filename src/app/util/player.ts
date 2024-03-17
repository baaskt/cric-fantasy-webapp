import { TeamDetailEntity } from '@/model/response/team-detail.interface'
import { CricMenuEntity } from '@/model/types/cric-menu.type'
import { KeyValueType } from '@/model/types/cric-table.type'
import { currencyToString } from './bidding'
import { SquadEntity } from '@/model/entities/squad.interface'
import { groupListByProp } from './helper'

export const getPlayerDisplayRole = (role: string, squadCount: number): string => {
  let displayRole = role
  if (role === 'Bowling Allrounder' || role === 'Batting Allrounder') {
    displayRole = 'All Rounder'
  } else if (role === 'WK-Batter' || role === 'WK-Bowler') {
    displayRole = 'Wicket Keeper'
  }
  return squadCount > 1 ? `${displayRole}s` : displayRole
}

export const groupPlayersByRole = (squad: SquadEntity[]): Map<string, SquadEntity[]> => {
  const tempSquad = [...squad]
  tempSquad.forEach(player => {
    player.role = getPlayerDisplayRole(player.role, 0)
  })
  const tempGroupedSquad = groupListByProp<SquadEntity>('role', tempSquad)
  return tempGroupedSquad
}

export const prepareParticipantStats = (statsList: CricMenuEntity[], participants: string[]) => {
  const tempMenuList: CricMenuEntity[] = []
  participants.forEach((participant, index) => {
    const menuEntity = {
      icon: statsList[index].icon,
      label: statsList[index].label,
      value: participant,
    }
    tempMenuList.push(menuEntity)
  })
  return tempMenuList
}

export const prepareFantasyStats = (statsList: CricMenuEntity[], teamDetail: TeamDetailEntity) => {
  const tempMenuList: CricMenuEntity[] = []
  statsList.forEach(statEntity => {
    const statData = teamDetail as never as KeyValueType
    const menuEntity = {
      icon: statEntity.icon,
      label: statEntity.label,
      value:
        statEntity.value === 'squad'
          ? `${teamDetail.squad?.length.toString()}${'/15'}`
          : statEntity.value === 'purseBalance'
            ? `${currencyToString(teamDetail.purseBalance)}`
            : (statData[statEntity.value] as never),
    }
    tempMenuList.push(menuEntity)
  })
  return tempMenuList
}
