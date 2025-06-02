'use client'

import { PlayerInsightsEntity } from '@/model/entities/player-insights.interface'
import { MatchWiseDetailEntity } from '@/model/response/player-detail.response.interface'
import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

const COLORS = ['#00C49F', '#8884d8', '#FFBB28', '#FF8042']

type PlayerInsightsChartProps = {
  matchWiseDetails: MatchWiseDetailEntity[]
  insights: PlayerInsightsEntity
}

const PlayerInsightsChart = (props: PlayerInsightsChartProps) => {
  const { matchWiseDetails, insights } = props
  const categoryCounts = [
    { name: '>100 Points', value: insights.matchesAbove100 },
    { name: '51-100 Points', value: insights.matchesAbove50 - insights.matchesAbove100 },
    {
      name: '0-50 Points',
      value: matchWiseDetails.length - insights.matchesAbove50 - insights.negativeMatches,
    },
    { name: 'Negative Matches', value: insights.negativeMatches },
  ]

  return (
    <div className='p-4 flex flex-col'>
      {/* Line Chart */}
      <div className='w-full h-64'>
        <h2 className='text-lg font-semibold mb-2'>Points Trend</h2>
        <ResponsiveContainer>
          <LineChart data={matchWiseDetails}>
            <XAxis dataKey='matchDesc' hide />
            <YAxis />
            <Tooltip formatter={(value: number | string) => [`${value}`, 'Fantasy Points']} />
            <Line type='monotone' dataKey='totalMatchPoints' stroke='#8884d8' strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className='w-full h-96 self-center mt-16'>
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
      </div>
    </div>
  )
}

export default PlayerInsightsChart
