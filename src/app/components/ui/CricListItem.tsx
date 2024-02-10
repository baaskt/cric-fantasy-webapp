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

type CricListItemProps = {
  menuEntity: SideBarMenuEntity
  isActive: boolean
}

function CricListItem(props: CricListItemProps) {
  const { menuEntity, isActive } = props
  const { icon, title, fullPath } = menuEntity

  return (
    <Link href={fullPath}>
      <ListItem>
        <ListItemButton selected={isActive}>
          <ListItemIcon sx={{ color: COLORS.cricDark }}>{icon}</ListItemIcon>
          <ListItemText primary={title} />
        </ListItemButton>
      </ListItem>
    </Link>
  )
}

export default CricListItem
