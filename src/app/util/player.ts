import { TeamDetailEntity } from '@/model/response/team-detail.interface'
import { CricMenuEntity } from '@/model/types/cric-menu.type'
import { CricHeaderRow, CricTableCell, KeyValueType } from '@/model/types/cric-table.type'
import { currencyToString } from './bidding'
import { SquadEntity } from '@/model/entities/squad.interface'
import { groupListByProp } from './helper'
import { TeamMember } from '@/model/entities/team-member.interface'
import { OtherTableData } from './tables/table'
import { TournamentEntity } from '@/model/response/tournament.interface'
import { OptionsEntity } from '@/model/entities/options.interface'
import { PLAYERS } from './constants/endpoints'
import { PlayersListEntity } from '@/model/response/player-list.response.interface'

const ALLROUNDER = 'All Rounder'
const BAT_ALLROUNDER = 'Batting Allrounder'
const BOWL_ALLROUNDER = 'Bowling Allrounder'

export const WK = 'Wicket Keeper'
const BAT_WK = 'WK-Batter'
const BOWL_WK = 'WK-Bowler'
const BATTER = 'Batter'
const BOWLER = 'Bowler'

const MAX_SQUAD_COUNT = 16

export const PLAYER_ROLES: string[] = [BATTER, BOWLER, ALLROUNDER, WK]
export const getPlayerDisplayRole = (role: string, squadCount: number): string => {
  let displayRole = role
  if (role === BOWL_ALLROUNDER || role === BAT_ALLROUNDER) {
    displayRole = ALLROUNDER
  } else if (role === BAT_WK || role === BOWL_WK) {
    displayRole = WK
  }
  return squadCount > 1 ? `${displayRole}s` : displayRole
}

export const groupPlayersByRole = (squad: SquadEntity[]): Map<string, SquadEntity[]> => {
  const tempGroupedSquad = groupListByProp<SquadEntity>('role', squad)
  if (tempGroupedSquad.has(BOWL_ALLROUNDER) || tempGroupedSquad.has(BAT_ALLROUNDER)) {
    const battingAllRounder = tempGroupedSquad.get(BAT_ALLROUNDER) || []
    const bowlingAllRounder = tempGroupedSquad.get(BOWL_ALLROUNDER) || []
    tempGroupedSquad.delete(BOWL_ALLROUNDER)
    tempGroupedSquad.delete(BAT_ALLROUNDER)
    tempGroupedSquad.set(ALLROUNDER, [...battingAllRounder, ...bowlingAllRounder])
  }
  if (tempGroupedSquad.has(BAT_WK) || tempGroupedSquad.has(BOWL_WK)) {
    const battingWk = tempGroupedSquad.get(BAT_WK) || []
    const bowlingWk = tempGroupedSquad.get(BOWL_WK) || []
    tempGroupedSquad.delete(BAT_WK)
    tempGroupedSquad.delete(BOWL_WK)
    tempGroupedSquad.set(WK, [...battingWk, ...bowlingWk])
  }
  return tempGroupedSquad
}

export const prepareParticipantStats = (
  statsList: CricMenuEntity[],
  participants: TeamMember[],
) => {
  const tempMenuList: CricMenuEntity[] = []
  participants.forEach((participant, index) => {
    const menuEntity = {
      icon: statsList[index].icon,
      label: statsList[index].label,
      value: participant.name,
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
          ? `${teamDetail.squad?.length.toString()}/${MAX_SQUAD_COUNT}`
          : statEntity.value === 'purseBalance'
            ? `${currencyToString(teamDetail.purseBalance)}`
            : (statData[statEntity.value] as never),
    }
    tempMenuList.push(menuEntity)
  })
  return tempMenuList
}

export const checkValidComposition = (playersInXI: SquadEntity[]) => {
  if (!(playersInXI?.length === 11)) return false
  const minBat = 3,
    minBowl = 3,
    minAllRound = 1,
    minWK = 1
  let bat = 0,
    bowl = 0,
    wk = 0,
    batAllRound = 0,
    bowlAllRound = 0
  const playerRoles = playersInXI.map(player => player.role)
  playerRoles.forEach(role => {
    if (role === BATTER) {
      ++bat
    }
    if (role === BOWLER) {
      ++bowl
    }
    if (role === BAT_ALLROUNDER) {
      batAllRound + bowlAllRound < 1 ? ++batAllRound : ++bat
    }
    if (role === BOWL_ALLROUNDER) {
      batAllRound + bowlAllRound < 1 ? ++bowlAllRound : ++bowl
    }
    if (role === BAT_WK || role === BOWL_WK) {
      wk < 1 ? ++wk : ++bat
    }
  })
  const validBat = bat >= minBat || bat + batAllRound >= minBat + minAllRound ? true : false
  const validBowl = bowl >= minBowl || bowl + bowlAllRound >= minBowl + minAllRound ? true : false
  const validAllRound = batAllRound + bowlAllRound >= minAllRound ? true : false
  const validWK = wk >= minWK ? true : false
  return validBat && validBowl && validAllRound && validWK
}

