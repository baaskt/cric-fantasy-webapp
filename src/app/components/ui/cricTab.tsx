import React from 'react'
import { Tab, Tabs, ThemeProvider } from '@mui/material'
import { OptionsEntity } from '@/model/entities/options.interface'
import { tabTheme } from '@/styles/themes/tabs'

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

type CricTabProps = {
  optionList: OptionsEntity[]
  onChange: (event: OptionsEntity) => void
}

function CricTab(props: CricTabProps) {
  const { optionList, onChange } = props
  const [value, setValue] = React.useState(0)

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: number,
  ) => {
    setValue(newValue)
    onChange(optionList[newValue])
  }

  return (
    <ThemeProvider theme={tabTheme}>
      <Tabs value={value} onChange={handleChange} aria-label='tabs'>
        {optionList.map((optionEntity, index) => (
          <Tab
            key={optionEntity.id}
            label={optionEntity.label}
            {...a11yProps(index)}
          />
        ))}
      </Tabs>
    </ThemeProvider>
  )
}

export default CricTab
