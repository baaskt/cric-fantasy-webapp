import { CricHeaderRow, CricTableRow } from '@/model/types/cric-table.type'
import React, { useEffect, useState } from 'react'
import CricTable from '../ui/CricTable'
import { SquadEntity } from '@/model/entities/squad.interface'
import { prepareTableData } from '@/util/tables/table'
import CricButton from '../ui/CricButton'
import PlayingXIComposition from './PlayingXIComposition'
import { findTeamComposition, groupPlayersByRole } from '@/util/player'
import { useMutateRequest } from '@/hooks/useMutateRequest'
import { HttpMethod } from '@/model/enum/http-method.enum'
import { TEAMS } from '@/util/constants/endpoints'
import { CricResponse } from '@/model/types/cric-response.type'
import { useTournament } from '@/providers/TournamentProvider'
import { hasMismatch } from '@/util/helper'
import CricAlert from '../ui/CricAlert'
import axios, { AxiosError } from 'axios'
import { TableType } from '@/model/enum/table-type.enum'
import { TeamCompositionEntity } from '@/model/entities/team-composition.interface'
import { useRouter } from 'next/navigation'
import { TITLES } from '@/util/constants/constants'
import PlayingXIListCards from './PlayingXIListCards'
import { MatchEntity } from '@/model/response/match.response'

const headersList: CricHeaderRow[] = [
  { key: 'expand', label: '', alias: '', type: 'expand', isMobile: true },
  {
    key: 'playingXI',
    label: 'Playing XI',
    alias: 'XIs',
    type: 'switch',
    isDisabled: false,
    isMobile: true,
  },
  { key: 'name', label: 'Players', type: 'string', isMobile: true },
  { key: 'role', label: 'Role', type: 'string' },
  { key: 'clubName', label: 'Club', type: 'string' },
  { key: 'points', label: 'Points', alias: 'Pts', type: 'stock', isMobile: true },
  { key: 'statPoints', label: 'Milestone Points', type: 'number' },
  { key: '', label: 'View Player Details', type: 'icon', iconPath: '/detail' },
]

type PlayingXIProps = {
  squad: SquadEntity[]
  isXIChangeAllowed: boolean
  teamId: string
  upcomingMatches: MatchEntity[]
}

