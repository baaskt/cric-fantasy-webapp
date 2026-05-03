import { TenderStatus } from '@/model/enum/tender-status.enum'
import { TenderBidEntity } from '@/model/response/tender-player.interface'
import { formatTimeAgo, getInitials } from '@/util/helper'
import LockIcon from '@mui/icons-material/Lock'
const TEAM_BG = [
  'bg-indigo-100 text-indigo-700',
  'bg-cyan-100 text-cyan-700',
  'bg-emerald-100 text-emerald-700',
  'bg-red-100 text-red-700',
  'bg-purple-100 text-purple-700',
  'bg-amber-100 text-amber-700',
]

interface TenderBidHistoryProps {
  bid: TenderBidEntity
  rank: number
  myTeamId?: string | undefined
  tenderStatus: string
}

function TenderBidHistory(props: TenderBidHistoryProps) {
  const { bid, rank, myTeamId, tenderStatus } = props
  const colorClass = TEAM_BG[rank % TEAM_BG.length]
  return (
    <div
      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border ${'bg-indigo-50 border-indigo-300'}`}
    >
      {/* Rank badge */}
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${'bg-amber-100 text-amber-700'}`}
      >
        {rank}
      </div>

      {/* Team avatar */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 ${colorClass}`}
      >
        {getInitials(bid.teamName)}
      </div>

      {/* Info */}
      <div className='flex-1 min-w-0'>
        <p className='text-sm font-semibold text-gray-800 truncate'>{bid.teamName}</p>
        <p className='text-[10px] text-gray-400'>{formatTimeAgo(bid.timeOfBid)}</p>
      </div>
      {/* Amount */}
      <div className='flex items-center gap-1 shrink-0'>
        {bid.teamId.toString() !== myTeamId?.toString() && tenderStatus === TenderStatus.OPEN ? (
          <span className='text-md font-semibold text-indigo-600 flex items-center gap-0.5'>
            <LockIcon sx={{ fontSize: 12 }} />
          </span>
        ) : (
          <span className={`text-sm font-bold text-purple-600`}>{bid.amount}</span>
        )}
      </div>
    </div>
  )
}
export default TenderBidHistory
