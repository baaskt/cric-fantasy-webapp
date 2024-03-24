import React, { useState, useEffect } from 'react'
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
import { sortSearchTable } from '@/util/table'
import { currencyToString } from '@/util/bidding'
import { Checkbox, IconButton, checkboxClasses } from '@mui/material'
import CricSwitch from './CricSwitch'
import CricSearch from './CricSearch'

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
  isSelectable?: boolean
  isResetCheck?: boolean
  checkedIds?: (string | number)[]
  onRowSelect?: (rowId: string | number) => void
  onRowChecked?: (rowId: (string | number)[]) => void
  onRowToggled?: (rowId: string | number, isToggled: boolean) => void
}

function CricTable(props: CricTableProps) {
  const {
    headerList,
    rowList,
    defOrder,
    defOrderBy,
    fullWidth,
    isSelectable,
    isResetCheck,
    onRowChecked,
    onRowToggled,
  } = props
  const [order, setOrder] = useState(defOrder || '')
  const [orderBy, setOrderBy] = useState(defOrderBy || '')
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([])
  const [tableData, setTableData] = useState<CricTableRow[]>([])
  const [searchStr, setSearchStr] = useState<string>('')

  useEffect(() => {
    if (isResetCheck) {
      setSelectedIds([])
    }
  }, [isResetCheck])

  useEffect(() => {
    if (!searchStr) {
      const sortedRows = sortSearchTable(rowList, searchStr, orderBy, order)
      setTableData(sortedRows)
    }
  }, [rowList])

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc'
    const tempSortOrder = isAsc ? 'desc' : 'asc'
    setOrder(tempSortOrder)
    setOrderBy(property)
    const sortedRows = sortSearchTable(rowList, searchStr, property, tempSortOrder)
    setTableData(sortedRows)
  }

  const renderTableRow = (row: CricTableRow, rowIndex: number, fullWidth: boolean) => {
    const checkRow = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        const tempSelectedIds = [...selectedIds, row.rowId]
        setSelectedIds(tempSelectedIds)
        onRowChecked && onRowChecked(tempSelectedIds)
      } else {
        const tempSelectedIds = [...selectedIds].filter(data => data !== row.rowId)
        setSelectedIds(tempSelectedIds)
        onRowChecked && onRowChecked(tempSelectedIds)
      }
    }

    return (
      <StyledTableRow key={rowIndex}>
        {props.isSelectable && (
          <StyledTableCell padding='checkbox'>
            <Checkbox
              color='primary'
              checked={selectedIds.includes(row.rowId)}
              onChange={event => checkRow(event)}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
              sx={{
                [`&, &.${checkboxClasses.checked}`]: {
                  color: COLORS.cricPrimary,
                },
              }}
            />
          </StyledTableCell>
        )}
        {row.dataList.map((cell, dataIndex) => renderTableCell(row, cell, dataIndex, fullWidth))}
      </StyledTableRow>
    )
  }

  const renderTableCell = (
    row: CricTableRow,
    cell: CricTableCell,
    cellIndex: number,
    fullWidth: boolean,
  ) => {
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
          cell.cellType === 'list' ||
          cell.cellType === 'switch'
            ? 'center'
            : 'left'
        }
      >
        {cell.cellType === 'icon'
          ? renderIconCell(row)
          : cell.cellType === 'list'
            ? renderListCell(cell.value as string[])
            : cell.cellType === 'currency'
              ? currencyToString(Number(cell.value))
              : cell.cellType === 'switch'
                ? renderToggleCell(row, cell)
                : cell.value}
      </StyledTableCell>
    )
  }

  const renderIconCell = (row: CricTableRow) => {
    return (
      <IconButton onClick={() => props.onRowSelect && props.onRowSelect(row.rowId)}>
        <span style={{ color: COLORS.cricPrimary }}>
          <OpenInBrowserOutlinedIcon></OpenInBrowserOutlinedIcon>
        </span>
      </IconButton>
    )
  }

  const renderToggleCell = (row: CricTableRow, cell: CricTableCell) => {
    const isChecked = Boolean(cell.value)
    const isDisabled = Boolean(cell.isDisabled)
    const toggleRow = (isToggled: boolean) => {
      onRowToggled && onRowToggled(row.rowId, isToggled)
    }
    return (
      <CricSwitch isChecked={isChecked} disabled={isDisabled} onChange={toggleRow}></CricSwitch>
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

  const selectAllRows = () => {
    if (selectedIds?.length === rowList.length) {
      setSelectedIds([])
      onRowChecked && onRowChecked([])
    } else {
      const tempSelectedIds = rowList.map(data => data.rowId)
      setSelectedIds(tempSelectedIds)
      onRowChecked && onRowChecked(tempSelectedIds)
    }
  }

  const onTableSearch = (tempSearchStr: string) => {
    setSearchStr(tempSearchStr)
    const searchList = sortSearchTable(rowList, tempSearchStr, orderBy, order)
    setTableData(searchList)
  }

  return (
    <div>
      <CricSearch onSearch={onTableSearch} />
      <Paper sx={{ overflow: 'scroll' }}>
        <TableContainer>
          <Table stickyHeader aria-label='customized table'>
            <CricTableHead
              headerList={headerList}
              order={order as SortDirection}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              onSelectAllClick={selectAllRows}
              isMultiSelect={isSelectable}
            />
            <TableBody>
              {tableData.map((row, rowIndex) => renderTableRow(row, rowIndex, fullWidth))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  )
}

export default CricTable
