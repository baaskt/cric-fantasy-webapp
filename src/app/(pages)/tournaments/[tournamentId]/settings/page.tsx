'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/providers/AuthProvider'
import { useTournament } from '@/providers/TournamentProvider'
import { useMutateRequest } from '@/hooks/useMutateRequest'
import { HttpMethod } from '@/model/enum/http-method.enum'
import { TOURNAMENTS } from '@/util/constants/endpoints'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import GavelIcon from '@mui/icons-material/Gavel'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'

const TIMEZONES = [
  { label: 'UTC', value: 'UTC' },
  { label: 'IST — India (UTC+5:30)', value: 'Asia/Kolkata' },
  { label: 'PKT — Pakistan (UTC+5:00)', value: 'Asia/Karachi' },
  { label: 'SLST — Sri Lanka (UTC+5:30)', value: 'Asia/Colombo' },
  { label: 'BST — Bangladesh (UTC+6:00)', value: 'Asia/Dhaka' },
  { label: 'AEST — Sydney (UTC+10/11)', value: 'Australia/Sydney' },
  { label: 'AEDT — Melbourne (UTC+10/11)', value: 'Australia/Melbourne' },
  { label: 'GMT/BST — London (UTC+0/+1)', value: 'Europe/London' },
  { label: 'SAST — South Africa (UTC+2)', value: 'Africa/Johannesburg' },
  { label: 'CAT — Zimbabwe (UTC+2)', value: 'Africa/Harare' },
  { label: 'AST — West Indies (UTC-4)', value: 'America/Barbados' },
  { label: 'NZST — New Zealand (UTC+12/13)', value: 'Pacific/Auckland' },
]

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
}

const inputStyle = {
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

const labelStyle = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '.07em',
  textTransform: 'uppercase' as const,
  color: '#62769a',
  marginBottom: 6,
}

