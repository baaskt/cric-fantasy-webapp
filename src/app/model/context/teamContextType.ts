export type TeamContextType = {
  activeTeamId: string | undefined
  markActiveTeam: (teamId: string) => void
}
