import { CricHeaderRow, CricTableRow } from '@/model/types/cric-table.type'
import React, { useEffect, useMemo, useState } from 'react'
import CricTable from '../ui/CricTable'
import { SquadEntity } from '@/model/entities/squad.interface'
import { preparePlayingXITable } from '@/util/table'
import CricButton from '../ui/CricButton'
import { COLORS } from '@/util/colors'
import PlayingXIComposition from './PlayingXIComposition'
import { WK, groupPlayersByRole } from '@/util/player'
import { useMutateRequest } from '@/hooks/useMutateRequest'
import { HttpMethod } from '@/model/enum/http-method.enum'
import { TEAMS } from '@/util/constants/endpoints'
import { CricResponse } from '@/model/types/cric-response.type'
import { useTournament } from '@/providers/TournamentProvider'

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
  const { squad, isXIChangeAllowed, teamId } = props
  const [tableData, setTableData] = useState<CricTableRow[]>([])
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([])
  const [playingXISquad, setPlayingXISquad] = useState<Map<string, SquadEntity[]>>(new Map())
  const PLAYING_XI_UPDATE_URL = tournamentId
    ? TEAMS.UPDATE_PLAYINGXI_URL.replace('teamId', teamId).replace('tournamentId', tournamentId)
    : ''
  const updatedPlayingXIRequest = useMutateRequest(PLAYING_XI_UPDATE_URL, HttpMethod.PUT)

  useEffect(() => {
    const tempTableData = preparePlayingXITable(squad, headersList, isXIChangeAllowed)
    setTableData(tempTableData)

    const playersInXI = squad.filter(player => player.playingXI)
    const playingXIGroupedSquad = groupPlayersByRole(playersInXI)
    setPlayingXISquad(playingXIGroupedSquad)
  }, [squad])

  const handlePlayingXIToggle = (playerIds: number[]) => {
    setSelectedPlayerIds(playerIds)
    const tempSquad = [...squad]
    const playersInXI = tempSquad.filter(player => playerIds.includes(player.playerId))
    const playingXIGroupedSquad = groupPlayersByRole(playersInXI)
    setPlayingXISquad(playingXIGroupedSquad)
  }

  const handlePlayingXIUpdate = () => {
    void updatePlayingXI()
  }

  const updatePlayingXI = async () => {
    if (!updatedPlayingXIRequest.isMutating) {
      const payload = {
        playingXI: selectedPlayerIds,
      }
      try {
        const response: CricResponse<string> = (await updatedPlayingXIRequest.trigger(
          payload as never,
        )) as CricResponse<string>
        const responseData: string | null = response?.result ? response.result : null
        console.log(responseData)
      } catch (e) {
        console.log(e)
      } finally {
        setSelectedPlayerIds([])
        setPlayingXISquad(new Map())
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
        />
        {isXIChangeAllowed && playingXISquad.has(WK) && selectedPlayerIds.length === 11 && (
          <div className='pt-5 flex justify-center'>
            <CricButton
              btnTxt='Save Changes'
              color={COLORS.white}
              bgColor={COLORS.cricPrimary}
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
        onRowToggled={playerIds => handlePlayingXIToggle(playerIds as Array<number>)}
      />
    </div>
  )
}

export default PlayingXI
