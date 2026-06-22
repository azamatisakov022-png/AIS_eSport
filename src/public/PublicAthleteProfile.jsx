import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ATHLETES_DATA } from './PublicAthletes'
import { publicApi } from '../api/esport'

const RANK_BADGE = {
    'ЗМС КР':    { bg: 'rgba(255,59,48,0.15)', color: '#FF6B6B' },
    'МСМК':      { bg: 'rgba(88,86,214,0.15)', color: '#9B99FF' },
    'МС КР':     { bg: 'rgba(21,101,192,0.15)', color: '#64B5F6' },
    'КМС':       { bg: 'rgba(46,125,50,0.15)', color: '#81C784' },
}
const RANK_DEFAULT = { bg: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }

const MEDAL_COLORS = {
    1: { bg: '#FFD700', color: '#8B6914' },
    2: { bg: '#C0C0C0', color: '#666666' },
    3: { bg: '#CD7F32', color: '#5C3A1E' },
}

function getInitials(name) {
    const p = name.split(' ')
    return (p[0]?.[0] || '') + (p[1]?.[0] || '')
}

function countMedals(medals) {
    let g = 0, s = 0, b = 0
    medals.forEach(m => { if (m.place === 1) g++; else if (m.place === 2) s++; else if (m.place === 3) b++ })
    return { g, s, b, total: g + s + b }
}

