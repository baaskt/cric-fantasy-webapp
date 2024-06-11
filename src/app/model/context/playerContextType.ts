export type PlayerContextType = {
  activePlayerId: number | undefined
  markActivePlayer: (teamId: number) => void
}
