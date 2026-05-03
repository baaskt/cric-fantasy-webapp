'use client'

import { useMutateRequest } from '@/hooks/useMutateRequest'
import { HttpMethod } from '@/model/enum/http-method.enum'
import { useAuth } from '@/providers/AuthProvider'
import { useTournament } from '@/providers/TournamentProvider'
import { TOURNAMENTS } from '@/util/constants/endpoints'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import GavelIcon from '@mui/icons-material/Gavel'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import ScheduleIcon from '@mui/icons-material/Schedule'
import { AnimatePresence, motion } from 'framer-motion'
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

// 30-minute slots: 00:00, 00:30, 01:00 … 23:30
const TIME_SLOTS = Array.from({ length: 96 }, (_, i) => {
  const h = Math.floor(i / 4)
  const m = ['00', '15', '30', '45'][i % 4]
  return `${String(h).padStart(2, '0')}:${m}`
})

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: i * 0.12,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
}

const inputStyle: React.CSSProperties = {
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
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '.07em',
  textTransform: 'uppercase',
  color: '#62769a',
  marginBottom: 6,
}

// ── Custom TimeInput ──────────────────────────────────────────────────────────
function TimeInput({
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
          ...inputStyle,
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

// ── All IANA timezones (popular first, then rest alphabetically) ──────────────
function getAllTimezones(): string[] {
  try {
    const all: string[] = Intl.supportedValuesOf('timeZone')
    const rest = all.filter(tz => !POPULAR_TIMEZONES.includes(tz))
    return [...POPULAR_TIMEZONES, ...rest]
  } catch {
    return POPULAR_TIMEZONES
  }
}

// ── Custom TimezoneInput ──────────────────────────────────────────────────────
function TimezoneInput({ value, onChange }: { value: string; onChange: (val: string) => void }) {
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
        style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
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

export default function TournamentSettings() {
  const { isAdmin } = useAuth()
  const { activeTournament } = useTournament()
  const tournamentId = activeTournament?.tournamentId

  const [playingXIStartHour, setPlayingXIStartHour] = useState('09:00')
  const [playingXIDuration, setPlayingXIDuration] = useState(4)
  const [playingXITimezone, setPlayingXITimezone] = useState('Asia/Kolkata')

  const [tenderStartHour, setTenderStartHour] = useState('10:00')
  const [tenderDuration, setTenderDuration] = useState(24)
  const [tenderResultRevealDuration, setTenderResultRevealDuration] = useState(2)

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  // ── Populate from API response ─────────────────────────────────────────────
  useEffect(() => {
    if (!activeTournament) return
    if (activeTournament.playingXIStartHour)
      setPlayingXIStartHour(activeTournament.playingXIStartHour)
    if (activeTournament.playingXIDuration) setPlayingXIDuration(activeTournament.playingXIDuration)
    if (activeTournament.playingXITimezone) setPlayingXITimezone(activeTournament.playingXITimezone)
    if (activeTournament.tenderStartHour) setTenderStartHour(activeTournament.tenderStartHour)
    if (activeTournament.tenderDuration) setTenderDuration(activeTournament.tenderDuration)
    if (activeTournament.tenderResultRevealDuration != null)
      setTenderResultRevealDuration(activeTournament.tenderResultRevealDuration)
  }, [activeTournament])

  const isUnconfigured = !!activeTournament && !activeTournament.playingXIStartHour

  const settingsUrl = tournamentId ? `${TOURNAMENTS.UPDATE_STATUS_URL}/${tournamentId}` : 'noop'
  const { trigger: saveSettings } = useMutateRequest(settingsUrl, HttpMethod.PUT)

  const handleSave = async () => {
    setSaveStatus('saving')
    try {
      await saveSettings({
        playingXIStartHour,
        playingXIDuration,
        playingXITimezone,
        tenderStartHour,
        tenderDuration,
        tenderResultRevealDuration,
      } as never)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2800)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 2800)
    }
  }

  // ── Admin guard ───────────────────────────────────────────────────────────
  if (!isAdmin()) {
    return (
      <div
        style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          color: '#62769a',
        }}
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        >
          <LockOutlinedIcon sx={{ fontSize: 56, color: '#c8d4ee' }} />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          style={{ fontSize: 16, fontWeight: 600, color: '#0f1a2e' }}
        >
          Access Restricted
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
          style={{ fontSize: 13 }}
        >
          Only tournament admins can manage settings.
        </motion.p>
      </div>
    )
  }

  // ── Time window preview helper ─────────────────────────────────────────────
  const formatTimePreview = (startTime: string, hours: number) => {
    const [h, m] = startTime.split(':').map(Number)
    const endH = (h + hours) % 24
    const fmt = (hh: number, mm: number) => {
      const period = hh < 12 ? 'AM' : 'PM'
      const hh12 = hh % 12 || 12
      return `${hh12}:${String(mm).padStart(2, '0')} ${period}`
    }
    return `${fmt(h, m)} → ${fmt(endH, m)}`
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f4f7fc',
        padding: '32px 20px 80px',
        fontFamily: 'var(--font-body, DM Sans, sans-serif)',
      }}
    >
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 36 }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              color: '#2454d4',
              marginBottom: 6,
            }}
          >
            {activeTournament?.tournamentName ?? 'Tournament'}
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-heading, Outfit, sans-serif)',
              fontSize: 32,
              fontWeight: 700,
              color: '#0f1a2e',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Settings
          </h1>
          <p style={{ marginTop: 8, fontSize: 13, color: '#62769a' }}>
            Configure time windows and scheduling rules for this tournament.
          </p>
        </motion.div>

        {/* ── Unconfigured banner ── */}
        <AnimatePresence>
          {isUnconfigured && saveStatus !== 'saved' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                background: '#fff7ed',
                border: '1.5px solid #fddea0',
                borderRadius: 12,
                padding: '14px 18px',
                marginBottom: 20,
              }}
            >
              <InfoOutlinedIcon sx={{ fontSize: 20, color: '#ea8c0d', flexShrink: 0, mt: '1px' }} />
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading, Outfit, sans-serif)',
                    fontWeight: 700,
                    fontSize: 14,
                    color: '#92400e',
                    marginBottom: 2,
                  }}
                >
                  No settings saved yet
                </div>
                <div style={{ fontSize: 13, color: '#b45309' }}>
                  Configure the time windows below and click <strong>Save Settings</strong> to
                  activate them for this tournament.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Section 01: Playing XI Window ── */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial='hidden'
          animate='visible'
          style={{
            background: '#ffffff',
            borderRadius: 16,
            boxShadow: '0 2px 16px rgba(36,84,212,.07)',
            marginBottom: 20,
          }}
        >
          <div
            style={{
              padding: '20px 28px',
              borderBottom: '1px solid #eef1f8',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#eff4ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 18, color: '#2454d4' }} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-heading, Outfit, sans-serif)',
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#0f1a2e',
                }}
              >
                Playing XI Window
              </div>
              <div style={{ fontSize: 12, color: '#62769a', marginTop: 1 }}>
                Define when team captains can set their playing XI
              </div>
            </div>
            <span
              style={{
                marginLeft: 'auto',
                fontSize: 28,
                fontFamily: 'var(--font-heading, Outfit, sans-serif)',
                fontWeight: 800,
                color: '#eef1f8',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              01
            </span>
          </div>

          <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}
              className='settings-grid'
            >
              <div>
                <label style={labelStyle}>Start Time</label>
                <TimeInput
                  value={playingXIStartHour}
                  onChange={setPlayingXIStartHour}
                  accentColor='#2454d4'
                  accentShadow='rgba(36,84,212,.12)'
                />
              </div>
              <div>
                <label style={labelStyle}>Duration (hours)</label>
                <motion.input
                  type='number'
                  min={1}
                  max={48}
                  value={playingXIDuration}
                  onChange={e => setPlayingXIDuration(Math.max(1, +e.target.value))}
                  style={inputStyle}
                  whileFocus={{ borderColor: '#2454d4', boxShadow: '0 0 0 3px rgba(36,84,212,.1)' }}
                />
              </div>
              <div>
                <label style={labelStyle}>Timezone</label>
                <TimezoneInput value={playingXITimezone} onChange={setPlayingXITimezone} />
              </div>
            </div>

            <motion.div
              layout
              style={{
                background: '#f0f5ff',
                borderRadius: 10,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 13,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#2454d4',
                  flexShrink: 0,
                }}
              />
              <span style={{ color: '#62769a', fontWeight: 500 }}>Window:</span>
              <span
                style={{
                  fontFamily: 'var(--font-heading, Outfit, sans-serif)',
                  fontWeight: 700,
                  color: '#2454d4',
                  letterSpacing: '.02em',
                }}
              >
                {formatTimePreview(playingXIStartHour, playingXIDuration)}
              </span>
              <span style={{ color: '#62769a', marginLeft: 4 }}>({playingXIDuration}h window)</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: '#8fa0c0', fontWeight: 500 }}>
                {playingXITimezone}
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Section 02: Tender Settings ── */}
        <motion.div
          custom={1}
          variants={cardVariants}
          initial='hidden'
          animate='visible'
          style={{
            background: '#ffffff',
            borderRadius: 16,
            boxShadow: '0 2px 16px rgba(36,84,212,.07)',
            marginBottom: 28,
          }}
        >
          <div
            style={{
              padding: '20px 28px',
              borderBottom: '1px solid #eef1f8',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#fff7ed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <GavelIcon sx={{ fontSize: 18, color: '#ea8c0d' }} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-heading, Outfit, sans-serif)',
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#0f1a2e',
                }}
              >
                Tender Settings
              </div>
              <div style={{ fontSize: 12, color: '#62769a', marginTop: 1 }}>
                Schedule tender open, close, and result reveal timing
              </div>
            </div>
            <span
              style={{
                marginLeft: 'auto',
                fontSize: 28,
                fontFamily: 'var(--font-heading, Outfit, sans-serif)',
                fontWeight: 800,
                color: '#eef1f8',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              02
            </span>
          </div>

          <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}
              className='settings-grid'
            >
              <div>
                <label style={labelStyle}>Tender Opens</label>
                <TimeInput
                  value={tenderStartHour}
                  onChange={setTenderStartHour}
                  accentColor='#ea8c0d'
                  accentShadow='rgba(234,140,13,.12)'
                />
              </div>
              <div>
                <label style={labelStyle}>Tender Duration (hrs)</label>
                <motion.input
                  type='number'
                  min={1}
                  max={168}
                  value={tenderDuration}
                  onChange={e => setTenderDuration(Math.max(1, +e.target.value))}
                  style={inputStyle}
                  whileFocus={{
                    borderColor: '#ea8c0d',
                    boxShadow: '0 0 0 3px rgba(234,140,13,.1)',
                  }}
                />
              </div>
              <div>
                <label style={labelStyle}>Results Delay (hrs)</label>
                <motion.input
                  type='number'
                  min={0}
                  max={72}
                  value={tenderResultRevealDuration}
                  onChange={e => setTenderResultRevealDuration(Math.max(0, +e.target.value))}
                  style={inputStyle}
                  whileFocus={{
                    borderColor: '#ea8c0d',
                    boxShadow: '0 0 0 3px rgba(234,140,13,.1)',
                  }}
                />
              </div>
            </div>

            <motion.div
              layout
              style={{
                background: '#fffbf0',
                borderRadius: 10,
                padding: '14px 16px',
                fontSize: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, position: 'relative' }}>
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                >
                  <div
                    style={{ width: 10, height: 10, borderRadius: '50%', background: '#ea8c0d' }}
                  />
                  <span
                    style={{
                      color: '#ea8c0d',
                      fontWeight: 700,
                      fontSize: 11,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Opens
                  </span>
                  <span style={{ color: '#62769a', fontSize: 10 }}>{tenderStartHour}</span>
                </div>

                <div
                  style={{
                    flex: 1,
                    position: 'relative',
                    height: 2,
                    background: '#fddea0',
                    margin: '0 4px',
                    marginBottom: 28,
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: -18,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: 10,
                      color: '#62769a',
                      whiteSpace: 'nowrap',
                      fontWeight: 600,
                    }}
                  >
                    {tenderDuration}h
                  </span>
                </div>

                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                >
                  <div
                    style={{ width: 10, height: 10, borderRadius: '50%', background: '#ea8c0d' }}
                  />
                  <span
                    style={{
                      color: '#ea8c0d',
                      fontWeight: 700,
                      fontSize: 11,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Closes
                  </span>
                  <span style={{ color: '#62769a', fontSize: 10 }}>
                    {formatTimePreview(tenderStartHour, tenderDuration).split('→')[1].trim()}
                  </span>
                </div>

                <div
                  style={{
                    flex: 0.5,
                    height: 2,
                    backgroundImage:
                      'repeating-linear-gradient(to right, #fddea0 0, #fddea0 6px, transparent 6px, transparent 12px)',
                    margin: '0 4px',
                    marginBottom: 28,
                    position: 'relative',
                  }}
                >
                  {tenderResultRevealDuration > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: -18,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: 10,
                        color: '#62769a',
                        whiteSpace: 'nowrap',
                        fontWeight: 600,
                      }}
                    >
                      +{tenderResultRevealDuration}h
                    </span>
                  )}
                </div>

                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: tenderResultRevealDuration > 0 ? '#22c55e' : '#ea8c0d',
                    }}
                  />
                  <span
                    style={{
                      color: tenderResultRevealDuration > 0 ? '#22c55e' : '#ea8c0d',
                      fontWeight: 700,
                      fontSize: 11,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Results
                  </span>
                  <span style={{ color: '#62769a', fontSize: 10 }}>
                    {tenderResultRevealDuration === 0
                      ? 'immediate'
                      : formatTimePreview(
                          tenderStartHour,
                          tenderDuration + tenderResultRevealDuration,
                        )
                          .split('→')[1]
                          .trim()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Save button ── */}
        <motion.div custom={2} variants={cardVariants} initial='hidden' animate='visible'>
          <AnimatePresence mode='wait'>
            {saveStatus === 'saved' ? (
              <motion.div
                key='saved'
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '14px 24px',
                  borderRadius: 12,
                  background: '#d1fae5',
                  color: '#065f46',
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                <CheckCircleOutlineIcon sx={{ fontSize: 20 }} />
                Settings saved successfully!
              </motion.div>
            ) : saveStatus === 'error' ? (
              <motion.div
                key='error'
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '14px 24px',
                  borderRadius: 12,
                  background: '#fee2e2',
                  color: '#991b1b',
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                <ErrorOutlineIcon sx={{ fontSize: 20 }} />
                Failed to save — please try again
              </motion.div>
            ) : (
              <motion.button
                key='save'
                onClick={() => void handleSave()}
                disabled={saveStatus === 'saving'}
                whileHover={{ scale: 1.015, boxShadow: '0 6px 24px rgba(36,84,212,.25)' }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: 12,
                  background: saveStatus === 'saving' ? '#7fa4e8' : '#2454d4',
                  color: '#ffffff',
                  fontFamily: 'var(--font-heading, Outfit, sans-serif)',
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: '.03em',
                  border: 'none',
                  cursor: saveStatus === 'saving' ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'background .2s',
                }}
              >
                <SaveOutlinedIcon sx={{ fontSize: 18 }} />
                {saveStatus === 'saving' ? 'Saving…' : 'Save Settings'}
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .settings-grid {
            grid-template-columns: 1fr !important;
          }
        }
        input[type='number']::-webkit-inner-spin-button {
          opacity: 0.5;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