export default function PublicAthleteProfile() {
    const { t } = useTranslation()
    const { id } = useParams()
    const [athlete, setAthlete] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let alive = true
        setLoading(true)
        publicApi.athlete(id)
            .then(a => { if (alive) setAthlete(a) })
            .catch(() => { if (alive) setAthlete(ATHLETES_DATA.find(a => a.id === Number(id)) || null) })
            .finally(() => { if (alive) setLoading(false) })
        return () => { alive = false }
    }, [id])

    if (loading) {
        return (
            <div className="pub-section">
                <div className="pub-container" style={{ textAlign: 'center', padding: '60px 0', color: 'var(--theme-text-secondary)' }}>Загрузка…</div>
            </div>
        )
    }

    if (!athlete) {
        return (
            <div className="pub-section">
                <div className="pub-container" style={{ textAlign: 'center', padding: '60px 0' }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#86868B" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 8, marginTop: 16 }}>{t('public.athleteNotFound')}</h2>
                    <Link to="/public/athletes" style={{ color: '#1B3A6B', fontSize: 13 }}>{t('public.backToRegistry')}</Link>
                </div>
            </div>
        )
    }

    const rc = RANK_BADGE[athlete.rank] || RANK_DEFAULT
    const mc = countMedals(athlete.medals)

    return (
        <div className="pub-section">
            <div className="pub-container" style={{ maxWidth: 720, margin: '0 auto' }}>
                <Link to="/public/athletes" style={s.backLink}>{t('public.backToRegistry')}</Link>

                {/* Dark Profile Header */}
                <div style={s.profileCard}>
                    <div style={s.profileHeader}>
                        <div style={s.profileAvatar}>{getInitials(athlete.name)}</div>
                        <div style={s.profileInfo}>
                            <h1 style={s.profileName}>{athlete.name}</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 6 }}>
                                <span style={{ ...s.rankBadge, background: rc.bg, color: rc.color }}>{athlete.rank}</span>
                                <span style={s.profileMeta}>{athlete.sport} · {athlete.region}</span>
                            </div>
                        </div>
                    </div>

                    {/* Medal Stats */}
                    <div style={s.statsRow}>
                        <div style={s.statCard}>
                            <span style={{ ...s.statNum, color: 'var(--theme-text-main)' }}>{mc.total}</span>
                            <span style={s.statLabel}>Всего медалей</span>
                        </div>
                        <div style={s.statCard}>
                            <span style={{ ...s.statNum, color: '#FFD700' }}>{mc.g}</span>
                            <span style={s.statLabel}>Золото</span>
                        </div>
                        <div style={s.statCard}>
                            <span style={{ ...s.statNum, color: '#C0C0C0' }}>{mc.s}</span>
                            <span style={s.statLabel}>Серебро</span>
                        </div>
                    </div>
                </div>

                {/* Achievements */}
                {athlete.medals.length > 0 && (
                    <div style={s.block}>
                        <h2 style={s.blockTitle}>{t('public.achievements')}</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {athlete.medals.map((m, i) => {
                                const mc2 = MEDAL_COLORS[m.place]
                                return (
                                    <div key={i} style={s.achieveItem}>
                                        <span style={{ ...s.placeCircle, background: mc2.bg, color: mc2.color }}>{m.place}</span>
                                        <div>
                                            <div style={s.achieveName}>{m.event}</div>
                                            <div style={s.achieveYear}>{m.year}</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Career */}
                <div style={s.block}>
                    <h2 style={s.blockTitle}>{t('public.sportInfo')}</h2>
                    <div style={s.infoTable}>
                        <div style={s.infoRow}><span style={s.infoLabel}>Тренер</span><span style={s.infoValue}>{athlete.coach}</span></div>
                        <div style={s.infoRow}><span style={s.infoLabel}>Организация</span><span style={s.infoValue}>{athlete.org}</span></div>
                        <div style={s.infoRow}><span style={s.infoLabel}>Сборная команда</span><span style={s.infoValue}>{athlete.team || '-'}</span></div>
                        <div style={s.infoRow}><span style={s.infoLabel}>Год рождения</span><span style={s.infoValue}>{athlete.birth ? String(athlete.birth).slice(0, 4) : '-'}</span></div>
                        <div style={s.infoRow}><span style={s.infoLabel}>Пол</span><span style={s.infoValue}>{athlete.sex === 'М' ? 'Мужской' : 'Женский'}</span></div>
                        <div style={s.infoRow}><span style={s.infoLabel}>Регион</span><span style={s.infoValue}>{athlete.region}</span></div>
                    </div>
                </div>

                {/* Documents */}
                <div style={s.block}>
                    <h2 style={s.blockTitle}>{t('public.personalInfo')}</h2>
                    <div style={s.infoTable}>
                        <div style={s.infoRow}><span style={s.infoLabel}>№ удостоверения</span><span style={{ ...s.infoValue, fontFamily: 'monospace' }}>{athlete.certNo || '-'}</span></div>
                        <div style={s.infoRow}><span style={s.infoLabel}>Дата присвоения</span><span style={s.infoValue}>{athlete.certDate ? new Date(athlete.certDate).toLocaleDateString('ru-RU') : '-'}</span></div>
                        <div style={{ ...s.infoRow, borderBottom: 'none' }}><span style={s.infoLabel}>Звание / разряд</span><span style={s.infoValue}>{athlete.rank}</span></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const s = {
    backLink: { display: 'inline-block', color: '#1B3A6B', fontSize: 13, marginBottom: 20, textDecoration: 'none' },
    profileCard: {
        background: 'var(--theme-bg-card)', border: '1px solid var(--theme-border)', borderRadius: 16, overflow: 'hidden', marginBottom: 20,
    },
    profileHeader: {
        background: 'linear-gradient(135deg, #1C1C1E, #2C2C2E)', borderRadius: '16px 16px 0 0', padding: 24,
        display: 'flex', alignItems: 'center', gap: 20,
    },
    profileAvatar: {
        width: 60, height: 60, borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 20, fontWeight: 500, flexShrink: 0,
    },
    profileInfo: { flex: 1 },
    profileName: { fontSize: 20, fontWeight: 500, color: '#fff', margin: 0, lineHeight: 1.2 },
    rankBadge: { display: 'inline-block', padding: '3px 10px', borderRadius: 8, fontSize: 11, fontWeight: 500 },
    profileMeta: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
    statsRow: { display: 'flex', gap: 8, padding: 20 },
    statCard: {
        flex: 1, background: '#F8F9FB', borderRadius: 10, padding: 12, textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
    },
    statNum: { fontSize: 20, fontWeight: 500 },
    statLabel: { fontSize: 11, color: 'var(--theme-text-secondary)', marginTop: 2 },
    block: {
        background: 'var(--theme-bg-card)', border: '1px solid var(--theme-border)', borderRadius: 14,
        padding: '20px 24px', marginBottom: 16,
    },
    blockTitle: { fontSize: 13, fontWeight: 500, color: 'var(--theme-text-main)', marginBottom: 10 },
    achieveItem: {
        display: 'flex', alignItems: 'center', gap: 10, padding: 10,
        background: '#F8F9FB', borderRadius: 10,
    },
    placeCircle: {
        width: 28, height: 28, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 700, flexShrink: 0,
    },
    achieveName: { fontSize: 13, fontWeight: 500, color: 'var(--theme-text-main)' },
    achieveYear: { fontSize: 11, color: 'var(--theme-text-secondary)' },
    infoTable: { display: 'flex', flexDirection: 'column' },
    infoRow: {
        display: 'flex', justifyContent: 'space-between', padding: '8px 0',
        borderBottom: '1px solid #F2F3F5', fontSize: 13,
    },
    infoLabel: { color: 'var(--theme-text-secondary)' },
    infoValue: { color: 'var(--theme-text-main)', fontWeight: 500, textAlign: 'right' },
}
