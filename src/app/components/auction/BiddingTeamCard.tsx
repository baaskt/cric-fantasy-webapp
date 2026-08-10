import { TeamEntity } from '@/model/response/team.interface'
import { currencyToString } from '@/util/bidding'
import { convertDriveUrl } from '@/util/helper'
import React from 'react'

type BiddingTeamCardProps = {
  teamData: TeamEntity
  isHighestBidder: boolean
  isSecondHighestBidder: boolean
  teamCount: number
  onBidding: (teamData: TeamEntity) => void
}

function BiddingTeamCard(props: BiddingTeamCardProps) {
  const { teamName, purseBalance, imgUrl, squadCount, teamCount } = props.teamData
  const ALTERNATE_IMAGE_SRC = '/assets/images/default_img.jpg'
  const teamUrl = convertDriveUrl(imgUrl)

  const sizeClass =
    teamCount <= 4
      ? {
          card: 'w-[280px]',
          image: 'h-[200px] w-[200px]',
          teamName: 'text-2xl',
          statLabel: 'text-sm',
          statValue: 'text-lg',
          padding: 'p-5',
        }
      : teamCount <= 6
        ? {
            card: 'w-[240px]',
            image: 'h-[170px] w-[170px]',
            teamName: 'text-xl',
            statLabel: 'text-xs',
            statValue: 'text-base',
            padding: 'p-4',
          }
        : {
            card: 'w-[210px]',
            image: 'h-[145px] w-[145px]',
            teamName: 'text-lg',
            statLabel: 'text-[11px]',
            statValue: 'text-sm',
            padding: 'p-3',
          }

  return (
    <div
      className={`
    ${sizeClass.card}
    group relative overflow-hidden cursor-pointer
    rounded-2xl border border-slate-200/80
    bg-white shadow-sm
    transition-all duration-200
    hover:-translate-y-1 hover:shadow-xl

    ${props.isHighestBidder ? 'ring-2 ring-indigo-500 shadow-indigo-100' : ''}

    ${props.isSecondHighestBidder ? 'ring-2 ring-indigo-200' : ''}
  `}
      onClick={() => props.onBidding(props.teamData)}
    >
      {/* Highest bidder */}
      {props.isHighestBidder && (
        <div className='absolute left-3 top-3 z-10 rounded-full bg-indigo-600 px-3 py-1 text-sm font-semibold text-white shadow-md'>
          Highest Bidder
        </div>
      )}

      {props.isSecondHighestBidder && !props.isHighestBidder && (
        <div className='absolute left-3 top-3 z-10 rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700 shadow-sm'>
          Active Bidder
        </div>
      )}

      {/* Team image */}
      <div className='flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-2'>
        <img
          src={teamUrl || ALTERNATE_IMAGE_SRC}
          alt={teamName}
          width='200'
          height='200'
          className={`
        ${sizeClass.image}
        object-contain drop-shadow-md
        transition-transform duration-300
        group-hover:scale-105 rounded-lg
      `}
        />
      </div>

      {/* Team information */}
      <div className={`${sizeClass.padding} space-y-2`}>
        <div className='text-center'>
          <div
            className={`
          ${sizeClass.teamName}
          font-bold tracking-tight text-slate-900
        `}
          >
            {teamName}
          </div>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-2 gap-2'>
          <div className='rounded-xl bg-slate-50 p-3'>
            <div
              className={`${sizeClass.statLabel} font-medium uppercase tracking-wide text-slate-400`}
            >
              Balance
            </div>

            <div className={`${sizeClass.statValue} mt-1 font-bold text-slate-900`}>
              {currencyToString(purseBalance)}
            </div>
          </div>

          <div className='rounded-xl bg-slate-50 p-3 text-sm'>
            <div className={`${sizeClass.statLabel} uppercase tracking-wide text-slate-400`}>
              Squad
            </div>

            <div className={`${sizeClass.statValue} mt-1 font-bold text-slate-900`}>
              {squadCount}
              <span className='text-slate-400'> / 15</span>
            </div>
          </div>
        </div>

        {/* Squad progress */}
        <div>
          <div className='mb-1.5 flex justify-between text-sm font-medium'>
            <span className='text-slate-400'>Squad capacity</span>

            <span className='text-slate-500'>{Math.round((squadCount / 15) * 100)}%</span>
          </div>

          <div className='h-2 overflow-hidden rounded-full bg-slate-100'>
            <div
              className='h-full rounded-full bg-indigo-500 transition-all duration-500'
              style={{
                width: `${Math.min((squadCount / 15) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Hover */}
      <div className='absolute bottom-0 left-0 right-0 translate-y-full bg-indigo-600 py-2.5 text-center text-sm font-bold text-white transition-transform duration-200 group-hover:translate-y-0'>
        Click to bid →
      </div>
    </div>
  )
}

export default BiddingTeamCard
