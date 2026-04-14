'use client'

import { PlayerAuctionHistoryEntity } from '@/model/response/player-detail.response.interface'
import { getNumberOfBids } from '@/util/bidding'
import { useEffect, useRef } from 'react'

function fmt(n: number, currency = '₹'): string {
  if (n >= 1e7) return `${currency}${(n / 1e7).toFixed(1)}Cr`
  if (n >= 1e5) return `${currency}${(n / 1e5).toFixed(1)}L`
  return `${currency}${n.toLocaleString('en-IN')}`
}

function AnimatedBar({ pct }: { pct: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const t = setTimeout(() => {
      if (ref.current) ref.current.style.width = `${pct}%`
    }, 120)
    return () => clearTimeout(t)
  }, [pct])
  return (
    <div className='mt-2.5 h-1 w-full rounded-full bg-indigo-50 overflow-hidden'>
      <div
        ref={ref}
        style={{ width: '0%', transition: 'width 0.8s cubic-bezier(.25,.8,.25,1)' }}
        className='h-1 rounded-full bg-indigo-500'
      />
    </div>
  )
}

interface BidHistoryProps {
  auction: PlayerAuctionHistoryEntity
  currency?: string
}

function PlayerBidHistory(props: BidHistoryProps) {
  const { auction, currency = '₹' } = props
  const biddingHistory = auction.biddingHistory
  const sorted = [...biddingHistory].sort((a, b) => b.amount - a.amount)
  const minAmt = sorted[sorted.length - 1]?.amount ?? 0
  const escalationPct =
    minAmt > 0
      ? Math.round(((auction.auctionPrice - auction.basePrice) / auction.basePrice) * 100)
      : 0

  return (
    <div className='bg-[#f5f4ff] font-sans h-fit'>
      {/* Hero band */}
      <div className='bg-indigo-600 px-5 pt-4 pb-10 relative overflow-hidden'>
        <div
          className='absolute bottom-0 left-0 right-0 h-8 bg-[#f5f4ff]'
          style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }}
        />
        <div className='grid grid-cols-3 gap-2 -mt-1 mb-4'>
          {[
            { val: biddingHistory.length.toString(), lbl: 'Teams' },
            { val: fmt(auction.auctionPrice, currency), lbl: 'Final bid' },
            { val: `${escalationPct}%`, lbl: 'Escalation' },
          ].map(s => (
            <div
              key={s.lbl}
              className='bg-white rounded-2xl px-2.5 py-3 text-center border border-indigo-100'
            >
              <p className='text-[17px] font-medium text-indigo-700 leading-none'>{s.val}</p>
              <p className='text-[10px] text-[#8b8bb8] mt-1 uppercase tracking-wider'>{s.lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className='px-3.5 pb-4'>
        {/* Section label */}
        <div className='flex items-center justify-between mb-2.5'>
          <span className='text-[14px] font-medium text-[#1a1a2e]'>Maximum bids / Team</span>
          <span className='bg-indigo-50 text-indigo-700 text-[11px] font-medium px-2.5 py-0.5 rounded-full'>
            {getNumberOfBids(auction.basePrice, auction.auctionPrice)} bids
          </span>
        </div>

        {/* Bid cards */}
        {sorted.map((bid, i) => {
          const isWinner = i === 0
          const pct =
            auction.auctionPrice > 0 ? Math.round((bid.amount / auction.auctionPrice) * 100) : 0

          return (
            <div
              key={bid.teamId}
              className={`bg-white rounded-2xl p-3.5 mb-2.5 relative overflow-hidden ${
                isWinner ? 'border-[1.5px] border-indigo-200' : 'border border-[#ece9ff]'
              }`}
            >
              {isWinner && <div className='absolute top-0 left-0 w-[3px] h-full bg-indigo-600' />}
              <div className='flex items-center gap-2.5'>
                {/* Rank badge */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium flex-shrink-0 ${
                    isWinner
                      ? 'bg-indigo-600 text-white'
                      : pct > 90
                        ? 'bg-pink-600 text-white'
                        : 'bg-[#f0f0f8] text-[#8b8bb8]'
                  }`}
                >
                  {i + 1}
                </div>

                {/* Info */}
                <div className='flex-1 min-w-0'>
                  <p className='text-[14px] font-medium text-[#1a1a2e] truncate'>{bid.teamName}</p>
                  <div className='flex items-center gap-1.5 mt-0.5'>
                    {isWinner ? (
                      <span className='bg-indigo-600 text-white text-[9px] font-medium px-1.5 py-[2px] rounded-full'>
                        winner
                      </span>
                    ) : pct > 90 ? (
                      <span className='bg-pink-600 text-white text-[9px] font-medium px-1.5 py-[2px] rounded-full'>
                        almost there
                      </span>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div className='text-right flex-shrink-0'>
                  <p
                    className={`text-[15px] font-medium ${
                      isWinner ? 'text-indigo-700' : 'text-[#1a1a2e]'
                    }`}
                  >
                    {fmt(bid.amount, currency)}
                  </p>
                  <p className='text-[10px] text-indigo-300 mt-0.5'>{pct}% of max</p>
                </div>
              </div>

              <AnimatedBar pct={pct} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PlayerBidHistory
