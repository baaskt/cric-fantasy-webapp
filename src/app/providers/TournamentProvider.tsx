import { TournamentContextType } from '@/model/context/tournamentContextType'
import { TournamentEntity } from '@/model/response/tournament.interface'
import React, { createContext, useContext, useState } from 'react'

const ListContext = createContext<TournamentContextType>(
  {} as TournamentContextType,
)
const { Provider } = ListContext

export const TournamentProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
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

  const value: TournamentContextType = {
    tournamentList,
    setTournamentList,
    addTournament,
    updateTournament,
  }

  return <Provider value={value}>{children}</Provider>
}

export const useTournament = () => useContext(ListContext)