function PlayingXI(props: PlayingXIProps) {
  const { activeTournament } = useTournament()
  const router = useRouter()
  const tournamentId = activeTournament?.tournamentId || ''
  const { upcomingMatches, isXIChangeAllowed, teamId } = props
  const [squad, setSquad] = useState<SquadEntity[]>([])
  const [tableData, setTableData] = useState<CricTableRow[]>([])
  const [isXIDirty, setXIDirty] = useState<boolean>(false)
  const [composition, setComposition] = useState<TeamCompositionEntity>({
    isValid: false,
    count: 0,
    bat: 0,
    bowl: 0,
    allRound: 0,
    wk: 0,
  })
  const [error, setError] = useState<string>('')
  const [isPlayingXiUpdateSuccess, setPlayingXiUpdateSuccess] = useState<boolean>(false)
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<Set<number>>(new Set())
  const [playingXISquad, setPlayingXISquad] = useState<Map<string, SquadEntity[]>>(new Map())
  const [defaultPlayerIds, setDefaultPlayerIds] = useState<number[]>([])

  const PLAYING_XI_UPDATE_URL = tournamentId
    ? TEAMS.UPDATE_PLAYINGXI_URL.replace('teamId', teamId).replace('tournamentId', tournamentId)
    : ''
  const updatedPlayingXIRequest = useMutateRequest(PLAYING_XI_UPDATE_URL, HttpMethod.PUT)

  useEffect(() => {
    setSquad(props.squad)
    preparePlayingXIData(props.squad)
    setDefaultIds(props.squad)
  }, [props.squad])

  useEffect(() => {
    const isXIDirty = hasMismatch(Array.from(selectedPlayerIds), defaultPlayerIds)
    setXIDirty(isXIDirty)
  }, [selectedPlayerIds])

  const setDefaultIds = (tempSquad: SquadEntity[]) => {
    const tempDefIds = tempSquad.filter(player => player.playingXI).map(player => player.playerId)
    setDefaultPlayerIds(tempDefIds)
  }

  const prepareTableRows = (tempSquad: SquadEntity[]) => {
    const tempTableData = prepareTableData(
      tempSquad,
      headersList,
      'playerId',
      TableType.PLAYING_XI,
      '',
      { isXIChangeAllowed },
    )
    setTableData(tempTableData)
  }

  const preparePlayingXIData = (tempSquad: SquadEntity[]) => {
    const playersInXI = tempSquad.filter(player => player.playingXI)
    const defaultPlayerIds = new Set(playersInXI.map(player => player.playerId))
    setSelectedPlayerIds(defaultPlayerIds)
    handleSquadAndComposition(playersInXI)
    prepareTableRows(tempSquad)
  }

  const handlePlayingXIToggle = (playerId: number, isToggled: boolean) => {
    const updatedSet = new Set(selectedPlayerIds)
    if (isToggled) {
      updatedSet.add(playerId)
    } else {
      updatedSet.delete(playerId)
    }
    setSelectedPlayerIds(updatedSet)
    const tempSquad = [...squad]
    const playersInXI: SquadEntity[] = []
    tempSquad.forEach(player => {
      const isPlayerinXI = updatedSet.has(player.playerId)
      player.playingXI = isPlayerinXI ? true : false
      if (isPlayerinXI) {
        playersInXI.push(player)
      }
    })
    handleSquadAndComposition(playersInXI)
    prepareTableRows(tempSquad)
  }

  const handleSquadAndComposition = (playersInXI: SquadEntity[]) => {
    const playingXIGroupedSquad = groupPlayersByRole(playersInXI)
    setPlayingXISquad(playingXIGroupedSquad)
    checkComposition(playersInXI)
  }

  const checkComposition = (playersInXI: SquadEntity[]) => {
    const teamComposition: TeamCompositionEntity = findTeamComposition(playersInXI)
    setComposition(teamComposition)
  }

  const handlePlayingXIUpdate = () => {
    void updatePlayingXI()
  }

  const mutateSquadDetails = () => {
    const updatedSquad = squad.map(prop => ({
      ...prop,
      playingXI: selectedPlayerIds?.has(prop.playerId) ? true : false,
    }))
    setSquad(updatedSquad)
    setDefaultIds(updatedSquad)
  }

  const updatePlayingXI = async () => {
    setError('')
    if (!updatedPlayingXIRequest.isMutating) {
      const payload = {
        playingXI: Array.from(selectedPlayerIds),
        nonPlaying: squad
          .filter(player => !selectedPlayerIds?.has(player.playerId))
          .map(player => player.playerId),
      }
      try {
        const response: CricResponse<string> = (await updatedPlayingXIRequest.trigger(
          payload as never,
        )) as CricResponse<string>
        const responseData: string | null = response?.result ? response.result : null

        if (responseData) {
          setPlayingXiUpdateSuccess(true)
          setTimeout(() => {
            setPlayingXiUpdateSuccess(false)
          }, 2000)
        }
        setXIDirty(false)
        mutateSquadDetails()
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError
          const errorMsg = axiosError.response?.data as CricResponse<string>
          setError(errorMsg.error || '')
        }
      }
    }
  }

  const navigateToPlayerDetail = (playerId: string | number) => {
    if (playerId && activeTournament)
      router.push(
        TITLES.PLAYER_DETAIL.fullPath
          .replace('tournamentId', activeTournament.tournamentId.toString())
          .replace('playerId', playerId.toString()),
      )
  }

  if (!tableData.length) return null

  return (
    <div className='flex flex-col w-full pt-5 md:p-5 gap-5'>
      <div className='hidden md:block'>
        <div className='bg-white shadow-lg rounded-lg p-2 border-2 border-gray-300'>
          <PlayingXIComposition
            playingXISquad={playingXISquad}
            playersCount={selectedPlayerIds ? selectedPlayerIds.size : 0}
            composition={composition}
          />
          {isXIDirty && isXIChangeAllowed && composition?.isValid && (
            <div className='pt-5 flex flex-col items-center justify-center'>
              <CricButton
                btnTxt='Save Changes'
                onClick={handlePlayingXIUpdate}
                isLoading={updatedPlayingXIRequest.isMutating}
              />
              <div className='pt-5'>
                <CricAlert message={error} error={error} />
              </div>
            </div>
          )}
        </div>
        <CricTable
          headerList={headersList}
          rowList={tableData}
          fullWidth={false}
          defOrder={'desc'}
          defOrderBy={'points'}
          onRowSelect={navigateToPlayerDetail}
          onRowToggled={(rowId, isToggled) => handlePlayingXIToggle(rowId as number, isToggled)}
        />
      </div>

      <div className='block flex flex-col mb-12 items-center justify-center  md:hidden'>
        <PlayingXIListCards
          isXIChangeAllowed={isXIChangeAllowed}
          upcomingMatches={upcomingMatches}
          playerList={props.squad}
          onRowSelect={navigateToPlayerDetail}
          onToggle={handlePlayingXIToggle}
        />
        <PlayingXIComposition
          playingXISquad={playingXISquad}
          playersCount={selectedPlayerIds ? selectedPlayerIds.size : 0}
          composition={composition}
        />
        <div className='fixed bottom-0 w-full flex flex-col items-center justify-center'>
          {isXIDirty && isXIChangeAllowed && composition?.isValid && (
            <div className='bg-violet-100 w-full p-4 flex flex-col items-center justify-center'>
              <CricButton
                btnTxt='Save Changes'
                onClick={handlePlayingXIUpdate}
                isLoading={updatedPlayingXIRequest.isMutating}
              />
              <div className='pt-2'>
                <CricAlert message={error} error={error} />
              </div>
            </div>
          )}
          {isPlayingXiUpdateSuccess && (
            <div className='pt-2'>
              <CricAlert message={'Playing XI updated successfully'} severity={'success'} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PlayingXI
