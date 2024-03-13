export type CricHeaderRow = {
  key: string
  label: string
  type: string
  iconPath?: string
}

export type CricTableRow = {
  rowId: string | number
  dataList: CricTableCell[]
}

export type CricTableCell = {
  cellKey: string
  cellType: string
  value: string | string[] | number | null | undefined
}

export interface KeyValueType {
  [key: string]: string | string[] | number | null
}
