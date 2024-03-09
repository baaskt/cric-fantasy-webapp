import * as React from 'react'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { COLORS } from '@/util/colors'
import { CricHeaderRow, CricTableCell, CricTableRow } from '@/model/types/cric-table.type'
import OpenInBrowserOutlinedIcon from '@mui/icons-material/OpenInBrowserOutlined'

const StyledTableCell = styled(TableCell)(() => ({
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
}

function CricTable(props: CricTableProps) {
  const { headerList, rowList } = props

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

  const renderTableCell = (cell: CricTableCell, cellIndex: number) => {
    return (
      <StyledTableCell
        key={cellIndex}
        component='th'
        scope='row'
        align={cell.cellType === 'number' || cell.cellType === 'icon' ? 'center' : 'left'}
      >
        {cell.cellType === 'icon' ? renderIconCell() : cell.value}
      </StyledTableCell>
    )
  }

  return (
    <Paper sx={{ overflow: 'scroll' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='customized table'>
          <TableHead>
            <TableRow>
              {headerList.map(header => (
                <StyledTableCell key={header.key} align='center'>
                  {header.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{rowList.map((row, rowIndex) => renderTableRow(row, rowIndex))}</TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default CricTable
