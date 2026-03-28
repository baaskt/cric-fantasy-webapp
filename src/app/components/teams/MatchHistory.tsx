import React, { useState } from 'react'
import InfoIcon from '@mui/icons-material/Info'
import { IconButton } from '@mui/material'
import { COLORS } from '@/util/colors'
import CricModal from '../ui/CricModal'
import MatchPlayerDetail from './MatchPlayerDetail'
import EmptyData from '../EmptyData'

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

  if (!matchHistory || !matchHistory.length) {
    return (
      <EmptyData
        title={'No Match History Available'}
        subTitle={'Come back later when the commentators are back with the match details.'}
        imagePath='/assets/images/empty-match.png'
      />
    )
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
