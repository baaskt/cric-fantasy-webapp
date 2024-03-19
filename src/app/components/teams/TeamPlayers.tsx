import React, { useState } from 'react'
import CricTab from '../ui/CricTab'
import { OptionsEntity } from '@/model/entities/options.interface'
import PlayingXI from './PlayingXI'
import SquadPortfolio from './SquadPortfolio'
import { SquadEntity } from '@/model/entities/squad.interface'

const tabOptions: OptionsEntity[] = [
  //   { id: 1, label: 'Playing XI', value: 'PlayingXI' },
  { id: 2, label: 'Squad', value: 'Squad' },
]

type TeamPlayersProps = {
  groupedSquad: Map<string, SquadEntity[]>
  squad: SquadEntity[]
}

function TeamPlayers(props: TeamPlayersProps) {
  const { squad, groupedSquad } = props
  const [selectedTab, setSelectedTab] = useState<OptionsEntity>(tabOptions[0])

  const handleChange = (selectedEntity: OptionsEntity) => {
    setSelectedTab(selectedEntity)
  }

  const subText = selectedTab.id === 2 ? `(${squad.length})` : ''
  return (
    <div>
      <div className='flex flex-row justify-between'>
        <CricTab
          optionList={tabOptions}
          selectedTab={selectedTab}
          subText={subText}
          onChange={handleChange}
        />
      </div>
      <div className='flex justify-between'>
        {selectedTab.id === 1 ? (
          <PlayingXI squad={squad}></PlayingXI>
        ) : (
          <SquadPortfolio groupedSquad={groupedSquad}></SquadPortfolio>
        )}
      </div>
    </div>
  )
}

export default TeamPlayers
