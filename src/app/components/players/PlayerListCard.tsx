import { SoldStatus } from '@/model/enum/sold-status.enum'
import { PlayersListEntity } from '@/model/response/player-list.response.interface'
import { ALTERNATE_PLAYER_IMAGE_SRC } from '@/util/constants/constants'

interface PlayerListCardProps {
  player: PlayersListEntity
  playerIndex: number
  soldStatus?: string
  diff: number
  playerUrl: string
  onPlayerDetail: (playerId: number) => void
}
const PlayerListCard = (props: PlayerListCardProps) => {
  const { player, playerIndex, playerUrl, soldStatus, diff, onPlayerDetail } = props

  return (
    <div
      key={player.playerId}
      className={`flex justify-between items-center p-4 rounded-xl w-full transition-transform duration-150 ease-in-out shadow-md active:scale-95`}
    >
      <div
        className='flex items-center gap-3 flex-1 cursor-pointer'
        onClick={() => onPlayerDetail(player.playerId)}
      >
        <div
          className={`font-bold rounded-lg w-10 h-10 flex justify-center items-center bg-blue-50 text-blue-500`}
        >
          {playerIndex + 1}
        </div>
        <div className='relative flex items-center flex-col gap-2'>
          <img
            src={playerUrl || ALTERNATE_PLAYER_IMAGE_SRC}
            alt='team'
            className='w-12 h-12 rounded-full object-cover border-4 border-white shadow-md'
          />
        </div>

        {/* Player Info */}
        <div>
          <div className='font-semibold text-md text-violet-500'>{player.name}</div>
          <div className='text-sm text-gray-500'>{player.role}</div>
          <div className='text-sm text-blue-500 mt-2'>{player.teamName}</div>
          <div className='flex flex-col gap-1'>
            {player.totalMilestonePoints ? (
              <div className='text-sm text-blue-600'>
                Milestone: {player.totalMilestonePoints} points
              </div>
            ) : null}
            {diff && soldStatus !== SoldStatus.UNSOLD ? (
              <div className='text-sm text-red-600'>Missed in XI: {diff} points</div>
            ) : null}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className='flex items-center gap-4'>
        {/* Points */}
        <div className='text-right'>
          {!isNaN(diff) && (
            <div className='font-bold text-xl text-gray-700'>
              {soldStatus === SoldStatus.UNSOLD || soldStatus === SoldStatus.TENDER_UNSOLD
                ? player.totalPoints
                : player.totalPlayingXIPoints}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PlayerListCard
