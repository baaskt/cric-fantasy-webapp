import { MatchEntity } from '@/model/response/match.response'

export function mapMatchesWithPlayingXI(
  matches: MatchEntity[],
  playingXIHistory: Record<string, number[]>,
): { match: MatchEntity; playingXI: number[] | null }[] {
  return matches.map(match => {
    // Convert startTime → YYYYMMDD
    const dateKey = match.startTime
      .split(' ')[0] // "2026-04-02"
      .replace(/-/g, '') // "20260402"

    return {
      match,
      playingXI: playingXIHistory[dateKey] || null,
    }
  })
}

export function groupMatchesByPlayingXI(
  matches: MatchEntity[],
  playingXIHistory: Record<string, number[]>,
) {
  const entries = Object.entries(playingXIHistory).sort((a, b) => Number(b[0]) - Number(a[0]))

  return entries.map(([dateKey, playingXI]) => {
    const matchedMatches = matches.filter(match => {
      const matchDate = match.startTime.split(' ')[0].replace(/-/g, '')

      return matchDate === dateKey
    })

    return {
      date: dateKey,
      playingXI,
      matches: matchedMatches,
    }
  })
}
