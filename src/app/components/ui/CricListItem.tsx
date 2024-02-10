import { COLORS } from '@/util/colors'
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import React from 'react'
import Link from 'next/link'
import { SideBarMenuEntity } from '@/model/entities/sidedbar-menu.type'
import { ThemeProvider } from '@emotion/react'
import { listItemTheme } from '@/styles/themes/listItem'

type CricListItemProps = {
  menuEntity: SideBarMenuEntity
  isActive: boolean
}

function CricListItem(props: CricListItemProps) {
  const { menuEntity, isActive } = props
  const { icon, title, fullPath } = menuEntity

  return (
    <Link href={fullPath}>
      <ThemeProvider theme={listItemTheme}>
        <ListItem>
          <ListItemButton selected={isActive}>
            <ListItemIcon sx={{ color: COLORS.cricDark }}>{icon}</ListItemIcon>
            <ListItemText className='hidden md:flex' primary={title} />
          </ListItemButton>
        </ListItem>
      </ThemeProvider>
    </Link>
  )
}

export default CricListItem
