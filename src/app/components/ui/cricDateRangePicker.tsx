import { CricDateRangeType } from '@/model/types/date-range.type'
import { TOURNAMENT } from '@/util/constants/constants'
import React, { useState } from 'react'
import Datepicker, {
  DateRangeType,
  DateValueType,
} from 'react-tailwindcss-datepicker'

type CricDateRangePickerProps = {
  onDateChange: (arg: CricDateRangeType) => void
}

export default function CricDateRangePicker(props: CricDateRangePickerProps) {
  const [selectedDate, setSelectedDate] = useState<DateRangeType | null>({
    startDate: '',
    endDate: '',
  })

  const handleValueChange = (dateRange: DateValueType | null) => {
    setSelectedDate(dateRange)
    const startDate: string = new Date(
      dateRange?.startDate as string,
    ).toISOString()
    const endDate: string = new Date(dateRange?.endDate as string).toISOString()
    props.onDateChange({ startDate: startDate, endDate: endDate })
  }

  return (
    <Datepicker
      value={selectedDate}
      placeholder={TOURNAMENT.CREATE_FORM.START_DATE.label}
      primaryColor={'indigo'}
      inputClassName={
        'relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-500 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-indigo-500 focus:ring-indigo-500/20 input-bg pt-4 pb-4'
      }
      toggleClassName={
        'absolute right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed primary-bg'
      }
      separator={'to'}
      minDate={new Date()}
      onChange={handleValueChange}
    />
  )
}
