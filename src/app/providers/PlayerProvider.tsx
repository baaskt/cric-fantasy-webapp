import { cookieHelper } from '@/lib/cookieHelper'
import { PlayerContextType } from '@/model/context/playerContextType'
import React, { createContext, useContext, useState } from 'react'

const PlayerContext = createContext<PlayerContextType>({} as PlayerContextType)
const { Provider } = PlayerContext

export const PLAYER_ID = 'playerId'

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [activePlayerId, setActivePlayerId] = useState<number>()

  const markActivePlayer = (playerId: number) => {
    cookieHelper().setCookieItem(PLAYER_ID, playerId.toString())
    setActivePlayerId(playerId)
  }

  const value: PlayerContextType = {
    activePlayerId,
    markActivePlayer,
  }

  return <Provider value={value}>{children}</Provider>
}
export const usePlayer = () => useContext(PlayerContext)
