export type CricResponse<T> = {
  result?: T
  Result?: T
  error?: string
  meta?: CursorMetaResponse
}

export type CursorMetaResponse = {
  cursor: number
  hasMore: boolean
  nextCursor: number
  pageSize: number
  total: number
}
