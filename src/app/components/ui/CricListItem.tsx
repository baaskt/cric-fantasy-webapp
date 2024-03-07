import { COLORS } from '@/util/colors'
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { SideBarMenuEntity } from '@/model/types/sidedbar-menu.type'
import { ThemeProvider } from '@emotion/react'
import { listItemTheme } from '@/styles/themes/listItem'

type CricListItemProps = {
  menuEntity: SideBarMenuEntity
  isActive: boolean
  onClick: (menuEntity: SideBarMenuEntity) => void
}

function CricListItem(props: CricListItemProps) {
  const { menuEntity, isActive } = props
  const { icon, title } = menuEntity
  const ListIcon = icon

  return (
    <ThemeProvider theme={listItemTheme}>
      <ListItem onClick={() => props.onClick(menuEntity)}>
        <ListItemButton selected={isActive}>
          <ListItemIcon sx={{ color: COLORS.cricDark }}>{<ListIcon></ListIcon>}</ListItemIcon>
          <ListItemText className='hidden md:flex' primary={title} />
        </ListItemButton>
      </ListItem>
    </ThemeProvider>
  )
}

export default CricListItem
