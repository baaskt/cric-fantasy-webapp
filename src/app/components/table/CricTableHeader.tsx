import { Box, Checkbox, SortDirection, TableHead, TableRow, TableSortLabel } from '@mui/material'
import { StyledTableCell } from '../ui/CricTable'
import { CricHeaderRow } from '@/model/types/cric-table.type'
import { visuallyHidden } from '@mui/utils'
import { styled } from '@mui/material/styles'
import { COLORS } from '@/util/colors'
import { SortOrderType } from '@/util/table'

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

  const createSortHandler = (property: string) => {
    onRequestSort(property)
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
            />
          </StyledTableCell>
        )}

        {headerList.map(header => (
          <StyledTableCell
            key={header.key}
            align='center'
            sortDirection={orderBy === header.key ? order : false}
          >
            <StyledTableSortLabel
              active={orderBy === header.key}
              direction={(orderBy === header.key ? order : 'asc') as SortOrderType}
              onClick={() => createSortHandler(header.key)}
            >
              {header.label}
              {orderBy === header.key ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </StyledTableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}
