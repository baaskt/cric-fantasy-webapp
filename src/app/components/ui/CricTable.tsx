import * as React from 'react'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { SortDirection, tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { COLORS } from '@/util/colors'
import { CricHeaderRow, CricTableCell, CricTableRow } from '@/model/types/cric-table.type'
import OpenInBrowserOutlinedIcon from '@mui/icons-material/OpenInBrowserOutlined'
import CricTableHead from '../table/CricTableHeader'
import { sortTable } from '@/util/table'

export const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.root}`]: {
    fontSize: 16,
    borderLeft: '1px solid rgba(224, 224, 224, 1)',
    minWidth: 180,
  },
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: COLORS.cricPrimary,
    color: COLORS.white,
    fontWeight: 600,
    zIndex: 999,
  },
  [`&.${tableCellClasses.body}`]: {
    fontFamily: 'Manrope',
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}))

type CricTableProps = {
  headerList: CricHeaderRow[]
  rowList: CricTableRow[]
  defOrder?: string
  defOrderBy?: string
}

function CricTable(props: CricTableProps) {
  const { headerList, rowList, defOrder, defOrderBy } = props
  const [order, setOrder] = React.useState(defOrder || 'asc')
  const [orderBy, setOrderBy] = React.useState(defOrderBy || '')

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const renderIconCell = () => {
    return (
      <span style={{ color: COLORS.cricPrimary }}>
        <OpenInBrowserOutlinedIcon></OpenInBrowserOutlinedIcon>
      </span>
    )
  }

  const renderTableRow = (row: CricTableRow, rowIndex: number) => {
    return (
      <StyledTableRow key={rowIndex}>
        {row.dataList.map((cell, dataIndex) => renderTableCell(cell, dataIndex))}
      </StyledTableRow>
    )
  }

  const renderListCell = (listData: string[]) => {
    return (
      <div>
        {listData.map((data: string) => (
          <div key={data}>{data}</div>
        ))}
      </div>
    )
  }

  const renderTableCell = (cell: CricTableCell, cellIndex: number) => {
    return (
      <StyledTableCell
        key={cellIndex}
        component='th'
        scope='row'
        align={
          cell.cellType === 'number' || cell.cellType === 'icon' || cell.cellType === 'list'
            ? 'center'
            : 'left'
        }
      >
        {cell.cellType === 'icon'
          ? renderIconCell()
          : cell.cellType === 'list'
            ? renderListCell(cell.value as string[])
            : cell.value}
      </StyledTableCell>
    )
  }

  const tableRows = React.useMemo(
    () => sortTable(rowList, orderBy, order),
    [order, orderBy, rowList],
  )

  return (
    <Paper sx={{ overflow: 'scroll' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='customized table'>
          <CricTableHead
            headerList={headerList}
            order={order as SortDirection}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            onSelectAllClick={() => {}}
          />
          <TableBody>{tableRows.map((row, rowIndex) => renderTableRow(row, rowIndex))}</TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default CricTable
