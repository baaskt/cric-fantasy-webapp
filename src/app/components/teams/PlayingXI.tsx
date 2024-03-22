import { CricHeaderRow, CricTableRow } from '@/model/types/cric-table.type'
import React, { useEffect, useMemo, useState } from 'react'
import CricTable from '../ui/CricTable'
import { SquadEntity } from '@/model/entities/squad.interface'
import { preparePlayingXITable } from '@/util/table'
import CricButton from '../ui/CricButton'
import PlayingXIComposition from './PlayingXIComposition'
import { checkValidComposition, groupPlayersByRole } from '@/util/player'
import { useMutateRequest } from '@/hooks/useMutateRequest'
import { HttpMethod } from '@/model/enum/http-method.enum'
import { TEAMS } from '@/util/constants/endpoints'
import { CricResponse } from '@/model/types/cric-response.type'
import { useTournament } from '@/providers/TournamentProvider'
import { hasMismatch } from '@/util/helper'

const headersList: CricHeaderRow[] = [
  { key: 'playingXI', label: 'Playing XI', type: 'switch' },
  { key: 'name', label: 'Players', type: 'string' },
  { key: 'role', label: 'Role', type: 'string' },
  { key: 'clubName', label: 'Club', type: 'string' },
  { key: 'points', label: 'Points', type: 'number' },
  { key: '', label: '', type: 'icon' },
]

type PlayingXIProps = {
  squad: SquadEntity[]
  isXIChangeAllowed: boolean
  teamId: string
}

function PlayingXI(props: PlayingXIProps) {
  const { activeTournament } = useTournament()
  const tournamentId = activeTournament?.tournamentId || ''
  const { isXIChangeAllowed, teamId } = props
  const [squad, setSquad] = useState<SquadEntity[]>([])
  const [tableData, setTableData] = useState<CricTableRow[]>([])
  const [isXIDirty, setXIDirty] = useState<boolean>(false)
  const [isValidComp, setValidComp] = useState<boolean>(false)
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([])
  const [playingXISquad, setPlayingXISquad] = useState<Map<string, SquadEntity[]>>(new Map())
  const PLAYING_XI_UPDATE_URL = tournamentId
    ? TEAMS.UPDATE_PLAYINGXI_URL.replace('teamId', teamId).replace('tournamentId', tournamentId)
    : ''
  const updatedPlayingXIRequest = useMutateRequest(PLAYING_XI_UPDATE_URL, HttpMethod.PUT)

  useEffect(() => {
    setSquad(props.squad)
    prepareTableData(props.squad)
    preparePlayingXIData(props.squad)
  }, [props.squad])

  useEffect(() => {
    const defaultPlayerIds = squad.filter(player => player.playingXI).map(player => player.playerId)
    const isXIDirty = hasMismatch(selectedPlayerIds, defaultPlayerIds)
    setXIDirty(isXIDirty)
  }, [selectedPlayerIds])

  const prepareTableData = (tempSquad: SquadEntity[]) => {
    const tempTableData = preparePlayingXITable(tempSquad, headersList, isXIChangeAllowed)
    setTableData(tempTableData)
  }

  const preparePlayingXIData = (tempSquad: SquadEntity[]) => {
    const playersInXI = tempSquad.filter(player => player.playingXI)
    setSelectedPlayerIds(playersInXI.map(player => player.playerId))

    const playingXIGroupedSquad = groupPlayersByRole(playersInXI)
    setPlayingXISquad(playingXIGroupedSquad)

    checkComposition(playersInXI)
  }

  const handlePlayingXIToggle = (playerIds: number[]) => {
    setSelectedPlayerIds(playerIds)
    const tempSquad = [...squad]
    const playersInXI = tempSquad.filter(player => playerIds.includes(player.playerId))
    const playingXIGroupedSquad = groupPlayersByRole(playersInXI)
    setPlayingXISquad(playingXIGroupedSquad)

    checkComposition(playersInXI)
  }

  const checkComposition = (playersInXI: SquadEntity[]) => {
    const isValid = checkValidComposition(playersInXI)
    setValidComp(isValid)
  }

  const handlePlayingXIUpdate = () => {
    void updatePlayingXI()
  }

  const mutateSquadDetails = (playingXI: number[]) => {
    const updatedSquad = squad.map(prop => ({
      ...prop,
      playingXI: playingXI.includes(prop.playerId) ? true : false,
    }))
    setSquad(updatedSquad)
  }

  const updatePlayingXI = async () => {
    if (!updatedPlayingXIRequest.isMutating) {
      const payload = {
        playingXI: selectedPlayerIds,
        nonPlaying: squad
          .filter(player => !selectedPlayerIds.includes(player.playerId))
          .map(player => player.playerId),
      }
      try {
        const response: CricResponse<string> = (await updatedPlayingXIRequest.trigger(
          payload as never,
        )) as CricResponse<string>
        const responseData: string | null = response?.result ? response.result : null
        console.log(responseData)
        setXIDirty(false)
        mutateSquadDetails(payload.playingXI)
      } catch (e) {
        console.log(e)
      }
    }
  }

  const updatedHeaders = useMemo(
    () =>
      isXIChangeAllowed ? headersList : headersList.filter(header => header.key !== 'playingXI'),
    [isXIChangeAllowed],
  )

  return (
    <div className='flex flex-col w-full gap-5 pt-5 md:p-5'>
      <div className='shadow-lg rounded-lg p-2 border-2 border-gray-300'>
        <PlayingXIComposition
          playingXISquad={playingXISquad}
          playersCount={selectedPlayerIds.length}
          isValidComp={isValidComp}
        />
        {isXIDirty && isXIChangeAllowed && isValidComp && (
          <div className='pt-5 flex justify-center'>
            <CricButton
              btnTxt='Save Changes'
              onClick={handlePlayingXIUpdate}
              isLoading={updatedPlayingXIRequest.isMutating}
            ></CricButton>
          </div>
        )}
      </div>
      <CricTable
        headerList={updatedHeaders}
        rowList={tableData}
        fullWidth={false}
        defOrder={'asc'}
        defOrderBy={'role'}
        checkedIds={selectedPlayerIds}
        onRowToggled={playerIds => handlePlayingXIToggle(playerIds as Array<number>)}
      />
    </div>
  )
}

export default PlayingXI
