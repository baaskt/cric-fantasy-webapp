import { CricTableRow } from '@/model/types/cric-table.type'

export type SortOrderType = 'asc' | 'desc'

function comparator(orderBy: string, order: string) {
  return function (a: CricTableRow, b: CricTableRow) {
    const valueA = a.dataList.find(item => item.cellKey === orderBy)?.value || 0
    const valueB = b.dataList.find(item => item.cellKey === orderBy)?.value || 0

    if (order === 'asc') {
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB)
      } else {
        return Number(valueA) - Number(valueB)
      }
    } else {
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueB.localeCompare(valueA)
      } else {
        return Number(valueB) - Number(valueA)
      }
    }
  }
}

export function sortTable(
  tableRows: CricTableRow[],
  orderBy: string,
  order: string,
): CricTableRow[] {
  const sortedData = tableRows.slice().sort(comparator(orderBy, order))
  return sortedData
}
