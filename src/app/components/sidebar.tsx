'use client'

import React from 'react'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded'
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded'
import WorkspacesRoundedIcon from '@mui/icons-material/WorkspacesRounded'
import FlagRoundedIcon from '@mui/icons-material/FlagRounded'
import List from '@mui/material/List'
import CricListItem from './ui/CricListItem'
import { usePathname } from 'next/navigation'
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
function Sidebar() {
  const pathname = usePathname()
  const pathIndex = sidebarConfig.findIndex(sc => pathname.includes(sc.path))
  const matchingPath = pathIndex !== -1 ? sidebarConfig[pathIndex].path : ''

  return (
    <div className='w-1/5 md:w-1/6 shadow-md'>
      <List>
        {sidebarConfig?.map((menuEntity, menuIndex) => (
          <CricListItem
            key={menuIndex}
            menuEntity={menuEntity}
            isActive={matchingPath === menuEntity.path}
          ></CricListItem>
        ))}
      </List>
    </div>
  )
}

export default Sidebar
