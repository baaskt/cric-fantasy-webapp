import Header from '@/components/HeaderComp'
import Sidebar from '@/components/Sidebar'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded'
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded'
import WorkspacesRoundedIcon from '@mui/icons-material/WorkspacesRounded'
import FlagRoundedIcon from '@mui/icons-material/FlagRounded'
import { SideBarMenuEntity } from '@/model/types/sidedbar-menu.type'
import { TITLES } from '@/util/constants/constants'

export const sidebarConfig: SideBarMenuEntity[] = [
  {
    icon: <DashboardRoundedIcon></DashboardRoundedIcon>,
    title: TITLES.DASHBOARD.label,
    path: TITLES.DASHBOARD.path,
    fullPath: TITLES.DASHBOARD.fullPath,
  },
  {
    icon: <FormatListBulletedRoundedIcon></FormatListBulletedRoundedIcon>,
    title: TITLES.MATCHES.label,
    path: TITLES.MATCHES.path,
    fullPath: TITLES.MATCHES.fullPath,
  },
  {
    icon: <PersonSearchRoundedIcon></PersonSearchRoundedIcon>,
    title: TITLES.PLAYERS.label,
    path: TITLES.PLAYERS.path,
    fullPath: TITLES.PLAYERS.fullPath,
  },
  {
    icon: <WorkspacesRoundedIcon></WorkspacesRoundedIcon>,
    title: TITLES.TEAMS.label,
    path: TITLES.TEAMS.path,
    fullPath: TITLES.TEAMS.fullPath,
  },
  {
    icon: <FlagRoundedIcon></FlagRoundedIcon>,
    title: TITLES.TOURNAMENTS.label,
    path: TITLES.TOURNAMENTS.path,
    fullPath: TITLES.TOURNAMENTS.fullPath,
  },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-row mt-16 ml-[20%]'>
      <Sidebar></Sidebar>
      <div className='flex flex-col w-full'>
        <Header></Header>
        {children}
      </div>
    </div>
  )
}
