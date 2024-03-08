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
import { CricHeaderRow, CricTableRow } from '@/model/types/cric-table.type'

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
          <TableBody>
            {rowList.map((row, rowIndex) => (
              <StyledTableRow key={rowIndex}>
                {row.dataList.map((data, dataIndex) => (
                  <StyledTableCell
                    key={dataIndex}
                    component='th'
                    scope='row'
                    align={data.cellType === 'number' ? 'center' : 'left'}
                  >
                    {data.value}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default CricTable
