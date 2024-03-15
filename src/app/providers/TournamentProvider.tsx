import { useRequest } from '@/hooks/useRequest'
import { auth } from '@/lib/auth'
import { cookieHelper } from '@/lib/cookieHelper'
import { TournamentContextType } from '@/model/context/tournamentContextType'
import { TournamentEntity } from '@/model/response/tournament.interface'
import { CricResponse } from '@/model/types/cric-response.type'
import { TOURNAMENTS } from '@/util/constants/endpoints'
import React, { createContext, useContext, useEffect, useState } from 'react'

const ListContext = createContext<TournamentContextType>({} as TournamentContextType)
const { Provider } = ListContext

export const TOURNAMENT_ID = 'tournamentId'

export const TournamentProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTournament, setActiveTournament] = useState<TournamentEntity>()
  const [tournamentList, setTournamentList] = useState<TournamentEntity[]>([])
  const [subTitle, setSubTitle] = useState<string>('')

  const tournamentId = auth().getTournamentId()
  const TOURNAMENT_URL = `${TOURNAMENTS.GET_BY_ID_URL.replace('tournamentId', tournamentId)}`
  const tournamentRequest = useRequest(tournamentId ? TOURNAMENT_URL : '')

  useEffect(() => {
    if (tournamentRequest.data) {
      const tournamentResponse: CricResponse<TournamentEntity> =
        tournamentRequest.data as CricResponse<TournamentEntity>
      if (tournamentResponse.result) {
        markActiveTournament(tournamentResponse.result)
      }
    }
  }, [tournamentRequest?.data])

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
    subTitle,
    setSubTitle,
  }

  return <Provider value={value}>{children}</Provider>
}

export const useTournament = () => useContext(ListContext)
