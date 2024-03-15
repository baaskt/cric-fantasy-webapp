import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded'
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded'
import WorkspacesRoundedIcon from '@mui/icons-material/WorkspacesRounded'
// import FlagRoundedIcon from '@mui/icons-material/FlagRounded'
import LoyaltyIcon from '@mui/icons-material/Loyalty'
import HomeIcon from '@mui/icons-material/Home'
import { useTournament } from '@/providers/TournamentProvider'
import { SideBarMenuEntity } from '@/model/types/sidedbar-menu.type'
import { TITLES } from '@/util/constants/constants'
import { usePathname } from 'next/navigation'
import { TournamentEntity } from '@/model/response/tournament.interface'
import { TournamentStatusLabel } from '@/model/enum/tournament-status.enum'

export const tournamentConfig: SideBarMenuEntity[] = [
  {
    icon: DashboardRoundedIcon,
    title: TITLES.DASHBOARD.label,
    path: TITLES.DASHBOARD.path,
    fullPath: TITLES.DASHBOARD.fullPath,
  },
  {
    icon: FormatListBulletedRoundedIcon,
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
]

const homeConfig: SideBarMenuEntity[] = [
  {
    icon: HomeIcon,
    title: TITLES.HOME.label,
    path: TITLES.HOME.path,
    fullPath: TITLES.HOME.fullPath,
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
      ? [...homeConfig, ...tournamentConfig, ...auctionConfig]
      : [...homeConfig, ...tournamentConfig]
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
