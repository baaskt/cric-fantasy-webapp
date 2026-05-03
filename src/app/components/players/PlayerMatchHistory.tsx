import { motion } from 'framer-motion'
import { IconButton, Tooltip, Chip } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import VerifiedIcon from '@mui/icons-material/Verified'
import { MatchDetail } from '@/model/response/player-detail.response.interface'
import { COLORS } from '@/util/colors'
import { useState } from 'react'
import { PlayerDetailDrawer } from './PlayerDetailDrawer'

interface PlayerMatchHistoryProps {
  match: MatchDetail
  rank: number
  playerId: number
  playerName: string
}
export function PlayerMatchHistory(props: PlayerMatchHistoryProps) {
  const { match, rank, playerId, playerName } = props
  const [activeMatch, setActiveMatch] = useState<MatchDetail | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.06 }}
      className='flex items-center gap-3 rounded-2xl px-4 py-3'
      style={{
        background: COLORS.white,
        border: `1px solid ${COLORS.gray}`,
      }}
    >
      {/* rank bubble */}
      <span
        className='w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0'
        style={{
          background: COLORS.inputBg,
          color: COLORS.darkGray,
        }}
      >
        {rank + 1}
      </span>

      <div className='flex-1 min-w-0'>
        <p className='text-sm font-semibold truncate' style={{ color: COLORS.cricDark }}>
          {match.matchDesc}
        </p>
        <div className='flex items-center gap-2 mt-0.5'>
          {match.inPlayingXI ? (
            <Chip
              label='Playing XI'
              size='small'
              icon={<VerifiedIcon style={{ fontSize: 11, color: COLORS.stockGreen }} />}
              style={{
                height: 18,
                fontSize: 10,
                background: COLORS.stockGreen + '18',
                color: COLORS.stockGreen,
              }}
            />
          ) : (
            <Chip
              label='Bench'
              size='small'
              style={{
                height: 18,
                fontSize: 10,
                background: COLORS.inputBg,
                color: COLORS.darkGray,
              }}
            />
          )}
        </div>
      </div>

      <div className='flex items-center gap-1' style={{ color: COLORS.cricPrimary }}>
        <span className='text-xl font-black tabular-nums'>{match.totalMatchPoints}</span>
        <span className='text-[10px]' style={{ color: COLORS.placeholder }}>
          pts
        </span>
      </div>

      <Tooltip title='Match breakdown' placement='left'>
        <IconButton size='small' onClick={() => setActiveMatch(match)}>
          <InfoOutlinedIcon fontSize='small' style={{ color: COLORS.black }} />
        </IconButton>
      </Tooltip>

      <PlayerDetailDrawer
        match={activeMatch}
        playerId={playerId}
        playerName={playerName}
        onClose={() => setActiveMatch(null)}
      />
    </motion.div>
  )
}
