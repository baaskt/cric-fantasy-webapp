import { OptionsEntity } from '@/model/entities/options.interface'
import { Menu, MenuItem } from '@mui/material'
import React from 'react'

type CricMenuProps = {
  anchorEl: (EventTarget & HTMLButtonElement) | null
  menuList: OptionsEntity[]
  onSelect: (arg: OptionsEntity) => void
}

function CricMenu(props: CricMenuProps) {
  const { anchorEl, menuList, onSelect } = props
  const open = Boolean(anchorEl)

  const onMenuItemSelect = (menuItem: OptionsEntity) => {
    onSelect(menuItem)
  }

  return (
    <Menu
      id='basic-menu'
      anchorEl={anchorEl}
      open={open}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      {menuList?.map(menuItem => (
        <MenuItem key={menuItem.id} onClick={() => onMenuItemSelect(menuItem)}>
          {menuItem.label}
        </MenuItem>
      ))}
    </Menu>
  )
}

export default CricMenu
