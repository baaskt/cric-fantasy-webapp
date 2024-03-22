export type CricHeaderRow = {
  key: string
  label: string
  type: string
  iconPath?: string
  isDisabled?: boolean
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
}

export interface KeyValueType {
  [key: string]: string | string[] | number | null
}
