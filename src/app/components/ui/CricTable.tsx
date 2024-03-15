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
import { currencyToString } from '@/util/bidding'

interface CustomTableCellProps {
  fullwidth?: string
}

export const StyledTableCell = styled(TableCell)(({ fullwidth }: CustomTableCellProps) => ({
  [`&.${tableCellClasses.root}`]: {
    fontSize: 16,
    borderLeft: '1px solid rgba(224, 224, 224, 1)',
    minWidth: fullwidth ? 180 : 0,
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
  fullWidth: boolean
}

const renderIconCell = () => {
  return (
    <span style={{ color: COLORS.cricPrimary }}>
      <OpenInBrowserOutlinedIcon></OpenInBrowserOutlinedIcon>
    </span>
  )
}

const renderTableRow = (row: CricTableRow, rowIndex: number, fullWidth: boolean) => {
  return (
    <StyledTableRow key={rowIndex}>
      {row.dataList.map((cell, dataIndex) => renderTableCell(cell, dataIndex, fullWidth))}
    </StyledTableRow>
  )
}

const renderListCell = (listData: string[]) => {
  return (
    <div>
      {listData.map((data: string, dataIndex: number) => (
        <div key={dataIndex}>{data}</div>
      ))}
    </div>
  )
}

const renderTableCell = (cell: CricTableCell, cellIndex: number, fullWidth: boolean) => {
  return (
    <StyledTableCell
      key={cellIndex}
      fullwidth={fullWidth ? fullWidth.toString() : ''}
      component='th'
      scope='row'
      style={{ color: cell.color }}
      align={
        cell.cellType === 'number' ||
        cell.cellType === 'currency' ||
        cell.cellType === 'icon' ||
        cell.cellType === 'list'
          ? 'center'
          : 'left'
      }
    >
      {cell.cellType === 'icon'
        ? renderIconCell()
        : cell.cellType === 'list'
          ? renderListCell(cell.value as string[])
          : cell.cellType === 'currency'
            ? currencyToString(Number(cell.value))
            : cell.value}
    </StyledTableCell>
  )
}

function CricTable(props: CricTableProps) {
  const { headerList, rowList, defOrder, defOrderBy, fullWidth } = props
  const [order, setOrder] = React.useState(defOrder || 'asc')
  const [orderBy, setOrderBy] = React.useState(defOrderBy || '')

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const tableRows = React.useMemo(
    () => sortTable(rowList, orderBy, order),
    [order, orderBy, rowList],
  )

  return (
    <Paper sx={{ overflow: 'scroll' }}>
      {/* <TableContainer sx={{ maxHeight: 440 }}> */}
      <TableContainer>
        <Table stickyHeader aria-label='customized table'>
          <CricTableHead
            headerList={headerList}
            order={order as SortDirection}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            onSelectAllClick={() => {}}
          />
          <TableBody>
            {tableRows.map((row, rowIndex) => renderTableRow(row, rowIndex, fullWidth))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default CricTable
