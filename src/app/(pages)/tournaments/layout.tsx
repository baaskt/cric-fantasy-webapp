'use client'

import Header from '@/components/header'
import Sidebar from '@/components/sidebar'
import { usePathname } from 'next/navigation'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded'
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded'
import WorkspacesRoundedIcon from '@mui/icons-material/WorkspacesRounded'
import FlagRoundedIcon from '@mui/icons-material/FlagRounded'
import { SideBarMenuEntity } from '@/model/entities/sidedbar-menu.type'

const sidebarConfig: SideBarMenuEntity[] = [
  {
    icon: <DashboardRoundedIcon></DashboardRoundedIcon>,
    title: 'Dashboard',
    path: '/dashboard',
    fullPath: '/tournaments/dashboard',
  },
  {
    icon: <FormatListBulletedRoundedIcon></FormatListBulletedRoundedIcon>,
    title: 'Matches',
    path: '/matches',
    fullPath: '/tournaments/matches',
  },
  {
    icon: <PersonSearchRoundedIcon></PersonSearchRoundedIcon>,
    title: 'Players',
    path: '/players',
    fullPath: '/tournaments/players',
  },
  {
    icon: <WorkspacesRoundedIcon></WorkspacesRoundedIcon>,
    title: 'Teams',
    path: '/teams',
    fullPath: '/tournaments/teams',
  },
  {
    icon: <FlagRoundedIcon></FlagRoundedIcon>,
    title: 'Tournaments',
    path: '/tournaments',
    fullPath: '/tournaments',
  },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const pathIndex = sidebarConfig.findIndex(sc => pathname.includes(sc.path))
  const matchingPath = pathIndex !== -1 ? sidebarConfig[pathIndex] : null

  return (
    <div className='flex flex-row h-dvh'>
      <Sidebar activePath={matchingPath}></Sidebar>
      <div className='flex flex-col w-full'>
        <Header activePath={matchingPath}></Header>
        <>{children}</>
      </div>
    </div>
  )
}
