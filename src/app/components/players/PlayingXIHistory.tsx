'use client'

import Image from 'next/image'

type Player = {
  playerId: number
  name: string
  role: string
  imageUrl: string
  clubSName: string
}

type Props = {
  playingXIHistory: Record<string, number[]>
  squad: Player[]
}

export default function PlayingXIHistory({ playingXIHistory, squad }: Props) {
  // Convert object → sorted entries (latest first)
  const historyEntries = Object.entries(playingXIHistory).sort(
    (a, b) => Number(b[0]) - Number(a[0]),
  )

  const getPlayersByIds = (ids: number[]) => {
    return ids.map(id => squad.find(p => p.playerId === id)).filter(Boolean) as Player[]
  }

  const formatDate = (dateStr: string) => {
    const year = dateStr.slice(0, 4)
    const month = dateStr.slice(4, 6)
    const day = dateStr.slice(6, 8)

    return new Date(`${year}-${month}-${day}`).toLocaleDateString()
  }

  return (
    <div className='max-w-6xl mx-auto p-4 space-y-6'>
      {historyEntries.map(([date, playerIds]) => {
        const players = getPlayersByIds(playerIds)

        return (
          <div key={date} className='bg-white shadow-md rounded-2xl p-5 space-y-4'>
            {/* Date Header */}
            <div className='flex justify-between items-center'>
              <h2 className='text-lg font-semibold text-gray-800'>{formatDate(date)}</h2>
              <span className='text-sm text-gray-500'>Playing XI ({players.length})</span>
            </div>

            {/* Players Grid */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
              {players.map(player => (
                <div
                  key={player.playerId}
                  className='flex flex-col items-center bg-gray-50 rounded-xl p-3 hover:shadow transition'
                >
                  <div className='w-16 h-16 relative mb-2'>
                    <Image
                      src={player.imageUrl}
                      alt={player.name}
                      fill
                      className='rounded-full object-cover'
                    />
                  </div>

                  <p className='text-sm font-medium text-center'>{player.name}</p>

                  <p className='text-xs text-gray-500'>{player.role}</p>

                  <span className='text-xs mt-1 px-2 py-0.5 bg-gray-200 rounded-full'>
                    {player.clubSName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
