import React, { FocusEvent } from 'react'
import CricTextField from './CricTextField'
import { IconButton, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

type CricSearchProps = {
  onSearch: (searchStr: string) => void
}

function CricSearch(props: CricSearchProps) {
  const { onSearch } = props
  const handleSearch = (event: FocusEvent<HTMLInputElement>) => {
    onSearch(event.target.value)
  }
  return (
    <div className='p-5 flex justify-end'>
      <CricTextField
        type='text'
        id='search-table'
        placeholder='Search...'
        onChange={handleSearch}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                aria-label='search field'
                // onClick={onTableSearch}
                edge='end'
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  )
}

export default CricSearch
