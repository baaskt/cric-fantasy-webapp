import CloseIcon from '@mui/icons-material/Close'
import { motion, AnimatePresence } from 'framer-motion'
import { IconButton } from '@mui/material'
import { COLORS } from '@/util/colors'
import { MatchHistoryDetails } from '@/model/response/match-history-response.interface'

interface MatchHistoryDrawerProps {
  teamName: string
  matchData: MatchHistoryDetails | undefined
  onClose: () => void
}

function MatchHistoryDrawer(props: MatchHistoryDrawerProps) {
  const { teamName, matchData, onClose } = props
  const matchDescSplit = matchData?.matchDesc.split(':')
  const matchTitle = matchDescSplit && matchDescSplit[1]
  const matchDesc = matchDescSplit && matchDescSplit[0]

  return (
    <AnimatePresence>
      {matchData && (
        <>
          <motion.div
            className='fixed inset-0 z-40'
            style={{ background: 'rgba(23,26,31,0.3)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className='fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl p-6 pb-10'
            style={{
              background: COLORS.white,
              boxShadow: `0 -8px 40px ${COLORS.cricPrimaryLight}`,
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            <div
              className='w-10 h-1 rounded-full mx-auto mb-5'
              style={{ background: COLORS.gray }}
            />
            <h3
              className='text-lg font-black text-center w-full'
              style={{ color: COLORS.cricDark }}
            >
              {teamName}
            </h3>

            <div className='flex items-start justify-between mb-5'>
              <div>
                <h3 className='text-lg font-black' style={{ color: COLORS.cricPrimary }}>
                  {matchTitle}
                </h3>
                <p className='text-sm font-bold' style={{ color: COLORS.darkGray }}>
                  {matchDesc}
                </p>
                <p className='text-sm italic' style={{ color: COLORS.darkGray }}>
                  {matchData.matchStatus}
                </p>
              </div>
              <IconButton size='small' onClick={onClose}>
                <CloseIcon fontSize='small' style={{ color: COLORS.darkGray }} />
              </IconButton>
            </div>

            <div className='gap-3'>
              <div className='mt-2 flex flex-col gap-2'>
                {matchData &&
                  matchData.players.map(playerEntity => (
                    <div
                      className='flex justify-between items-center gap-4 text-sm p-2 bg-blue-50 border border-indigo-100 rounded-md'
                      key={playerEntity.playerId}
                    >
                      <div className='italic'>
                        {playerEntity.name}
                        <div
                          className='rounded-lg p-1'
                          style={{
                            background: playerEntity.playingXI
                              ? COLORS.stockGreen + '12'
                              : COLORS.inputBg,
                            border: `1px solid ${playerEntity.playingXI ? COLORS.stockGreen + '35' : COLORS.gray}`,
                          }}
                        >
                          <p
                            className='text-md font-black'
                            style={{
                              color: playerEntity.playingXI ? COLORS.stockGreen : COLORS.darkGray,
                            }}
                          >
                            {playerEntity.playingXI ? 'Playing XI' : 'Benched'}
                          </p>
                        </div>
                      </div>
                      <div style={{ color: COLORS.cricPrimary }}>{playerEntity.matchPoints}</div>
                    </div>
                  ))}
                <div className='flex justify-between gap-4 text-md font-bold mt-2 mr-2'>
                  <div className='italic'>Total Points</div>
                  <div style={{ color: COLORS.cricPrimary }}>{matchData?.totalMatchPoints}</div>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className='mt-5 w-full py-3 rounded-2xl text-sm font-bold transition-all active:scale-95'
              style={{ background: COLORS.cricPrimary, color: COLORS.white }}
            >
              Done
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MatchHistoryDrawer
