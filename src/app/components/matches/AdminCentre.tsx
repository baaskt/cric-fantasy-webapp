import { OptionsEntity } from '@/model/entities/options.interface'
import { MatchDetailEntity } from '@/model/response/match-detail.interface'
import React, { useEffect, useState } from 'react'
import CricSelect from '../ui/CricSelect'
import { COLORS } from '@/util/colors'
import PlayerDotsUpdate from '../PlayerDotsUpdate'
import CricButton from '../ui/CricButton'
import { Divider } from '@mui/material'
import { PlayerDotsEntity } from '@/model/entities/player-dots.interface'
import { CricResponse } from '@/model/types/cric-response.type'
import { UpdateAdminCentreRequest } from '@/model/request/update-admin-centre-request.type'
import { useMutateRequest } from '@/hooks/useMutateRequest'
import { MATCHES } from '@/util/constants/endpoints'
import { useTournament } from '@/providers/TournamentProvider'
import { HttpMethod } from '@/model/enum/http-method.enum'
import CricToast from '../ui/CricToast'

type AdminCentreProps = {
  scoreCardData: MatchDetailEntity
}

function AdminCentre(props: AdminCentreProps) {
  const { scoreCardData } = props
  const inningsOneBowlers = scoreCardData.inningsOne.bowling
  const inningsTwoBowlers = scoreCardData.inningsTwo.bowling
  const [playersList, setPlayersList] = useState<OptionsEntity[]>([])
  const [inningsOneDots, setInningsOneDots] = useState<PlayerDotsEntity[]>([])
  const [inningsTwoDots, setInningsTwoDots] = useState<PlayerDotsEntity[]>([])
  const [juryPlayer, setJuryPlayer] = useState<OptionsEntity>()
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false)
  const { activeMatch, activeTournament } = useTournament()

  const matchId = activeMatch?.matchId || 0
  const tournamentId = activeTournament?.tournamentId || ''
  const UPDATE_DOTS_URL = MATCHES.UPDATE_DOTS_URL.replace('matchId', matchId.toString()).replace(
    'tournamentId',
    tournamentId,
  )
  const updateDotsRequest = useMutateRequest(UPDATE_DOTS_URL, HttpMethod.PUT)

  useEffect(() => {
    if (scoreCardData) {
      const tempPlayersList: OptionsEntity[] = []
      const inningsOnePlayers = scoreCardData.inningsOne.batting
      const inningsTwoPlayers = scoreCardData.inningsTwo.batting
      const totalPlayers = [...inningsOnePlayers, ...inningsTwoPlayers]
      totalPlayers.forEach(player => {
        const tempPlayer: OptionsEntity = {
          id: player.batId,
          label: player.batName,
          value: player.batId,
        }
        tempPlayersList.push(tempPlayer)
      })
      setPlayersList(tempPlayersList)
    }
  }, [scoreCardData])

  const handleSave = () => {
    void saveChanges()
  }

  const saveChanges = async () => {
    setUpdateSuccess(false)
    const payload: UpdateAdminCentreRequest = {
      dots: [...inningsOneDots, ...inningsTwoDots],
      ppom: juryPlayer?.id
        ? Number(juryPlayer.id)
        : scoreCardData.peoplePlayerOfTheMatch
          ? scoreCardData.peoplePlayerOfTheMatch.playerId
          : 0,
    }
    try {
      const response: CricResponse<string> = (await updateDotsRequest.trigger(
        payload as never,
      )) as CricResponse<string>
      console.log(response)
      setUpdateSuccess(true)
    } catch (e) {
      console.log(e)
      setUpdateSuccess(false)
    }
  }

  const handlePlayerSelect = (selectedPlayer: OptionsEntity) => {
    setJuryPlayer(selectedPlayer)
  }

  return (
    <div>
      <div>
        <div className='flex flex-col'>
          <div
            className='text-center text-xl p-3 w-9/12 rounded-r-3xl'
            style={{ backgroundColor: COLORS.cricPrimary, color: COLORS.white }}
          >
            Jury Centre
          </div>
          <div className='w-64 p-5 flex justify-center items-center'>
            <CricSelect
              defaultValue={scoreCardData.peoplePlayerOfTheMatch.playerId}
              label={'Jury Player'}
              menuList={playersList}
              onChange={handlePlayerSelect}
            />
          </div>
        </div>
        <div
          className='text-center text-xl p-3 w-9/12 rounded-r-3xl'
          style={{ backgroundColor: COLORS.cricPrimary, color: COLORS.white }}
        >
          Dots Centre
        </div>
        <div className='flex flex-col md:flex-row'>
          <div className='flex justify-center w-full md:w-6/12'>
            <PlayerDotsUpdate
              bowlers={inningsOneBowlers}
              teamName={scoreCardData.inningsTwo.battingTeam}
              onChange={setInningsOneDots}
            />
          </div>
          <Divider
            orientation='vertical'
            flexItem
            className='hidden md:block'
            sx={{ borderWidth: 2, borderColor: COLORS.cricPrimary }}
          />
          <div className='flex justify-center w-full md:w-6/12'>
            <PlayerDotsUpdate
              bowlers={inningsTwoBowlers}
              teamName={scoreCardData.inningsOne.battingTeam}
              onChange={setInningsTwoDots}
            />
          </div>
        </div>
      </div>
      <div className='flex justify-center p-10'>
        <CricButton
          btnTxt='Save Changes'
          onClick={handleSave}
          isFullWidth
          isLoading={updateDotsRequest.isMutating}
        />
      </div>
      <CricToast open={updateSuccess} message='Update successfull' onClose={setUpdateSuccess} />
    </div>
  )
}

export default AdminCentre
