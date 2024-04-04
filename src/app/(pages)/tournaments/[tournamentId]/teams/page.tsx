'use client'

import TeamList from '@/components/teams/TeamList'
import CreateTeamForm from '@/components/forms/CreateTeamForm'
import CricButton from '@/components/ui/CricButton'
import CricModal from '@/components/ui/CricModal'
import { COLORS } from '@/util/colors'
import { TEAM } from '@/util/constants/constants'
import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { useTournament } from '@/providers/TournamentProvider'

export default function Teams() {
  const [open, setOpen] = useState<boolean>(false)
  const [isCreating, setCreating] = useState<boolean>(false)
  const { activeTournament } = useTournament()

  const createTeam = () => {
    setOpen(true)
    setCreating(false)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onCreate = () => {
    setOpen(false)
  }

  return (
    <div>
      <div className='flex justify-between items-center flex-col gap-5 md:flex-row'>
        <div style={{ color: COLORS.darkGray }} className='text-sm italic p-5'>
          Teams are sorted based on the total points in descending order
        </div>
        {activeTournament?.isHost && (
          <CricButton
            startIcon={<AddIcon />}
            onClick={() => createTeam()}
            btnTxt={isCreating ? TEAM.CREATING : TEAM.CREATE}
          ></CricButton>
        )}
      </div>
      <div className='p-5'>
        <TeamList />
      </div>
      <CricModal open={open} onClose={handleClose}>
        <CreateTeamForm onCreate={onCreate}></CreateTeamForm>
      </CricModal>
    </div>
  )
}
