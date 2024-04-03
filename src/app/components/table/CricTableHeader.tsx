import {
  Box,
  Checkbox,
  SortDirection,
  TableHead,
  TableRow,
  TableSortLabel,
  checkboxClasses,
} from '@mui/material'
import { StyledTableCell } from '../ui/CricTable'
import { CricHeaderRow } from '@/model/types/cric-table.type'
import { visuallyHidden } from '@mui/utils'
import { styled } from '@mui/material/styles'
import { COLORS } from '@/util/colors'
import { SortOrderType } from '@/util/table'
import { TableCellType } from '@/model/enum/table-cell-type.enum'
import useMobile from '@/hooks/useMobile'

const StyledTableSortLabel = styled(TableSortLabel)(() => ({
  color: COLORS.white, // Default color,
  '&.Mui-active': {
    color: COLORS.white,
    '& .MuiTableSortLabel-icon': {
      color: COLORS.white,
    },
  },
  '&:hover': {
    color: COLORS.white, // Color change on hover
  },
}))

type CricTableHeadProps = {
  headerList: CricHeaderRow[]
  order: SortDirection
  orderBy: string
  onRequestSort: (property: string) => void
  onSelectAllClick: () => void
  isMultiSelect?: boolean
}

export default function CricTableHead(props: CricTableHeadProps) {
  const { headerList, order, orderBy, isMultiSelect, onRequestSort, onSelectAllClick } = props
  const isMobileView = useMobile()

  const createSortHandler = (property: string) => {
    onRequestSort(property)
  }

  const renderSortCell = (header: CricHeaderRow) => {
    return (
      <StyledTableSortLabel
        active={orderBy === header.key}
        direction={(orderBy === header.key ? order : 'asc') as SortOrderType}
        onClick={() => createSortHandler(header.key)}
      >
        {header.isMobile && isMobileView && header.alias ? header.alias : header.label}
        {orderBy === header.key ? (
          <Box component='span' sx={visuallyHidden}>
            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
          </Box>
        ) : null}
      </StyledTableSortLabel>
    )
  }

  return (
    <TableHead>
      <TableRow>
        {isMultiSelect && (
          <StyledTableCell padding='checkbox'>
            <Checkbox
              color='primary'
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
              sx={{
                [`&, &.${checkboxClasses.checked}`]: {
                  color: COLORS.white,
                },
              }}
            />
          </StyledTableCell>
        )}

        {headerList.map(
          header =>
            (isMobileView ? header.isMobile : header.type !== 'expand' ? true : false) && (
              <StyledTableCell
                key={header.key}
                align='center'
                sortDirection={orderBy === header.key ? order : false}
              >
                {header.type !== TableCellType.expand.toString() &&
                header.type !== TableCellType.icon.toString() &&
                header.type !== TableCellType.list.toString()
                  ? renderSortCell(header)
                  : header.label}
              </StyledTableCell>
            ),
        )}
      </TableRow>
    </TableHead>
  )
}
