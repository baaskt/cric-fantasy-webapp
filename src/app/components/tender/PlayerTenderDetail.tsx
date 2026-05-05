'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import GavelIcon from '@mui/icons-material/Gavel'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { PlayerDetailEntity } from '@/model/response/player-detail.response.interface'
import { TenderBidEntity } from '@/model/response/tender-player.interface'
import PlayerTenderHero from './PlayerTenderHero'
import { useTournament } from '@/providers/TournamentProvider'
import { HttpMethod } from '@/model/enum/http-method.enum'
import { useMutateRequest } from '@/hooks/useMutateRequest'
import { TEAMS } from '@/util/constants/endpoints'
import TenderBidHistory from './TenderBidHistory'
import { PlaceBidRequest } from '@/model/request/place-bid.request'
import { TenderStatus } from '@/model/enum/tender-status.enum'
import TenderHistory from './TenderHistory'
import { Toast } from '../ui/Toast'
import { TimeRemaining, getTimeRemainingFromUtc } from '@/util/helper'

const PRESET_AMOUNTS = [
  { label: '50 pts', value: 50 },
  { label: '100 pts', value: 100 },
  { label: '200 pts', value: 200 },
  { label: '400 pts', value: 400 },
  { label: '500 pts', value: 500 },
  { label: '1000 pts', value: 1000 },
]

interface PlayerTenderDetailProps {
  playerTenderBids: TenderBidEntity[]
  playerData: PlayerDetailEntity
  tenderStatus: string
}