export default function TournamentSettings() {
  const { isAdmin } = useAuth()
  const { activeTournament } = useTournament()
  const tournamentId = activeTournament?.tournamentId

  const [playingXIStartTime, setPlayingXIStartTime] = useState('09:00')
  const [playingXIHours, setPlayingXIHours] = useState(4)
  const [timezone, setTimezone] = useState('Asia/Kolkata')

  const [tenderStartTime, setTenderStartTime] = useState('10:00')
  const [tenderDurationHours, setTenderDurationHours] = useState(24)
  const [tenderResultDelayHours, setTenderResultDelayHours] = useState(2)

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const settingsUrl = tournamentId
    ? `${TOURNAMENTS.UPDATE_SETTINGS}${tournamentId}/settings`
    : 'noop'
  const { trigger: saveSettings } = useMutateRequest(settingsUrl, HttpMethod.PUT)

  const handleSave = async () => {
    setSaveStatus('saving')
    try {
      await saveSettings({
        playingXIStartTime,
        playingXIHours,
        timezone,
        tenderStartTime,
        tenderDurationHours,
        tenderResultDelayHours,
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
            overflow: 'hidden',
          }}
        >
          {/* Card header */}
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

          {/* Card body */}
          <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 16,
              }}
              className='settings-grid'
            >
              {/* Start time */}
              <div>
                <label style={labelStyle}>Start Time</label>
                <motion.input
                  type='time'
                  value={playingXIStartTime}
                  onChange={e => setPlayingXIStartTime(e.target.value)}
                  style={inputStyle}
                  whileFocus={{ borderColor: '#2454d4', boxShadow: '0 0 0 3px rgba(36,84,212,.1)' }}
                />
              </div>

              {/* Window hours */}
              <div>
                <label style={labelStyle}>Duration (hours)</label>
                <motion.input
                  type='number'
                  min={1}
                  max={48}
                  value={playingXIHours}
                  onChange={e => setPlayingXIHours(Math.max(1, +e.target.value))}
                  style={inputStyle}
                  whileFocus={{ borderColor: '#2454d4', boxShadow: '0 0 0 3px rgba(36,84,212,.1)' }}
                />
              </div>

              {/* Timezone */}
              <div>
                <label style={labelStyle}>Timezone</label>
                <motion.select
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                  whileFocus={{ borderColor: '#2454d4', boxShadow: '0 0 0 3px rgba(36,84,212,.1)' }}
                >
                  {TIMEZONES.map(tz => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </motion.select>
              </div>
            </div>

            {/* Preview strip */}
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
                {formatTimePreview(playingXIStartTime, playingXIHours)}
              </span>
              <span style={{ color: '#62769a', marginLeft: 4 }}>({playingXIHours}h window)</span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: 11,
                  color: '#8fa0c0',
                  fontWeight: 500,
                }}
              >
                {TIMEZONES.find(t => t.value === timezone)
                  ?.label.split('—')[0]
                  .trim()}
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
            overflow: 'hidden',
          }}
        >
          {/* Card header */}
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

          {/* Card body */}
          <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 16,
              }}
              className='settings-grid'
            >
              {/* Tender start */}
              <div>
                <label style={labelStyle}>Tender Opens</label>
                <motion.input
                  type='time'
                  value={tenderStartTime}
                  onChange={e => setTenderStartTime(e.target.value)}
                  style={inputStyle}
                  whileFocus={{
                    borderColor: '#ea8c0d',
                    boxShadow: '0 0 0 3px rgba(234,140,13,.1)',
                  }}
                />
              </div>

              {/* Tender duration */}
              <div>
                <label style={labelStyle}>Tender Duration (hrs)</label>
                <motion.input
                  type='number'
                  min={1}
                  max={168}
                  value={tenderDurationHours}
                  onChange={e => setTenderDurationHours(Math.max(1, +e.target.value))}
                  style={inputStyle}
                  whileFocus={{
                    borderColor: '#ea8c0d',
                    boxShadow: '0 0 0 3px rgba(234,140,13,.1)',
                  }}
                />
              </div>

              {/* Results delay */}
              <div>
                <label style={labelStyle}>Results Delay (hrs)</label>
                <motion.input
                  type='number'
                  min={0}
                  max={72}
                  value={tenderResultDelayHours}
                  onChange={e => setTenderResultDelayHours(Math.max(0, +e.target.value))}
                  style={inputStyle}
                  whileFocus={{
                    borderColor: '#ea8c0d',
                    boxShadow: '0 0 0 3px rgba(234,140,13,.1)',
                  }}
                />
              </div>
            </div>

            {/* Timeline preview */}
            <motion.div
              layout
              style={{
                background: '#fffbf0',
                borderRadius: 10,
                padding: '14px 16px',
                fontSize: 12,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0,
                  position: 'relative',
                }}
              >
                {/* Node: opens */}
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
                  <span style={{ color: '#62769a', fontSize: 10 }}>{tenderStartTime}</span>
                </div>

                {/* Line: tender duration */}
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
                    {tenderDurationHours}h
                  </span>
                </div>

                {/* Node: closes */}
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
                    {formatTimePreview(tenderStartTime, tenderDurationHours).split('→')[1].trim()}
                  </span>
                </div>

                {/* Dashed line: results delay */}
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
                  {tenderResultDelayHours > 0 && (
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
                      +{tenderResultDelayHours}h
                    </span>
                  )}
                </div>

                {/* Node: results */}
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: tenderResultDelayHours > 0 ? '#22c55e' : '#ea8c0d',
                    }}
                  />
                  <span
                    style={{
                      color: tenderResultDelayHours > 0 ? '#22c55e' : '#ea8c0d',
                      fontWeight: 700,
                      fontSize: 11,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Results
                  </span>
                  <span style={{ color: '#62769a', fontSize: 10 }}>
                    {tenderResultDelayHours === 0
                      ? 'immediate'
                      : formatTimePreview(
                          tenderStartTime,
                          tenderDurationHours + tenderResultDelayHours,
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
        input[type='time']::-webkit-calendar-picker-indicator,
        input[type='number']::-webkit-inner-spin-button {
          opacity: 0.5;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
