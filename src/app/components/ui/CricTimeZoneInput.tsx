import { useEffect, useRef, useState } from 'react'

const POPULAR_TIMEZONES = [
  'UTC',
  'Asia/Kolkata',
  'Asia/Karachi',
  'Asia/Colombo',
  'Asia/Dhaka',
  'Australia/Sydney',
  'Australia/Melbourne',
  'Europe/London',
  'Africa/Johannesburg',
  'Africa/Harare',
  'America/Barbados',
  'Pacific/Auckland',
]

function getAllTimezones(): string[] {
  try {
    const all: string[] = Intl.supportedValuesOf('timeZone')
    const rest = all.filter(tz => !POPULAR_TIMEZONES.includes(tz))
    return [...POPULAR_TIMEZONES, ...rest]
  } catch {
    return POPULAR_TIMEZONES
  }
}

function CricTimeZoneInput({
  value,
  onChange,
}: {
  value: string
  onChange: (val: string) => void
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const [allZones, setAllZones] = useState<string[]>(POPULAR_TIMEZONES)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load full IANA list on client only (avoids SSR ICU limitation)
  useEffect(() => {
    setAllZones(getAllTimezones())
  }, [])

  const filtered = query
    ? allZones.filter(tz => tz.toLowerCase().includes(query.toLowerCase()))
    : allZones

  useEffect(() => {
    setActiveIdx(0)
  }, [query])

  useEffect(() => {
    if (open && listRef.current) {
      const item = listRef.current.querySelector<HTMLElement>(`[data-idx="${activeIdx}"]`)
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIdx, open])

  const select = (tz: string) => {
    onChange(tz)
    setQuery('')
    setOpen(false)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') setOpen(true)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[activeIdx]) select(filtered[activeIdx])
    } else if (e.key === 'Escape') {
      setOpen(false)
      setQuery('')
    }
  }

  const popularCount = POPULAR_TIMEZONES.filter(tz =>
    tz.toLowerCase().includes(query.toLowerCase()),
  ).length

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        ref={inputRef}
        value={open ? query : value}
        onChange={e => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => {
          setQuery('')
          setOpen(true)
        }}
        onBlur={() => {
          setTimeout(() => {
            setOpen(false)
            setQuery('')
          }, 150)
        }}
        onKeyDown={handleKeyDown}
        placeholder='Search timezone…'
        style={{
          width: '100%',
          background: '#f8faff',
          border: '1.5px solid #dde3f0',
          borderRadius: 10,
          padding: '10px 14px',
          fontSize: 14,
          fontFamily: 'var(--font-body, DM Sans, sans-serif)',
          color: '#0f1a2e',
          outline: 'none',
          transition: 'border-color .18s, box-shadow .18s',
          boxSizing: 'border-box',
        }}
      />
      {open && filtered.length > 0 && (
        <div
          ref={listRef}
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#ffffff',
            border: '1.5px solid #dde3f0',
            borderRadius: 10,
            boxShadow: '0 8px 24px rgba(36,84,212,.12)',
            maxHeight: 320,
            overflowY: 'auto',
            zIndex: 200,
            fontSize: 13,
            fontFamily: 'var(--font-body, DM Sans, sans-serif)',
          }}
        >
          {filtered.map((tz, idx) => {
            const isAllDivider =
              idx === popularCount && popularCount > 0 && popularCount < filtered.length
            return (
              <div key={tz}>
                {isAllDivider && (
                  <div
                    style={{
                      padding: '4px 12px',
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '.08em',
                      textTransform: 'uppercase',
                      color: '#8fa0c0',
                      background: '#f8faff',
                      borderTop: '1px solid #eef1f8',
                      borderBottom: '1px solid #eef1f8',
                    }}
                  >
                    All Timezones
                  </div>
                )}
                <div
                  data-idx={idx}
                  onMouseDown={() => select(tz)}
                  onMouseEnter={() => setActiveIdx(idx)}
                  style={{
                    padding: '8px 14px',
                    cursor: 'pointer',
                    background: idx === activeIdx ? '#eff4ff' : 'transparent',
                    color: idx === activeIdx ? '#2454d4' : '#0f1a2e',
                    fontWeight: idx === activeIdx ? 600 : 400,
                    transition: 'background .1s',
                  }}
                >
                  {tz}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CricTimeZoneInput
