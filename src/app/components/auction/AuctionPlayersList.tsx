import { useRequest } from '@/hooks/useRequest'
import { CricResponse } from '@/model/types/cric-response.type'
import { PLAYERS } from '@/util/constants/endpoints'
import React, { useEffect, useState } from 'react'
import Loading from '../Loading'
import { NO_CACHE, PLAYER } from '@/util/constants/constants'
import CricTable from '../ui/CricTable'
import { OptionsEntity } from '@/model/entities/options.interface'
import { AuctionPlayerEntity } from '@/model/response/auction-player-response.interface'
import { useAuction } from '@/providers/AuctionProvider'
import { CricHeaderRow, CricTableRow } from '@/model/types/cric-table.type'
import { COLORS } from '@/util/colors'
import { useTournament } from '@/providers/TournamentProvider'
import CricButton from '../ui/CricButton'
import FlagIcon from '@mui/icons-material/Flag'
import { useRouter } from 'next/navigation'
import { useMutateRequest } from '@/hooks/useMutateRequest'
import { HttpMethod } from '@/model/enum/http-method.enum'
import { prepareTableData } from '@/util/tables/table'
import { TableType } from '@/model/enum/table-type.enum'
import RestartAltIcon from '@mui/icons-material/RestartAlt'

const headersList: CricHeaderRow[] = [
  { key: 'expand', label: '', alias: '', type: 'expand', isMobile: true },
  // { key: 'sno', label: 'S.No', type: 'number', isMobile: true },
  { key: 'name', label: 'Players', type: 'string', isMobile: true },
  { key: 'clubName', label: 'Club / Country', type: 'string' },
  { key: 'basePrice', label: 'Base Price', type: 'currency', isMobile: false },
  { key: 'role', label: 'Role', type: 'number', isMobile: true },
  { key: 'category', label: 'Category', type: 'string', isMobile: false },
  { key: 'soldStatus', label: 'Auction Status', alias: 'Status', type: 'number', isMobile: true },
]

type AuctionPlayersListProps = {
  selectedTab: OptionsEntity
  categories: OptionsEntity[]
  onPlayerReset: () => void
}

function AuctionPlayersList(props: AuctionPlayersListProps) {
  const router = useRouter()
  const { activeTournament } = useTournament()
  const { activeCategory, playersList, setPlayersList, lastAuctionPlayer } = useAuction()
  const [tableData, setTableData] = useState<CricTableRow[]>([])
  const [error, setError] = useState<boolean>(false)
  const playerSetType = props.selectedTab.value
  const tournamentId = activeTournament?.tournamentId || ''
  const SOLD_CATEGORY_URL =
    props.selectedTab.id === 7
      ? PLAYERS.GET_AUCTION_UNSOLD_PLAYERS_URL
      : PLAYERS.GET_AUCTION_PLAYERS_URL
  const PLAYERS_URL = tournamentId
    ? `${SOLD_CATEGORY_URL.replace('tournamentId', tournamentId)}${playerSetType}`
    : ''
  const [selectedIds, setSelectedIds] = React.useState<(string | number)[]>([])

  const auctionPlayersRequest = useRequest(PLAYERS_URL, NO_CACHE)

  const RESET_PLAYER_URL = tournamentId
    ? PLAYERS.RESET_UNSOLD_PLAYER.replace('tournamentId', tournamentId)
    : ''
  const resetPlayerStatusRequest = useMutateRequest(RESET_PLAYER_URL, HttpMethod.PUT)

  useEffect(() => {
    if (auctionPlayersRequest?.data) {
      const auctionPlayersResponse: CricResponse<AuctionPlayerEntity[]> =
        auctionPlayersRequest.data as CricResponse<AuctionPlayerEntity[]>
      if (auctionPlayersResponse.result) {
        setError(false)
        setPlayersList(auctionPlayersResponse.result)
      } else {
        setError(true)
      }
    }
  }, [setPlayersList, auctionPlayersRequest?.data])

  useEffect(() => {
    if (playersList) {
      prepareTableRows(playersList)
    }
  }, [playersList, playerSetType])

  const prepareTableRows = (playersList: AuctionPlayerEntity[]) => {
    if (playersList.length) {
      // const tempTableData: CricTableRow[] = prepareAuctionPlayersTable(playersList, headersList)
      let tempTableData: CricTableRow[] = []
      tempTableData = prepareTableData(
        playersList,
        headersList,
        'playerId',
        TableType.AUCTION,
        'totalPoints',
      )
      setTableData(tempTableData)
    }
  }

  if (auctionPlayersRequest.isValidating) {
    return <Loading txt={PLAYER.LOADING_TXT}></Loading>
  }

  if (auctionPlayersRequest.error) {
    return <p>Error: {auctionPlayersRequest.error.message}</p>
  }

  if ((!playersList?.length && !auctionPlayersRequest.isValidating) || error) {
    return <p className='p-5'>No players found</p>
  }

  const beginAuction = () => {
    const redirectUrl = 'auction/board'
    router.push(redirectUrl)
  }

  const handlePlayerStatus = () => {
    void resetPlayerStatus()
  }

  const resetPlayerStatus = async () => {
    const payload = {
      playerId: selectedIds,
      key: 'soldStatus',
      value: 'NOT_AUCTIONED',
    }
    try {
      const response: CricResponse<string> = (await resetPlayerStatusRequest.trigger(
        payload as never,
      )) as CricResponse<string>
      const responseData: string | null = response?.result ? response.result : null
      console.log(responseData)
    } catch (e) {
      console.log(e)
    } finally {
      await auctionPlayersRequest.mutate()
      props.onPlayerReset()
      setSelectedIds([])
    }
  }

  return (
    <div className='p-5'>
      <div className='pb-5' style={{ color: COLORS.cricPrimary }}>
        {tableData?.length} {tableData?.length > 1 ? 'players' : 'player'}
      </div>
      <CricTable
        headerList={headersList}
        rowList={tableData}
        fullWidth={false}
        isSelectable={activeTournament?.isHost}
        isResetCheck={!selectedIds?.length}
        onRowChecked={setSelectedIds}
      />
      <div className='flex gap-4 justify-center pt-16'>
        {activeTournament?.isHost && !lastAuctionPlayer && (
          <CricButton
            startIcon={<FlagIcon />}
            onClick={() => beginAuction()}
            btnTxt={`Begin auction for ${activeCategory?.label}`}
          ></CricButton>
        )}
        {activeTournament?.isHost && (
          <CricButton
            startIcon={<RestartAltIcon />}
            onClick={() => handlePlayerStatus()}
            btnTxt={`Reset player Status`}
            isLoading={resetPlayerStatusRequest?.isMutating}
          ></CricButton>
        )}
      </div>
    </div>
  )
}

export default AuctionPlayersList