export default function PlayerTenderDetail({
  tenderStatus,
  playerTenderBids,
  playerData,
}: PlayerTenderDetailProps) {
  const basePrice = playerData.auction.basePrice

  const [userBids, setUserBids] = useState<TenderBidEntity[]>(playerTenderBids)
  const [inputValue, setInputValue] = useState('')
  const [isBidPlaced, setIsBidPlaced] = useState(false)
  const [activePreset, setActivePreset] = useState<number | null>(null)
  const [toast, setToast] = useState({ visible: false, message: '' })
  const { activeTournament } = useTournament()
  const tournamentId = activeTournament?.tournamentId || ''
  const placeBidRequest = useMutateRequest(TEAMS.POST_TENDER_BID, HttpMethod.POST)
  const [endTimeRemaining, setEndTimeRemaining] = useState<TimeRemaining>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [revealTimeRemaining, setRevealTimeRemaining] = useState<TimeRemaining>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const updateTimers = () => {
      const endTime = getTimeRemainingFromUtc(activeTournament?.tenderEndTime)

      const revealTime = getTimeRemainingFromUtc(activeTournament?.tenderRevealTime)

      if (endTime) setEndTimeRemaining(endTime)
      if (revealTime) setRevealTimeRemaining(revealTime)
    }

    updateTimers()
    const interval = setInterval(updateTimers, 1000)

    return () => clearInterval(interval)
  }, [activeTournament])

  useEffect(() => {
    if (activeTournament?.teamId) {
      const existingBid = playerTenderBids.find(bid => bid.teamId === activeTournament.teamId)
      if (existingBid?.teamId) setIsBidPlaced(true)
    }
  }, [playerTenderBids])

  const showToast = useCallback((message: string) => {
    setToast({ visible: true, message })
    setTimeout(() => setToast({ visible: false, message: '' }), 2600)
  }, [])

  const handlePreset = (value: number) => {
    setInputValue(String(value))
    setActivePreset(value)
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '') // remove non-digits
    setInputValue(cleaned)
    setActivePreset(null)
  }

  const handlePlaceBid = async () => {
    if (isBidPlaced) {
      showToast(`Only one bid allowed per team ⚠️`)
      return
    }
    const amount = parseInt(inputValue)
    if (activeTournament?.teamId) {
      const payload: PlaceBidRequest = {
        teamId: activeTournament.teamId,
        tournamentId: tournamentId,
        bidAmount: amount,
      }
      try {
        await placeBidRequest.trigger(payload as never)
        setInputValue('')
        setActivePreset(null)
        showToast(`Bid placed: ${amount} points ✓`)
        setUserBids(prev => [
          {
            teamId: activeTournament.teamId,
            teamName: activeTournament.teamName,
            amount: amount,
            timeOfBid: new Date().toISOString(),
          },
          ...prev,
        ])
      } catch (error) {
        showToast('Failed to place bid. Please try again.')
      }
    }
  }

  const endTimeTotal = useMemo(() => {
    return endTimeRemaining.hours + endTimeRemaining.minutes + endTimeRemaining.seconds
  }, [endTimeRemaining])

  const revealTimeTotal = useMemo(() => {
    return revealTimeRemaining.hours + revealTimeRemaining.minutes + revealTimeRemaining.seconds
  }, [revealTimeRemaining])

  return (
    <div className='min-h-screen bg-indigo-50 px-3 py-4 pb-2'>
      <div className='max-w-md mx-auto'>
        <div className='flex flex-col items-center justify-between mb-4'>
          <div className='flex items-center gap-1.5 bg-white border border-indigo-200 rounded-full px-3 py-1.5'>
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${tenderStatus === TenderStatus.CLOSED.toString() ? 'bg-red-500' : 'bg-green-500'}`}
            />
            <span className='text-xs font-bold text-indigo-800'>
              {tenderStatus === TenderStatus.CLOSED.toString()
                ? 'Tender closed'
                : endTimeTotal
                  ? 'Live Tender closes in'
                  : 'Winner will be revealed in'}
            </span>
          </div>
          {tenderStatus === TenderStatus.OPEN.toString() && endTimeTotal ? (
            <div className='mt-2 flex flex-col items-center justify-center'>
              <div className='font-bold text-xs text-indigo-800'>
                <span className='pr-1'>
                  {String(endTimeRemaining.hours).padStart(2, '0')} hours
                </span>
                <span className='pr-1'>
                  {String(endTimeRemaining.minutes).padStart(2, '0')} mins
                </span>
                <span>{String(endTimeRemaining.seconds).padStart(2, '0')} seconds</span>
              </div>
            </div>
          ) : tenderStatus === TenderStatus.OPEN.toString() && revealTimeTotal ? (
            <div className='mt-2 flex flex-col items-center justify-center'>
              <div className='font-bold text-xs text-indigo-800'>
                <span className='pr-1'>
                  {String(revealTimeRemaining.hours).padStart(2, '0')} hours
                </span>
                <span className='pr-1'>
                  {String(revealTimeRemaining.minutes).padStart(2, '0')} mins
                </span>
                <span>{String(revealTimeRemaining.seconds).padStart(2, '0')} seconds</span>
              </div>
            </div>
          ) : null}
        </div>
        {tenderStatus === TenderStatus.CLOSED.toString() ? (
          <div className='p-2 text-indigo-800 font-bold text-sm'>Previous player in Bidding</div>
        ) : null}
        <PlayerTenderHero playerData={playerData} />

        {/* Bid placement */}
        {tenderStatus === TenderStatus.OPEN.toString() ? (
          <div className='bg-white rounded-2xl border border-indigo-100 p-4 mb-3'>
            <p className='text-sm font-bold text-indigo-800 flex items-center gap-2 mb-3'>
              <GavelIcon fontSize='small' className='text-indigo-500' />
              Place Your Bid
            </p>
            {/* Preset grid */}
            <div className='grid grid-cols-3 gap-2 mb-3'>
              {PRESET_AMOUNTS.map(p => (
                <button
                  key={p.value}
                  onClick={() => handlePreset(p.value)}
                  className={`text-xs font-semibold py-2.5 rounded-xl border transition-all active:scale-95 ${
                    activePreset === p.value
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {/* Input */}
            <div className='relative mb-3'>
              <input
                type='number'
                inputMode='numeric'
                value={inputValue}
                onChange={handleInput}
                placeholder='Enter points value '
                min={basePrice}
                step={500_000}
                className='w-full pl-2 pr-4 py-3.5 border border-indigo-200 rounded-xl text-lg font-bold text-indigo-800 bg-indigo-50 outline-none focus:border-indigo-500 focus:bg-white transition-colors placeholder:text-indigo-200'
              />
            </div>
            {/* Submit */}
            <button
              onClick={() => void handlePlaceBid()}
              disabled={!inputValue}
              className='w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 active:scale-[0.99] text-white font-bold text-sm py-4 rounded-xl transition-all disabled:bg-indigo-200'
            >
              <CheckCircleOutlineIcon fontSize='small' />
              Place Bid
            </button>
          </div>
        ) : null}

        {/* Bid history */}
        <div className='bg-white rounded-2xl border border-indigo-100 p-4'>
          <p className='text-sm font-bold text-indigo-800 flex items-center gap-2 mb-3'>
            Bidding History {playerData.name && `of ${playerData.name}`}
          </p>

          {userBids.length === 0 ? (
            <p className='text-center text-sm text-indigo-300 py-6'>
              {tenderStatus === TenderStatus.OPEN.toString()
                ? 'No bids yet — be the first!'
                : 'No bids - Player was unsold'}
            </p>
          ) : (
            <div className='flex flex-col gap-2'>
              {userBids.map((bid, i) => (
                <TenderBidHistory
                  tenderStatus={tenderStatus}
                  myTeamId={activeTournament?.teamId}
                  key={bid.teamId}
                  bid={bid}
                  rank={i + 1}
                />
              ))}
            </div>
          )}
        </div>
        <div className='bg-white rounded-2xl border border-indigo-100 p-4 mt-2'>
          <div className='text-sm font-bold text-indigo-800 flex flex-col gap-1 mb-3'>
            Tender History{' '}
            <div className='text-indigo-400'>
              {activeTournament?.tournamentName && `(${activeTournament.tournamentName})`}
            </div>
          </div>

          <TenderHistory
            activePlayerId={playerData.playerId.toString()}
            tenderStatus={tenderStatus}
          />
        </div>
      </div>

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  )
}
