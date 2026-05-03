'use client'

import React, { useEffect, useState } from 'react'
import { TOURNAMENTS } from '@/util/constants/endpoints'
import { useRequest } from '@/hooks/useRequest'
import { CricResponse } from '@/model/types/cric-response.type'
import { TenderPlayerEntity } from '@/model/response/tender-player.interface'
import { useTournament } from '@/providers/TournamentProvider'
import { useRouter } from 'next/navigation'
import { TITLES } from '@/util/constants/constants'

function DailyTender() {
  const { activeTournament } = useTournament()
  const tournamentId = activeTournament?.tournamentId || ''
  const router = useRouter()

  const TENDER_PLAYER_URL = tournamentId
    ? TOURNAMENTS.GET_TENDER_PLAYER.replace('tournamentId', tournamentId)
    : ''
  const tenderPlayerRequest = useRequest(activeTournament?.canTender ? TENDER_PLAYER_URL : '')

  useEffect(() => {
    if (tenderPlayerRequest.data) {
      const spinPlayerResponse: CricResponse<TenderPlayerEntity[]> =
        tenderPlayerRequest.data as CricResponse<TenderPlayerEntity[]>
      if (spinPlayerResponse.result && spinPlayerResponse.result.length) {
      }
    }
  }, [tenderPlayerRequest.data])

  const handleTenderClick = () => {
    if (activeTournament) {
      router.push(
        TITLES.TENDER.fullPath.replace('tournamentId', activeTournament.tournamentId.toString()),
      )
    }
  }

  if (activeTournament?.canTender) {
    return null
  }

  return (
    <div
      onClick={handleTenderClick}
      className='flex justify-content m-4 relative w-[90%] rounded-2xl p-3 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-95'
    >
      {/* Glow effect */}
      <div className='absolute inset-0 bg-white/10 rounded-2xl blur-xl opacity-20'></div>

      <div className='relative flex items-center justify-between'>
        {/* Left Content */}
        <div>
          <div className='flex flex-row gap-2 font-bold items-center'>
            <span className='m-2 w-3 h-3 bg-green-500 rounded-full'></span>
            Live
          </div>
          <h2 className='font-pacifico text-2xl'>Tender of the Day</h2>
          <p className='text-sm opacity-90 mt-1'>A new tender just opened — tap to explore</p>
        </div>

        {/* Right CTA */}
        <div className='flex items-center gap-2 text-sm font-semibold bg-white/20 px-4 py-2 rounded-full backdrop-blur-md'>
          View
          <span>→</span>
        </div>
      </div>
    </div>
  )
}

export default DailyTender
