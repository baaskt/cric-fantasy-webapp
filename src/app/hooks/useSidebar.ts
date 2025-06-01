import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import SportsCricketIcon from '@mui/icons-material/SportsCricket'
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded'
import WorkspacesRoundedIcon from '@mui/icons-material/WorkspacesRounded'
import SportsHandballIcon from '@mui/icons-material/SportsHandball'
import LoyaltyIcon from '@mui/icons-material/Loyalty'
import HomeIcon from '@mui/icons-material/Home'
import { useTournament } from '@/providers/TournamentProvider'
import { SideBarMenuEntity } from '@/model/types/sidedbar-menu.type'
import { TITLES } from '@/util/constants/constants'
import { usePathname } from 'next/navigation'
import { TournamentEntity } from '@/model/response/tournament.interface'
import { TournamentStatusLabel } from '@/model/enum/tournament-status.enum'
import EqualizerIcon from '@mui/icons-material/Equalizer'

export const tournamentConfig: SideBarMenuEntity[] = [
  {
    icon: DashboardRoundedIcon,
    title: TITLES.DASHBOARD.label,
    path: TITLES.DASHBOARD.path,
    fullPath: TITLES.DASHBOARD.fullPath,
  },
  {
    icon: SportsCricketIcon,
    title: TITLES.MATCHES.label,
    path: TITLES.MATCHES.path,
    fullPath: TITLES.MATCHES.fullPath,
  },
  {
    icon: PersonSearchRoundedIcon,
    title: TITLES.PLAYERS.label,
    path: TITLES.PLAYERS.path,
    fullPath: TITLES.PLAYERS.fullPath,
  },
  {
    icon: WorkspacesRoundedIcon,
    title: TITLES.TEAMS.label,
    path: TITLES.TEAMS.path,
    fullPath: TITLES.TEAMS.fullPath,
  },
  {
    icon: EqualizerIcon,
    title: TITLES.ANALYTICS.label,
    path: TITLES.ANALYTICS.path,
    fullPath: TITLES.ANALYTICS.fullPath,
  },
]

const homeConfig: SideBarMenuEntity[] = [
  {
    icon: HomeIcon,
    title: TITLES.HOME.label,
    path: TITLES.HOME.path,
    fullPath: TITLES.HOME.fullPath,
  },
]

const detailConfig: SideBarMenuEntity[] = [
  {
    icon: WorkspacesRoundedIcon,
    title: TITLES.TEAM_DETAIL.label,
    path: TITLES.TEAM_DETAIL.path,
    fullPath: TITLES.TEAM_DETAIL.fullPath,
    hidden: true,
  },
  {
    icon: SportsCricketIcon,
    title: TITLES.MATCH_DETAIL.label,
    path: TITLES.MATCH_DETAIL.path,
    fullPath: TITLES.MATCH_DETAIL.fullPath,
    hidden: true,
  },
  {
    icon: SportsHandballIcon,
    title: TITLES.PLAYER_DETAIL.label,
    path: TITLES.PLAYER_DETAIL.path,
    fullPath: TITLES.PLAYER_DETAIL.fullPath,
    hidden: true,
  },
]

const auctionConfig: SideBarMenuEntity[] = [
  {
    icon: LoyaltyIcon,
    title: TITLES.AUCTION.label,
    path: TITLES.AUCTION.path,
    fullPath: TITLES.AUCTION.fullPath,
  },
  {
    icon: LoyaltyIcon,
    title: TITLES.AUCTION_TABLE.label,
    path: TITLES.AUCTION_TABLE.path,
    fullPath: TITLES.AUCTION_TABLE.fullPath,
    hidden: true,
  },
]

export function useSidebar() {
  const pathname = usePathname()
  const { activeTournament } = useTournament()
  const sidebarConfig = getSideBarConfig(activeTournament)
  const tournamentId = activeTournament?.tournamentId ? activeTournament?.tournamentId : ''

  const activePath = getActivePath(sidebarConfig, tournamentId, pathname)
  return {
    tournamentId: tournamentId,
    activePath: activePath,
    sidebarConfig: sidebarConfig,
  }
}

const getSideBarConfig = (activeTournament: TournamentEntity | undefined): SideBarMenuEntity[] => {
  const isAuctionProgress =
    activeTournament &&
    (activeTournament.tournamentStatus === (TournamentStatusLabel.PreAuction as string) ||
      activeTournament.tournamentStatus === (TournamentStatusLabel.InAuction as string))

  const sidebarConfig = activeTournament
    ? isAuctionProgress
      ? [...homeConfig, ...tournamentConfig, ...detailConfig, ...auctionConfig]
      : [...homeConfig, ...tournamentConfig, ...detailConfig]
    : homeConfig
  return sidebarConfig
}

const getActivePath = (
  sidebarConfig: SideBarMenuEntity[],
  tournamentId: string,
  pathname: string,
) => {
  const TOURNAMENT_ID = 'tournamentId'
  const matchingPath = sidebarConfig?.find(
    sc =>
      pathname.replace(`${tournamentId}`, '').replaceAll('/', '') ===
      sc.fullPath.replace(TOURNAMENT_ID, '').replaceAll('/', ''),
  )
  return matchingPath ? matchingPath : null
}
