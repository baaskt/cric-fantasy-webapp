import { OptionsEntity } from '@/model/entities/options.interface'
import { COLORS } from '@/util/colors'
import { Divider, Menu, MenuItem } from '@mui/material'
import React from 'react'

type CricMenuProps = {
  title: string | undefined
  subTitle: string | undefined
  anchorEl: (EventTarget & HTMLButtonElement) | null
  menuList: OptionsEntity[]
  onSelect: (arg: OptionsEntity) => void
}

function CricMenu(props: CricMenuProps) {
  const { title, subTitle, anchorEl, menuList, onSelect } = props
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
      <div className='flex flex-col text-center pl-2 pr-2 pb-2'>
        <div style={{ color: COLORS.cricPrimary }}>{title}</div>
        <div className='text-sm italic text-slate-400'>{subTitle}</div>
      </div>
      <Divider />
      {menuList?.map(menuItem => (
        <MenuItem key={menuItem.id} onClick={() => onMenuItemSelect(menuItem)}>
          {menuItem.label}
        </MenuItem>
      ))}
    </Menu>
  )
}

export default CricMenu
