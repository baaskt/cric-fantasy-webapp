'use client'

import CreateTournamentForm from '@/components/createTournamentForm'
// import EmptyData from '@/components/EmptyData'
import CricButton from '@/components/ui/cricButton'
import CricModal from '@/components/ui/cricModal'
import CricTab from '@/components/ui/cricTab'
import { OptionsEntity } from '@/model/entities/options.interface'
import { TOURNAMENT } from '@/util/constants/constants'
import React, { Suspense, useState } from 'react'
import Loading from './loading'
import TournamentList from '@/components/tournamentList'

const tabOptions: OptionsEntity[] = [
  { id: 1, label: 'My Tournaments' },
  { id: 2, label: 'All Tournaments' },
]

export default function Tournaments() {
  const [open, setOpen] = useState<boolean>(false)
  const [isCreating, setCreating] = useState<boolean>(false)
  // const [tournamentData, setTournamentData] = useState([])
  const handleChange = (selectedEntity: OptionsEntity) => {
    console.log(selectedEntity)
  }

  const createTournament = () => {
    setOpen(true)
    setCreating(false)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onCreate = () => {
    // setOpen(false)
  }

  return (
    <div className='m-5'>
      <div className='flex flex-row justify-between'>
        <CricTab optionList={tabOptions} onChange={handleChange} />
        <CricButton
          onClick={() => createTournament()}
          btnTxt={isCreating ? TOURNAMENT.CREATING : TOURNAMENT.CREATE}
        ></CricButton>
      </div>
      <Suspense fallback={<Loading />}>
        <TournamentList />
      </Suspense>
      <CricModal open={open} onClose={handleClose}>
        <CreateTournamentForm onCreate={onCreate}></CreateTournamentForm>
      </CricModal>
      {/* {!tournamentData?.length && <EmptyData></EmptyData>} */}
    </div>
  )
}