export const getPlayerTableData = (
  headerEntity: CricHeaderRow,
  playerListEntity: PlayersListEntity,
  playerIndex: number,
  otherData: OtherTableData | undefined,
): CricTableCell => {
  const cellType = headerEntity.type
  const cellKey = headerEntity.key
  const iconPath = headerEntity.iconPath
  const value = getPlayerListCellValue(
    cellType,
    cellKey,
    iconPath,
    playerListEntity,
    playerIndex,
    otherData,
  )
  const tableCell: CricTableCell = {
    cellKey: cellKey,
    cellType: cellType,
    value: value,
    color: '',
    isMobileView: headerEntity.isMobile ? true : false,
    headerName: headerEntity.label,
  }
  return tableCell
}

const getPlayerListCellValue = (
  cellType: string,
  cellKey: string,
  iconPath: string | undefined,
  playerListEntity: PlayersListEntity,
  playerIndex: number,
  otherData: OtherTableData | undefined,
) => {
  const playerData = playerListEntity as never as KeyValueType
  let cellValue
  if (cellType === 'icon') {
    cellValue = iconPath
  } else if (cellKey === 'pos') {
    cellValue = playerIndex + 1
  } else if (cellKey === 'teamName') {
    cellValue = playerData[cellKey] ? playerData[cellKey] : otherData?.teamName
  } else if (cellKey === 'runs' || cellKey === 'wickets' || cellKey === 'catches') {
    cellValue = playerData[cellKey] ? playerData[cellKey] : 0
  } else {
    cellValue = playerData[cellKey]
  }
  return cellValue
}

export const getPlayingXITableData = (
  headerEntity: CricHeaderRow,
  playerEntity: SquadEntity,
  playerIndex: number,
  otherData: OtherTableData | undefined,
): CricTableCell => {
  const cellType = headerEntity.type
  const cellKey = headerEntity.key
  const iconPath = headerEntity.iconPath
  const isXIChangeAllowed = otherData?.isXIChangeAllowed ? true : false
  const value = getPlayingXICellValue(cellType, cellKey, iconPath, playerEntity, playerIndex)
  const tableCell: CricTableCell = {
    cellKey: cellKey,
    cellType: cellType,
    value: value,
    color: '',
    isDisabled:
      (headerEntity.key === 'playingXI' && isXIChangeAllowed) || headerEntity.key !== 'playingXI'
        ? false
        : true,
    isMobileView: headerEntity.isMobile ? true : false,
    headerName: headerEntity.label,
  }
  return tableCell
}

const getPlayingXICellValue = (
  cellType: string,
  cellKey: string,
  iconPath: string | undefined,
  playerEntity: SquadEntity,
  playerIndex: number,
) => {
  const playerData = playerEntity as never as KeyValueType
  let cellValue
  if (cellType === 'icon') {
    cellValue = iconPath
  } else if (cellKey === 'sno') {
    cellValue = playerIndex + 1
  } else if (cellType === 'stock') {
    if (cellKey === 'points') {
      cellValue = {
        original: playerEntity.points,
        delta: playerEntity.points - playerEntity.prevPoints,
        iconType: 'trend',
      }
    }
  } else {
    cellValue = playerData[cellKey]
  }
  return cellValue
}

export const getPlayersFilterUrl = (
  activeTournament: TournamentEntity,
  selectedTab: OptionsEntity,
  selectedTeam: OptionsEntity,
): string => {
  const tournamentId = activeTournament.tournamentId
  const TOURNAMENT_URL = PLAYERS.GET_PLAYERS_URL.replace('tournamentId', tournamentId)
  const TEAM_SUFFIX = selectedTeam.id !== -1 ? `teamId=${selectedTeam.id}` : ''
  const ROLE_SUFFIX =
    selectedTab.id === 2 || selectedTab.id === 3 ? `role=${selectedTab.value}` : ''
  const CATEGORY_SUFFIX = selectedTab.id === 4 ? `soldStatus=${selectedTab.value}` : ''
  //Remove team filter if the sold status is unsold
  const FILTERS_SUFFIX = CATEGORY_SUFFIX
    ? [ROLE_SUFFIX, CATEGORY_SUFFIX]
    : [TEAM_SUFFIX, ROLE_SUFFIX, CATEGORY_SUFFIX]
  const PLAYERS_URL = `${TOURNAMENT_URL}${FILTERS_SUFFIX.filter(url => url !== '').join('&')}`
  return PLAYERS_URL
}
