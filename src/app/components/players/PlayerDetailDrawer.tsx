import { MatchDetail } from '@/model/response/player-detail.response.interface'
import CloseIcon from '@mui/icons-material/Close'
import { motion, AnimatePresence } from 'framer-motion'
import { IconButton } from '@mui/material'
import { COLORS } from '@/util/colors'

export function PlayerDetailDrawer({
  match,
  onClose,
}: {
  match: MatchDetail | null
  onClose: () => void
}) {
  const matchDescSplit = match?.matchDesc.split(':')
  const matchTitle = matchDescSplit && matchDescSplit[1]
  const matchDesc = matchDescSplit && matchDescSplit[0]

  const trend = (pts: number) =>
    pts >= 150
      ? { color: COLORS.stockGreen, icon: null, label: 'Great' }
      : pts >= 80
        ? { color: COLORS.darkGray, icon: null, label: 'Good' }
        : { color: COLORS.unsold, icon: null, label: 'Low' }

  return (
    <AnimatePresence>
      {match && (
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

            <div className='flex items-start justify-between mb-5'>
              <div>
                <h3 className='text-lg font-black' style={{ color: COLORS.cricDark }}>
                  {matchTitle}
                </h3>
                <p className='text-sm' style={{ color: COLORS.darkGray }}>
                  {matchDesc}
                </p>
              </div>
              <IconButton size='small' onClick={onClose}>
                <CloseIcon fontSize='small' style={{ color: COLORS.darkGray }} />
              </IconButton>
            </div>

            <div className='grid grid-cols-2 gap-3'>
              {/* Points */}
              <div
                className='rounded-2xl p-4'
                style={{
                  background: COLORS.cricPrimaryUltraLight,
                  border: `1px solid ${COLORS.cricPrimaryLight}`,
                }}
              >
                <p
                  className='text-[10px] uppercase tracking-widest font-semibold mb-1'
                  style={{ color: COLORS.cricPrimary }}
                >
                  Points Earned
                </p>
                <p className='text-4xl font-black' style={{ color: COLORS.cricPrimary }}>
                  {match.totalMatchPoints}
                </p>
                <p
                  className='text-xs mt-1 font-semibold'
                  style={{ color: trend(match.totalMatchPoints).color }}
                >
                  {trend(match.totalMatchPoints).label} performance
                </p>
              </div>

              {/* Status */}
              <div
                className='rounded-2xl p-4'
                style={{
                  background: match.inPlayingXI ? COLORS.stockGreen + '12' : COLORS.inputBg,
                  border: `1px solid ${match.inPlayingXI ? COLORS.stockGreen + '35' : COLORS.gray}`,
                }}
              >
                <p
                  className='text-[10px] uppercase tracking-widest font-semibold mb-1'
                  style={{ color: match.inPlayingXI ? COLORS.stockGreen : COLORS.darkGray }}
                >
                  Match Status
                </p>
                <p
                  className='text-xl font-black'
                  style={{ color: match.inPlayingXI ? COLORS.stockGreen : COLORS.darkGray }}
                >
                  {match.inPlayingXI ? 'Playing XI' : 'Benched'}
                </p>
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
