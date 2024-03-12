import { cookieHelper } from '@/lib/cookieHelper'
import { TournamentContextType } from '@/model/context/tournamentContextType'
import { TournamentEntity } from '@/model/response/tournament.interface'
import React, { createContext, useContext, useState } from 'react'

const ListContext = createContext<TournamentContextType>({} as TournamentContextType)
const { Provider } = ListContext

export const TOURNAMENT_ID = 'tournamentId'

export const TournamentProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTournament, setActiveTournament] = useState<TournamentEntity>()
  const [tournamentList, setTournamentList] = useState<TournamentEntity[]>([])

  const addTournament = (newData: TournamentEntity) => {
    setTournamentList([...tournamentList, newData])
  }

  const updateTournament = (id: string, newData: TournamentEntity) => {
    const updatedList = tournamentList.map((item: TournamentEntity) => {
      if (item.tournamentId === id) {
        return { ...item, ...newData }
      }
      return item
    })
    setTournamentList(updatedList)
  }

  const markActiveTournament = (activeTournament: TournamentEntity) => {
    cookieHelper().setCookieItem(TOURNAMENT_ID, activeTournament.tournamentId)
    setActiveTournament(activeTournament)
  }

  const value: TournamentContextType = {
    activeTournament,
    markActiveTournament,
    tournamentList,
    setTournamentList,
    addTournament,
    updateTournament,
  }

  return <Provider value={value}>{children}</Provider>
}

export const useTournament = () => useContext(ListContext)
