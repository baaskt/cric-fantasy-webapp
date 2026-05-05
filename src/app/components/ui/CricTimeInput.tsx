import { useEffect, useRef, useState } from 'react'
import ScheduleIcon from '@mui/icons-material/Schedule'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

// 30-minute slots: 00:00, 00:30, 01:00 … 23:30
const TIME_SLOTS = Array.from({ length: 96 }, (_, i) => {
  const h = Math.floor(i / 4)
  const m = ['00', '15', '30', '45'][i % 4]
  return `${String(h).padStart(2, '0')}:${m}`
})

function CricTimeInput({
  value,
  onChange,
  accentColor,
  accentShadow,
}: {
  value: string
  onChange: (val: string) => void
  accentColor: string
  accentShadow: string
}) {
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(() => TIME_SLOTS.indexOf(value))
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Scroll selected item into view within the list only (avoid page scroll)
  useEffect(() => {
    if (open && listRef.current) {
      const selected = listRef.current.querySelector<HTMLElement>('[data-selected="true"]')
      if (selected) {
        const list = listRef.current
        list.scrollTop = selected.offsetTop - list.clientHeight / 2 + selected.offsetHeight / 2
      }
    }
  }, [open])

  const select = (slot: string) => {
    onChange(slot)
    setActiveIdx(TIME_SLOTS.indexOf(slot))
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault()
        setOpen(true)
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => {
        const next = Math.min(i + 1, TIME_SLOTS.length - 1)
        listRef.current
          ?.querySelector<HTMLElement>(`[data-idx="${next}"]`)
          ?.scrollIntoView({ block: 'nearest' })
        return next
      })
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => {
        const prev = Math.max(i - 1, 0)
        listRef.current
          ?.querySelector<HTMLElement>(`[data-idx="${prev}"]`)
          ?.scrollIntoView({ block: 'nearest' })
        return prev
      })
    } else if (e.key === 'Enter') {
      e.preventDefault()
      select(TIME_SLOTS[activeIdx])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <button
        type='button'
        onClick={() => setOpen(o => !o)}
        onKeyDown={handleKeyDown}
        style={{
          width: '100%',
          background: '#f8faff',
          borderRadius: 10,
          padding: '10px 14px',
          fontSize: 14,
          fontFamily: 'var(--font-body, DM Sans, sans-serif)',
          color: '#0f1a2e',
          outline: 'none',
          transition: 'border-color .18s, box-shadow .18s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          border: open ? `1.5px solid ${accentColor}` : '1.5px solid #dde3f0',
          boxShadow: open ? `0 0 0 3px ${accentShadow}` : 'none',
          boxSizing: 'border-box',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ScheduleIcon sx={{ fontSize: 16, color: open ? accentColor : '#8fa0c0' }} />
          <span style={{ fontWeight: 600, letterSpacing: '.02em' }}>{value}</span>
        </span>
        <KeyboardArrowDownIcon
          sx={{
            fontSize: 18,
            color: '#8fa0c0',
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform .2s',
          }}
        />
      </button>

      {open && (
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
            maxHeight: 220,
            overflowY: 'auto',
            zIndex: 200,
            fontSize: 13,
            fontFamily: 'var(--font-body, DM Sans, sans-serif)',
          }}
        >
          {TIME_SLOTS.map((slot, idx) => {
            const isSelected = slot === value
            const isActive = idx === activeIdx
            return (
              <div
                key={slot}
                data-idx={idx}
                data-selected={isSelected}
                onMouseDown={() => select(slot)}
                onMouseEnter={() => setActiveIdx(idx)}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  background: isSelected ? accentShadow : isActive ? '#f4f7fc' : 'transparent',
                  color: isSelected ? accentColor : '#0f1a2e',
                  fontWeight: isSelected ? 700 : 400,
                  transition: 'background .1s',
                }}
              >
                {slot}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CricTimeInput
