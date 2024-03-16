import React, { useState } from 'react'
import CricTab from '../ui/CricTab'
import { OptionsEntity } from '@/model/entities/options.interface'
import PlayingXI from './PlayingXI'
import SquadPortfolio from './SquadPortfolio'

const tabOptions: OptionsEntity[] = [
  //   { id: 1, label: 'Playing XI', value: 'PlayingXI' },
  { id: 2, label: 'Squad', value: 'Squad' },
]

function TeamPlayers() {
  const [selectedTab, setSelectedTab] = useState<OptionsEntity>(tabOptions[0])

  const handleChange = (selectedEntity: OptionsEntity) => {
    setSelectedTab(selectedEntity)
  }
  return (
    <div>
      <div className='flex flex-row justify-between'>
        <CricTab optionList={tabOptions} selectedTab={selectedTab} onChange={handleChange} />
      </div>
      <div className='flex justify-between'>
        {selectedTab.id === 1 ? <PlayingXI></PlayingXI> : <SquadPortfolio></SquadPortfolio>}
      </div>
    </div>
  )
}

export default TeamPlayers
