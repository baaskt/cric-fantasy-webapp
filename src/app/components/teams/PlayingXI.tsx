import { CricHeaderRow, CricTableRow } from '@/model/types/cric-table.type'
import React, { useEffect, useState } from 'react'
import CricTable from '../ui/CricTable'
import { SquadEntity } from '@/model/entities/squad.interface'

const headersList: CricHeaderRow[] = [
  { key: 'sno', label: 'S.No', type: 'number' },
  { key: 'name', label: 'Players', type: 'string' },
  { key: 'country', label: 'Country', type: 'string' },
  { key: 'club', label: 'Club', type: 'string' },
  { key: 'points', label: 'Points', type: 'number' },
  { key: '', label: '', type: 'icon' },
]

type PlayingXIProps = {
  squad: SquadEntity[]
}

function PlayingXI(props: PlayingXIProps) {
  const { squad } = props
  const [tableData, setTableData] = useState<CricTableRow[]>([])

  useEffect(() => {
    setTableData([])
  }, [squad])

  return (
    <div className='p-5'>
      <CricTable headerList={headersList} rowList={tableData} fullWidth={false} />
    </div>
  )
}

export default PlayingXI
