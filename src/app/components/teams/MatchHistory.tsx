import React, { useState } from 'react'
import InfoIcon from '@mui/icons-material/Info'
import { IconButton } from '@mui/material'
import { COLORS } from '@/util/colors'
import CricModal from '../ui/CricModal'
import MatchPlayerDetail from './MatchPlayerDetail'

type MatchHistoryProps = {
  matchHistory: MatchHistoryDetails[]
}
function MatchHistory(props: MatchHistoryProps) {
  const { matchHistory } = props
  const [open, setOpen] = useState<boolean>(false)
  const [matchData, setMatchData] = useState<MatchHistoryDetails>()

  const handlePlayerDetail = (matchData: MatchHistoryDetails) => {
    setMatchData(matchData)
    setOpen(true)
  }

  return (
    <div className='flex flex-col mt-5 w-full'>
      {matchHistory.map(matchData => (
        <div
          key={matchData.matchId}
          className='transition-transform duration-150 ease-in-out shadow-md p-4 rounded-lg flex flex-row justify-between items-center active:scale-95'
        >
          <div className='flex flex-col items-start gap-1'>
            <div className='font-bold'>{matchData.matchDesc}</div>
            <div className='text-md text-slate-600'>Match Points: {matchData.totalMatchPoints}</div>
          </div>
          <div>
            <IconButton onClick={() => handlePlayerDetail(matchData)}>
              <InfoIcon sx={{ color: COLORS.cricPrimary }} />
            </IconButton>
          </div>
        </div>
      ))}
      <CricModal open={open} hideClose={false} onClose={() => setOpen(false)}>
        <MatchPlayerDetail matchData={matchData} />
      </CricModal>
    </div>
  )
}

export default MatchHistory
