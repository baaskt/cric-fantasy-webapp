import { OptionsEntity } from '@/model/entities/options.interface'
import { Checkbox, FormControl, InputLabel, MenuItem, Select, checkboxClasses } from '@mui/material'
import React from 'react'
import { SelectChangeEvent } from '@mui/material'
import { COLORS } from '@/util/colors'

type CricSelectProps = {
  label: string
  menuList: OptionsEntity[]
  onChange: (option: OptionsEntity[]) => void
}

function CricMultiSelect(props: CricSelectProps) {
  const [selectedValue, setSelectedValue] = React.useState<string[]>([])
  const { label, menuList, onChange } = props

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const value: string[] = event.target.value as string[]
    setSelectedValue(value)
    const selectedMenus = menuList.filter(menu => value.indexOf(menu.value as string) >= 0)
    if (selectedMenus?.length) {
      onChange(selectedMenus)
    }
  }

  return (
    <FormControl variant='filled' fullWidth sx={{ maxWidth: 1 }}>
      <InputLabel id='select-label'>{label}</InputLabel>
      <Select
        labelId='multi-select-label'
        id='cric-multi-select'
        value={selectedValue}
        multiple
        label={label}
        renderValue={selected => selected.join(', ')}
        onChange={handleChange}
      >
        {menuList.map(menu => (
          <MenuItem key={menu.id} value={menu.value}>
            <Checkbox
              sx={{
                [`&, &.${checkboxClasses.checked}`]: {
                  color: COLORS.cricPrimary,
                },
              }}
              checked={menu.value && selectedValue.indexOf(menu.value) > -1 ? true : false}
            />
            {menu.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default CricMultiSelect
