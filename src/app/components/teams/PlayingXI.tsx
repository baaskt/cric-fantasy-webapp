import { CricHeaderRow, CricTableRow } from '@/model/types/cric-table.type'
import React, { useEffect, useState } from 'react'
import CricTable from '../ui/CricTable'

const headersList: CricHeaderRow[] = [
  { key: 'sno', label: 'S.No', type: 'number' },
  { key: 'name', label: 'Players', type: 'string' },
  { key: 'country', label: 'Country', type: 'string' },
  { key: 'club', label: 'Club', type: 'string' },
  { key: 'points', label: 'Points', type: 'number' },
  { key: '', label: '', type: 'icon' },
]

function PlayingXI() {
  const [tableData, setTableData] = useState<CricTableRow[]>([])

  useEffect(() => {
    setTableData([])
  }, [])

  return (
    <div className='p-5'>
      <CricTable headerList={headersList} rowList={tableData} fullWidth={false} />
    </div>
  )
}

export default PlayingXI
