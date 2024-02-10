'use client'

import React from 'react'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded'
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded'
import WorkspacesRoundedIcon from '@mui/icons-material/WorkspacesRounded'
import FlagRoundedIcon from '@mui/icons-material/FlagRounded'
import List from '@mui/material/List'
import CricListItem from './ui/CricListItem'
import { SideBarMenuEntity } from '@/model/entities/sidedbar-menu.type'
import Brand from './brand'

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
function Sidebar({ activePath }: { activePath: SideBarMenuEntity | null }) {
  return (
    <div className='w-1/5 md:w-1/5 shadow-md'>
      <div className='flex justify-center p-2'>
        <Brand />
      </div>
      <List>
        {sidebarConfig?.map((menuEntity, menuIndex) => (
          <CricListItem
            key={menuIndex}
            menuEntity={menuEntity}
            isActive={activePath?.path === menuEntity.path}
          ></CricListItem>
        ))}
      </List>
    </div>
  )
}

export default Sidebar
