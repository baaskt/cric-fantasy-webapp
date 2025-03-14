import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { SortDirection, tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { COLORS } from '@/util/colors'
import {
  CricCellObj,
  CricHeaderRow,
  CricTableCell,
  CricTableRow,
} from '@/model/types/cric-table.type'
import OpenInBrowserOutlinedIcon from '@mui/icons-material/OpenInBrowserOutlined'
import CricTableHead from '../table/CricTableHeader'
import { sortSearchTable } from '@/util/tables/table'
import { currencyToString } from '@/util/bidding'
import { Checkbox, Collapse, IconButton, checkboxClasses } from '@mui/material'
import CricSwitch from './CricSwitch'
import CricSearch from './CricSearch'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import useMobile from '@/hooks/useMobile'
import TableDetailView from '../table/TableDetailView'
import { TableCellType } from '@/model/enum/table-cell-type.enum'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

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
  hideSearch?: boolean
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
    hideSearch,
  } = props
  const [order, setOrder] = useState(defOrder || '')
  const [orderBy, setOrderBy] = useState(defOrderBy || '')
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([])
  const [tableData, setTableData] = useState<CricTableRow[]>([])
  const [searchStr, setSearchStr] = useState<string>('')
  const [expandIndex, setExpandIndex] = useState(-1)
  const isMobileView = useMobile()

  useEffect(() => {
    if (isResetCheck) {
      setSelectedIds([])
    }
  }, [isResetCheck])

  useEffect(() => {
    const sortedRows = sortSearchTable(rowList, searchStr, orderBy, order)
    setTableData(sortedRows)
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

    const defaultViewList = row.dataList.filter(
      cell => (isMobileView && cell.isMobileView) || (!isMobileView && cell.cellType !== 'expand'),
    )
    const expandViewList = row.dataList.filter(cell => isMobileView && !cell.isMobileView)

    return (
      <React.Fragment key={rowIndex}>
        <StyledTableRow>
          {props.isSelectable && (
            <StyledTableCell padding='checkbox'>
              <Checkbox
                color='primary'
                checked={selectedIds.includes(row.rowId)}
                onChange={event => checkRow(event)}
                inputProps={{
                  'aria-label': 'select all rows',
                }}
                sx={{
                  [`&, &.${checkboxClasses.checked}`]: {
                    color: COLORS.cricPrimary,
                  },
                }}
              />
            </StyledTableCell>
          )}
          {defaultViewList.map((cell, cellIndex) =>
            renderTableCell(row, rowIndex, cell, cellIndex, fullWidth),
          )}
        </StyledTableRow>
        {expandViewList?.length && expandIndex === rowIndex ? (
          <StyledTableRow>
            <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse in={expandIndex === rowIndex}>
                <TableDetailView
                  expandViewList={expandViewList}
                  onRowSelect={() => props.onRowSelect && props.onRowSelect(row.rowId)}
                />
              </Collapse>
            </StyledTableCell>
          </StyledTableRow>
        ) : (
          <></>
        )}
      </React.Fragment>
    )
  }

  const renderTableCell = (
    row: CricTableRow,
    rowIndex: number,
    cell: CricTableCell,
    cellIndex: number,
    fullWidth: boolean,
  ) => {
    const renderTableCells = () => {
      if (cell.cellType === TableCellType.icon.toString()) return renderIconCell(row)
      else if (cell.cellType === TableCellType.list.toString())
        return renderListCell(cell.value as string[])
      else if (cell.cellType === TableCellType.currency.toString())
        return currencyToString(Number(cell.value))
      else if (cell.cellType === TableCellType.switch.toString()) return renderToggleCell(row, cell)
      else if (cell.cellType === TableCellType.expand.toString()) return renderExpandCell(rowIndex)
      else if (cell.cellType === TableCellType.stock.toString()) return renderStockCell(cell)
      else return <>{cell.value}</>
    }

    return (
      <StyledTableCell
        key={cellIndex}
        fullwidth={fullWidth ? fullWidth.toString() : ''}
        component='th'
        scope='row'
        style={{ color: cell.color }}
        align={
          cell.cellType === TableCellType.number.toString() ||
          cell.cellType === TableCellType.currency.toString() ||
          cell.cellType === TableCellType.icon.toString() ||
          cell.cellType === TableCellType.stock.toString() ||
          cell.cellType === TableCellType.list.toString() ||
          cell.cellType === TableCellType.switch.toString() ||
          cell.cellType === TableCellType.expand.toString()
            ? 'center'
            : 'left'
        }
      >
        {renderTableCells()}
      </StyledTableCell>
    )
  }

  const renderExpandCell = (rowIndex: number) => {
    return (
      <IconButton
        aria-label='expand row'
        size='small'
        onClick={() => setExpandIndex(p => (p !== rowIndex ? rowIndex : -1))}
      >
        {expandIndex === rowIndex ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
    )
  }

  const renderStockCell = (cell: CricTableCell) => {
    const stockData = cell.value as CricCellObj
    return (
      <div>
        <div>{stockData.original}</div>
        {stockData.delta !== 0 && (
          <div
            className='flex justify-center opacity-970'
            style={{ color: stockData.delta > 0 ? COLORS.stockGreen : COLORS.lightRed }}
          >
            <div>{stockData.delta}</div>
            {stockData.delta > 0 ? (
              stockData.iconType === 'trend' ? (
                <TrendingUpIcon />
              ) : (
                <ArrowDropUpIcon />
              )
            ) : stockData.delta < 0 ? (
              stockData.iconType === 'trend' ? (
                <TrendingDownIcon />
              ) : (
                <ArrowDropDownIcon />
              )
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
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
      const tempSelectedIds = tableData.map(data => data.rowId)
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
      {!hideSearch && <CricSearch onSearch={onTableSearch} />}
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
          {!tableData.length && <div className='p-5 text-center'>No data found</div>}
        </TableContainer>
      </Paper>
    </div>
  )
}

export default CricTable
