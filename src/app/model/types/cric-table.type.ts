export type CricHeaderRow = {
  key: string
  label: string
  alias?: string
  type: string
  iconPath?: string
  isDisabled?: boolean
  isMobile?: boolean
}

export type CricTableRow = {
  rowId: string | number
  dataList: CricTableCell[]
}

export type CricTableCell = {
  cellKey: string
  cellType: string
  value: string | string[] | number | null | undefined
  color?: string
  isDisabled?: boolean
  isMobileView?: boolean
  headerName?: string
}

export interface KeyValueType {
  [key: string]: string | string[] | number | null
}
