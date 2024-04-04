import { TableCellType } from '@/model/enum/table-cell-type.enum'
import { CricTableCell } from '@/model/types/cric-table.type'
import { currencyToString } from '@/util/bidding'
import { COLORS } from '@/util/colors'
import React from 'react'
import CricButton from '../ui/CricButton'
import OpenInBrowserOutlinedIcon from '@mui/icons-material/OpenInBrowserOutlined'

type TableDetailViewProps = {
  expandViewList: CricTableCell[]
  onRowSelect: () => void
}

function TableDetailView(props: TableDetailViewProps) {
  const { expandViewList, onRowSelect } = props

  const renderDetailView = (cell: CricTableCell) => {
    if (cell.cellType === TableCellType.list.toString()) return (cell.value as string[]).join(' / ')
    else if (cell.cellType === TableCellType.currency.toString())
      return currencyToString(Number(cell.value))
    else return cell.value
  }

  return (
    <div>
      {expandViewList.map(cell => (
        <div key={cell.cellKey} className='pt-2'>
          {cell.cellType !== TableCellType.icon.toString() ? (
            <>
              <div className='text-md font-semibold' style={{ color: COLORS.cricPrimary }}>
                {cell.headerName}
              </div>
              <div>{renderDetailView(cell)}</div>
            </>
          ) : (
            <div className='flex justify-center p-2 pb-4'>
              <CricButton
                btnTxt={cell.headerName as string}
                startIcon={<OpenInBrowserOutlinedIcon></OpenInBrowserOutlinedIcon>}
                onClick={onRowSelect}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default TableDetailView
