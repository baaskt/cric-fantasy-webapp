import React, { ReactNode, useEffect } from 'react'
import { Tab, Tabs, ThemeProvider } from '@mui/material'
import { OptionsEntity } from '@/model/entities/options.interface'
import { tabTheme } from '@/styles/themes/tabs'
import Box from '@mui/material/Box'
import SwipeableViews from 'react-swipeable-views'

type TabPanelProps = {
  children: ReactNode
  value: number
  index: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

type CricTabProps = {
  selectedTab?: OptionsEntity
  optionList: OptionsEntity[]
  children?: ReactNode[]
  onChange?: (event: OptionsEntity) => void
}

function CricTab(props: CricTabProps) {
  const { children, selectedTab, optionList, onChange } = props
  const [value, setValue] = React.useState(0)

  useEffect(() => {
    const selectedIndex = optionList.findIndex(option => option.id === selectedTab?.id)
    setValue(selectedIndex !== -1 ? selectedIndex : 0)
  }, [optionList, selectedTab])

  const handleChange = (event: React.SyntheticEvent<Element, Event>, newValue: number) => {
    setValue(newValue)
    onChange && onChange(optionList[newValue])
  }

  const handleSwipe = (newValue: number) => {
    setValue(newValue)
  }

  return (
    <ThemeProvider theme={tabTheme}>
      <div className='flex flex-col'>
        <Tabs variant='scrollable' value={value} onChange={handleChange} aria-label='tabs'>
          {optionList.map((optionEntity, index) => (
            <Tab
              key={optionEntity.id}
              label={`${optionEntity.label} ${optionEntity.subText ? optionEntity.subText : ''}`}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
        {children && (
          <SwipeableViews index={value} onChangeIndex={handleSwipe}>
            {children?.map((childNode, tabIndex) => (
              <TabPanel key={tabIndex} value={value} index={tabIndex}>
                {childNode}
              </TabPanel>
            ))}
          </SwipeableViews>
        )}
      </div>
    </ThemeProvider>
  )
}

export default CricTab
