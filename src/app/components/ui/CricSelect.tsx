import { OptionsEntity } from '@/model/entities/options.interface'
import { FormControl, InputLabel, MenuItem, Select, ThemeProvider } from '@mui/material'
import React, { useEffect } from 'react'
import { SelectChangeEvent } from '@mui/material'
import { selectTheme } from '@/styles/themes/select'
import { COLORS } from '@/util/colors'

type CricSelectProps = {
  label: string
  defaultValue?: string | number
  isDisabled?: boolean
  menuList: OptionsEntity[]
  onChange: (option: OptionsEntity) => void
}

function CricSelect(props: CricSelectProps) {
  const [selectedValue, setSelectedValue] = React.useState<string>('')
  const { label, menuList, defaultValue, isDisabled, onChange } = props

  useEffect(() => {
    if (defaultValue) {
      setSelectedValue(defaultValue.toString())
    }
  }, [defaultValue])

  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value
    setSelectedValue(value)
    const selectedMenu = menuList.find(menu => menu.value === value)
    if (selectedMenu) {
      onChange(selectedMenu)
    }
  }

  return (
    <ThemeProvider theme={selectTheme}>
      <FormControl variant='filled' fullWidth sx={{ maxWidth: 1 }}>
        <InputLabel id='select-label'>{label}</InputLabel>
        <Select
          labelId='select-label'
          id='cric-select'
          value={selectedValue}
          label={label}
          disabled={isDisabled}
          onChange={handleChange}
          sx={{ backgroundColor: COLORS.white }}
        >
          {menuList.map(menu => (
            <MenuItem key={menu.id} value={menu.value}>
              {menu.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </ThemeProvider>
  )
}

export default CricSelect
