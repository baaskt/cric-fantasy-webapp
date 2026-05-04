'use client'

import CricTimeInput from '@/components/ui/CricTimeInput'
import CrickTimePicker from '@/components/ui/CricTimePicker'
import CricTimeZoneInput from '@/components/ui/CricTimeZoneInput'
import { Toast } from '@/components/ui/Toast'
import { useMutateRequest } from '@/hooks/useMutateRequest'
import { HttpMethod } from '@/model/enum/http-method.enum'
import { useAuth } from '@/providers/AuthProvider'
import { useTournament } from '@/providers/TournamentProvider'
import { COLORS } from '@/util/colors'
import { TOURNAMENTS } from '@/util/constants/endpoints'
import { convertToUtcAndFormat, convertUtcTimeStrToLocal, formatTimeFromDate } from '@/util/helper'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import GavelIcon from '@mui/icons-material/Gavel'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'

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

// ── All IANA timezones (popular first, then rest alphabetically) ──────────────

export default function TournamentSettings() {
  const { isAdmin } = useAuth()
  const { activeTournament } = useTournament()
  const tournamentId = activeTournament?.tournamentId

  const [playingXIStartHour, setPlayingXIStartHour] = useState('09:00')
  const [playingXIDuration, setPlayingXIDuration] = useState(4)
  const [playingXITimezone, setPlayingXITimezone] = useState('Asia/Kolkata')

  const [tenderStartHour, setTenderStartHour] = useState('')
  const [tenderEndHour, setTenderEndHour] = useState('')
  const [tenderRevealHour, setTenderRevealHour] = useState('')

  const [tenderStartHourUtc, setTenderStartHourUtc] = useState('')
  const [tenderEndHourUtc, setTenderEndHourUtc] = useState('')
  const [tenderRevealHourUtc, setTenderRevealHourUtc] = useState('')
  const [toast, setToast] = useState({ visible: false, message: '' })

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

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

  // ── Populate from API response ─────────────────────────────────────────────
  useEffect(() => {
    if (!activeTournament) return
    if (activeTournament.playingXIStartHour)
      setPlayingXIStartHour(activeTournament.playingXIStartHour)
    if (activeTournament.playingXIDuration) setPlayingXIDuration(activeTournament.playingXIDuration)
    if (activeTournament.playingXITimezone) setPlayingXITimezone(activeTournament.playingXITimezone)

    const startTime = convertUtcTimeStrToLocal(activeTournament.tenderStartTime)
    setTenderStartHour(startTime)
    const startTimeUtc = convertToUtcAndFormat(activeTournament.tenderStartTime)
    setTenderStartHourUtc(startTimeUtc)
    const endTime = convertUtcTimeStrToLocal(activeTournament.tenderEndTime)
    setTenderEndHour(endTime)
    const endTimeUtc = convertToUtcAndFormat(activeTournament.tenderEndTime)
    setTenderStartHourUtc(endTimeUtc)
    const revealTime = convertUtcTimeStrToLocal(activeTournament.tenderRevealTime)
    setTenderRevealHour(revealTime)
    const revealTimeUtc = convertToUtcAndFormat(activeTournament.tenderRevealTime)
    setTenderStartHourUtc(revealTimeUtc)
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
        tenderStartTime: tenderStartHourUtc,
        tenderEndTime: tenderEndHourUtc,
        tenderRevealTime: tenderRevealHourUtc,
      } as never)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2800)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 2800)
    }
  }

  const showToast = useCallback((message: string) => {
    setToast({ visible: true, message })
    setTimeout(() => setToast({ visible: false, message: '' }), 2600)
  }, [])

  const handleStartTimeChange = (updatedLocalTime: string, updatedUtcTime: string) => {
    const localTime = formatTimeFromDate(updatedLocalTime)
    setTenderStartHour(localTime)
    const utcTime = formatTimeFromDate(updatedUtcTime)
    setTenderStartHourUtc(utcTime)
  }

  const isValidEndTime = (endTime: string) => {
    const [startHour, startMin] = tenderStartHour.split(':').map(Number)
    const [endHour, endMin] = endTime.split(':').map(Number)
    const startTotal = startHour * 60 + startMin
    const endTotal = endHour * 60 + endMin
    return endTotal > startTotal
  }

  const handleEndTimeChange = (updatedLocalTime: string, updatedUtcTime: string) => {
    const localTime = formatTimeFromDate(updatedLocalTime)
    const isValidTime = isValidEndTime(localTime)
    if (!isValidTime) {
      showToast('End time should be greater than Start time')
      return
    }
    setTenderEndHour(localTime)
    const utcTime = formatTimeFromDate(updatedUtcTime)
    setTenderEndHourUtc(utcTime)
  }

  const isValidRevealTime = (revealTime: string) => {
    const [endHour, endMin] = tenderEndHour.split(':').map(Number)
    const [revealHour, revealMin] = revealTime.split(':').map(Number)
    const endTotal = endHour * 60 + endMin
    const revealTotal = revealHour * 60 + revealMin
    return revealTotal > endTotal
  }

  const handleRevealTimeChange = (updatedLocalTime: string, updatedUtcTime: string) => {
    const localTime = formatTimeFromDate(updatedLocalTime)
    const isValidTime = isValidRevealTime(localTime)
    if (!isValidTime) {
      showToast('Reveal time should be greater than End time')
      return
    }
    setTenderRevealHour(localTime)
    const utcTime = formatTimeFromDate(updatedUtcTime)
    setTenderRevealHourUtc(utcTime)
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
                <CricTimeInput
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
                <CricTimeZoneInput value={playingXITimezone} onChange={setPlayingXITimezone} />
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
                <label style={labelStyle}>Tender Opens (Local Time)</label>
                <CrickTimePicker
                  placeholder={'Select a start time'}
                  value={tenderStartHour}
                  onChange={handleStartTimeChange}
                />
              </div>
              <div>
                <label style={labelStyle}>Tender Closes (Local Time)</label>
                <CrickTimePicker
                  placeholder={'Select a end time'}
                  value={tenderEndHour}
                  onChange={handleEndTimeChange}
                />
              </div>
              <div>
                <label style={labelStyle}>Tender Reveals (Local Time)</label>
                <CrickTimePicker
                  placeholder={'Select a reveal time'}
                  value={tenderRevealHour}
                  onChange={handleRevealTimeChange}
                />
              </div>
            </div>
            <Toast message={toast.message} visible={toast.visible} />

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
                  <span className='text-gray-900 text-sm'>{tenderStartHour}</span>
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
                  ></span>
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
                  <span className='text-gray-900 text-sm'>{tenderEndHour}</span>
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
                  ></span>
                </div>

                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: COLORS.cricPrimary,
                    }}
                  />
                  <span
                    style={{
                      color: COLORS.cricPrimary,
                      fontWeight: 700,
                      fontSize: 11,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Results
                  </span>
                  <span className='text-gray-900 text-sm'>{tenderRevealHour}h</span>
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
