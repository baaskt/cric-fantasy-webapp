'use client'

import { useCallback } from 'react'
import { Timepicker } from 'timepicker-ui-react'
import type { ConfirmEventData } from 'timepicker-ui'
import { toUTC } from '@/util/helper'
// import 'timepicker-ui/dist/css/index.css'

interface TimePickerUTCProps {
  value: string
  onChange: (localTime: string, utcTime: string) => void
  placeholder: string
  className?: string
}

export default function CrickTimePicker({
  value,
  onChange,
  className = '',
  placeholder,
}: TimePickerUTCProps) {
  const handleConfirm = useCallback(
    (event: ConfirmEventData) => {
      const { hour, minutes } = event
      if (hour && minutes) {
        const localTime = new Date()
        localTime.setHours(Number(hour), Number(minutes), 0, 0)
        const utcTime = toUTC(hour, minutes)
        onChange(localTime.toString(), utcTime)
      }
    },
    [onChange],
  )

  return (
    <div className={`w-full max-w-sm font-sans ${className}`}>
      <Timepicker
        value={value}
        className='w-full h-11 rounded-lg border font-bold border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300'
        placeholder={placeholder}
        options={{
          clock: {
            type: '24h',
          },
          ui: {
            editable: true,
            mobile: false,
          },
        }}
        onConfirm={handleConfirm}
      />
    </div>
  )
}
