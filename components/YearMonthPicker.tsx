'use client'

import { useState } from 'react'

const YEARS = [2025, 2026, 2027]
const MONTHS = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월',
]

interface YearMonthPickerProps {
  value: string
  onChange: (value: string) => void
}

export default function YearMonthPicker({
  value,
  onChange,
}: YearMonthPickerProps) {
  const parsedYear = value ? Number(value.split('-')[0]) : null
  const parsedMonth = value ? Number(value.split('-')[1]) : null

  const [displayYear, setDisplayYear] = useState<number>(parsedYear ?? YEARS[0])

  const handleMonthSelect = (month: number) => {
    const next = `${displayYear}-${String(month).padStart(2, '0')}`
    onChange(value === next ? '' : next)
  }

  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm p-4 w-full max-w-full">
      <div className="flex items-center justify-center gap-2 mb-3">
        {YEARS.map((year) => (
          <button
            key={year}
            type="button"
            onClick={() => setDisplayYear(year)}
            className={`px-3 py-1.5 max-[400px]:px-2 rounded-lg text-ui-sm font-nanumgothic_bold transition-colors ${
              displayYear === year
                ? 'bg-secondary text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-secondary/10 hover:text-secondary'
            }`}
          >
            {year}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 max-[400px]:gap-1">
        {MONTHS.map((label, idx) => {
          const month = idx + 1
          const isSelected = parsedYear === displayYear && parsedMonth === month
          return (
            <button
              key={month}
              type="button"
              onClick={() => handleMonthSelect(month)}
              className={`p-2 max-[400px]:p-1 rounded-lg text-ui-sm max-[400px]:text-xs font-nanumgothic_regular transition-colors ${
                isSelected
                  ? 'bg-secondary text-white font-nanumgothic_bold'
                  : 'bg-gray-50 text-gray-700 hover:bg-secondary/10 hover:text-secondary'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
