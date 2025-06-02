'use client'

import { PlayerInsightsEntity } from '@/model/entities/player-insights.interface'
import { MatchWiseDetailEntity } from '@/model/response/player-detail.response.interface'
import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

type PlayerInsightsChartProps = {
  matchWiseDetails: MatchWiseDetailEntity[]
  insights: PlayerInsightsEntity
}

const PlayerInsightsChart = (props: PlayerInsightsChartProps) => {
  const { matchWiseDetails, insights } = props

  console.log(insights)

  return (
    <div className='flex flex-col'>
      {/* Line Chart */}
      <div className='w-full h-72 bg-[#0b1e3f] text-white overflow-hidden'>
        <h2 className='mt-2 text-center'>Points Trend</h2>
        <div className='flex-1 h-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart
              data={matchWiseDetails}
              margin={{ top: 10, right: 10, left: 0, bottom: 60 }} // increased bottom margin
            >
              <XAxis dataKey='matchDesc' hide />
              <YAxis stroke='#eff6ff' />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a2b4c', border: 'none' }}
                labelStyle={{ color: '#ccc' }}
                itemStyle={{ color: '#00e5ff' }}
                formatter={(value: number | string) => [`${value}`, 'Fantasy Points']}
              />
              <Line
                type='monotone'
                dataKey='totalMatchPoints'
                stroke='#00e5ff'
                strokeWidth={2}
                dot={{ stroke: '#00e5ff', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#00e5ff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      {/* <div className='w-full h-96 self-center mt-16'>
        <h2 className='text-lg font-semibold text-center'>Match Performance Distribution</h2>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={categoryCounts}
              dataKey='value'
              nameKey='name'
              cx='50%'
              cy='50%'
              outerRadius={100}
              label
            >
              {categoryCounts.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div> */}
    </div>
  )
}

export default PlayerInsightsChart
