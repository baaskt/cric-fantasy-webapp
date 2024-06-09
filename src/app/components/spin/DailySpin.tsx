import React, { useEffect, useState } from 'react'
import { Modal, Box, IconButton } from '@mui/material'
import PlayerCard from '../PlayerCard'
import { PLAYERS } from '@/util/constants/endpoints'
import { useRequest } from '@/hooks/useRequest'
import { CricResponse } from '@/model/types/cric-response.type'
import Confetti from 'react-confetti'
import { useAuth } from '@/providers/AuthProvider'
import CloseIcon from '@mui/icons-material/Close'
import { COLORS } from '@/util/colors'
import BallSpin from './BallSpin'
import { SpinPlayerEntity } from '@/model/response/spin-player.interface'

const styles = {
  modalStyle: {
    transform: 'translate(-50%, -50%)',
    boxShadow: 24,
    outline: 0,
  },
  closeIconWrapper: {
    position: 'absolute',
    top: 10,
    right: 10,
    color: COLORS.white,
  },
}

type DailySpinProps = {
  isSpinActive: boolean
  onClose: () => void
}

function DailySpin(props: DailySpinProps) {
  const { isSpinActive, onClose } = props
  const { user, setUserDetails } = useAuth()

  const [isSpinning, setIsSpinning] = useState(false)
  const [isSpinAnimate, setSpinAnimate] = useState(false)
  const [spinDegree, setSpinDegree] = useState(0)
  const [playerData, setPlayerData] = useState<SpinPlayerEntity>()

  const tournamentId = user?.tournament || ''
  const SPIN_PLAYER_URL = tournamentId
    ? PLAYERS.SPIN_RANDOM_PLAYER.replace('tournamentId', tournamentId)
    : ''
  const spinPlayerRequest = useRequest(isSpinning ? SPIN_PLAYER_URL : '')

  useEffect(() => {
    if (spinPlayerRequest.data) {
      const spinPlayerResponse: CricResponse<SpinPlayerEntity[]> =
        spinPlayerRequest.data as CricResponse<SpinPlayerEntity[]>
      if (spinPlayerResponse.result && spinPlayerResponse.result.length) {
        setSpinAnimate(true)
        setPlayerData(spinPlayerResponse.result[0])
        endSpin()
      }
    }
  }, [spinPlayerRequest.data])

  const beginSpin = () => {
    if (isSpinning) return // Prevent multiple spins at the same time
    setIsSpinning(true)
    setInterval(() => {
      setSpinDegree(deg => deg + 60)
    }, 200)
  }

  const endSpin = () => {
    setIsSpinning(false)
  }

  const closeSpin = () => {
    if (user) {
      setUserDetails({ ...user, canSpin: false })
    }
    onClose()
  }

  return (
    <Modal
      open={isSpinActive}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      className='flex md:hidden'
      disableAutoFocus={true}
    >
      <Box
        sx={{ ...styles.modalStyle }}
        className='absolute top-1/2 left-1/2 h-5/6 w-80 bg-indigo-700 rounded-3xl'
      >
        <IconButton onClick={closeSpin} sx={styles.closeIconWrapper}>
          <CloseIcon sx={{ fontSize: 32 }} />
        </IconButton>
        <div className='flex h-screen items-center justify-center flex-col gap-2 rounded-3xl'>
          <p className='absolute top-14 font-pacifico text-4xl text-white text-center'>
            Spin of the Day
          </p>
          {playerData && (
            <div>
              <div className='animate__animated animate__bounceInLeft'>
                <PlayerCard
                  isDark={true}
                  name={playerData.name}
                  imageUrl={playerData.imageUrl}
                  clubName={playerData.clubName}
                  points={playerData.totalPoints ? playerData.totalPoints.toString() : ''}
                  isStandalone={true}
                />
              </div>
              <p className='absolute bottom-1 font-pacifico text-md text-white'>
                New player in your squad
              </p>
              <Confetti />
            </div>
          )}
          <BallSpin isSpinAnimate={isSpinAnimate} spinDegree={spinDegree} beginSpin={beginSpin} />
        </div>
      </Box>
    </Modal>
  )
}

export default DailySpin
