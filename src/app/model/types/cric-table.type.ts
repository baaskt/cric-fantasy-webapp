export type CricHeaderRow = {
  key: string
  label: string
  type: string
}

export type CricTableRow = {
  dataList: CricTableData[]
}

export type CricTableData = {
  cellType: string
  value: string | number | null
}

export interface KeyValueType {
  [key: string]: string | number | null
}
