import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useRole } from '../context/RoleContext'
import { TbRun, TbStopwatch, TbClipboardList, TbId, TbSettings } from 'react-icons/tb'

/* ═══════════════════════════════════════════════
   DEMO ROLE CARDS
   ═══════════════════════════════════════════════ */
const ROLE_ICONS = {
    athlete: <TbRun size={22} color="#fff" />,
    coach: <TbStopwatch size={22} color="#fff" />,
    judge: <TbClipboardList size={22} color="#fff" />,
    employee: <TbId size={22} color="#fff" />,
    admin: <TbSettings size={22} color="#fff" />,
    superadmin: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
    org: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="8" width="16" height="14" rx="2" /><path d="M12 2L4 8h16z"/><rect x="9" y="14" width="6" height="8" rx="1"/></svg>,
}

const ROLE_GROUPS = [
    {
        titleKey: 'public.loginTitle',
        roles: [
            { key: 'athlete', labelKey: 'public.loginAsAthlete', subKey: 'public.loginAthleteDesc', to: '/cabinet',
              iconBg: '#1B3A6B', glow: '27, 58, 107' },
            { key: 'coach', labelKey: 'public.loginAsCoach', subKey: 'public.loginCoachDesc', to: '/cabinet',
              iconBg: '#2B5EA7', glow: '43, 94, 167' },
            { key: 'judge', labelKey: 'public.loginAsJudge', subKey: 'public.loginJudgeDesc', to: '/cabinet',
              iconBg: '#4A90D9', glow: '74, 144, 217' },
            { key: 'org', labelKey: 'Организация', subKey: 'СДЮСШОР, ДЮСШ', to: '/cabinet',
              iconBg: '#6A5ACD', glow: '106, 90, 205' },
        ],
    },
    {
        titleKey: 'public.loginStaffTab',
        roles: [
            { key: 'employee', labelKey: 'public.loginAsEmployee', subKey: 'public.loginEmployeeDesc', to: '/dashboard',
              iconBg: '#1B3A6B', glow: '27, 58, 107' },
            { key: 'admin', labelKey: 'public.loginAsAdmin', subKey: 'public.loginAdminDesc', to: '/dashboard',
              iconBg: '#2B5EA7', glow: '43, 94, 167' },
            { key: 'superadmin', labelKey: 'public.loginAsSuperadmin', subKey: 'public.loginSuperadminDesc', to: '/dashboard',
              iconBg: '#0F2B52', glow: '15, 43, 82' },
        ],
    },
]

/* ── Counted-up number hook (0 → target with easing) ── */
function useCountUp(target, duration = 1600) {
    const [value, setValue] = useState(0)
    useEffect(() => {
        const start = performance.now()
        let raf
        const step = (now) => {
            const p = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            setValue(Math.round(eased * target))
            if (p < 1) raf = requestAnimationFrame(step)
        }
        raf = requestAnimationFrame(step)
        return () => cancelAnimationFrame(raf)
    }, [target, duration])
    return value
}

/* ── Floating-label input ── */
function FloatField({ type = 'text', label, value, onChange, autoComplete }) {
    const [focused, setFocused] = useState(false)
    const active = focused || (value && value.length > 0)
    return (
        <div className={`login-field${active ? ' is-active' : ''}`}>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                autoComplete={autoComplete}
                className="login-field__input"
            />
            <label className="login-field__label">{label}</label>
        </div>
    )
}

export default function PublicLogin() {
    const { t } = useTranslation()
    const [tab, setTab] = useState('citizen') // 'citizen' | 'staff'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [staffLogin, setStaffLogin] = useState('')
    const [staffPassword, setStaffPassword] = useState('')
    const { setCurrentRole } = useRole()
    const navigate = useNavigate()

    const handleDemoLogin = (role) => {
        setCurrentRole(role.key)
        navigate(role.to, { state: { role: role.key } })
    }

    /* Animated counters: 0 → target on first render */
    const athletesCount = useCountUp(3847)
    const coachesCount = useCountUp(247)
    const judgesCount = useCountUp(186)

    const handleCitizenSubmit = (e) => {
        e.preventDefault()
        alert(t('public.loginCitizenAlert'))
    }

    const handleStaffSubmit = (e) => {
        e.preventDefault()
        alert(t('public.loginStaffAlert'))
    }

    return (
        <div style={s.page}>
            {/* ═══ LEFT - BRAND PANEL ═══ */}
            <div style={s.left}>
                {/* Decorative circles */}
                <div style={s.circle1} />
                <div style={s.circle2} />
                <div style={s.circle3} />

                {/* Logo with shimmer effect */}
                <div className="login-logo" style={s.leftLogo}>
                    <img src="/logo.png" alt="ГАФКиС" style={s.leftLogoImg} />
                    <span style={s.leftLogoText}>АИС eSport</span>
                </div>

                {/* Hero text */}
                <div style={s.leftHero}>
                    <h1 style={s.leftTitle}>{t('public.loginDigitalSport')}<br />{t('public.loginDigitalSportCountry')}</h1>
                    <p style={s.leftSub}>{t('public.loginPlatformDesc')}<br />{t('public.loginPlatformDescSub')}</p>
                </div>

                {/* Stats row (animated counters 0 → target) */}
                <div style={s.statsRow}>
                    <div style={s.statItem}>
                        <div style={s.statValue}>{athletesCount.toLocaleString('ru-RU')}</div>
                        <div style={s.statLabel}>{t('public.counterAthletes')}</div>
                    </div>
                    <div style={s.statDivider} />
                    <div style={s.statItem}>
                        <div style={s.statValue}>{coachesCount.toLocaleString('ru-RU')}</div>
                        <div style={s.statLabel}>{t('public.counterCoaches')}</div>
                    </div>
                    <div style={s.statDivider} />
                    <div style={s.statItem}>
                        <div style={s.statValue}>{judgesCount.toLocaleString('ru-RU')}</div>
                        <div style={s.statLabel}>{t('public.counterJudges')}</div>
                    </div>
                </div>

                {/* Slogan */}
                <p style={s.slogan}>{t('public.loginSlogan')}</p>
            </div>

            {/* ═══ RIGHT - FORM PANEL ═══ */}
            <div style={s.right}>
                {/* Back link */}
                <Link to="/public" style={s.backLink}>{t('public.backToSite')}</Link>

                {/* Form container */}
                <div style={s.formContainer}>
                    <h2 style={s.formTitle}>{t('public.loginFormTitle')}</h2>

                    {/* ── Pill-toggle tabs (sliding indicator) ── */}
                    <div className="login-tabs" data-active={tab}>
                        <button
                            type="button"
                            className={`login-tab${tab === 'citizen' ? ' is-active' : ''}`}
                            onClick={() => setTab('citizen')}
                            aria-pressed={tab === 'citizen'}
                        >
                            Личный кабинет
                        </button>
                        <button
                            type="button"
                            className={`login-tab${tab === 'staff' ? ' is-active' : ''}`}
                            onClick={() => setTab('staff')}
                            aria-pressed={tab === 'staff'}
                        >
                            Сотрудники
                        </button>
                        <span className="login-tabs__slider" aria-hidden="true" />
                    </div>

                    {/* ── CITIZEN TAB ── */}
                    {tab === 'citizen' && (
                        <form onSubmit={handleCitizenSubmit} style={s.form}>
                            <FloatField type="email" label="Email" value={email} onChange={setEmail} autoComplete="email" />
                            <FloatField type="password" label="Пароль" value={password} onChange={setPassword} autoComplete="current-password" />
                            <button type="submit" style={s.btnPrimary}>Войти</button>

                            <div style={s.divider}>
                                <span style={s.dividerLine} />
                                <span style={s.dividerText}>или</span>
                                <span style={s.dividerLine} />
                            </div>

                            <button
                                type="button"
                                style={s.btnTunduk}
                                onClick={() => alert('Интеграция с СМЭВ «Түндүк» ЕСИ - в разработке')}
                            >
                                Войти через СМЭВ Түндүк ЕСИ
                            </button>

                            <p style={s.registerRow}>
                                Нет аккаунта?{' '}
                                <Link to="/public/register" style={s.registerLink}>Зарегистрироваться</Link>
                            </p>
                        </form>
                    )}

                    {/* ── STAFF TAB ── */}
                    {tab === 'staff' && (
                        <form onSubmit={handleStaffSubmit} style={s.form}>
                            <FloatField type="text" label="Логин" value={staffLogin} onChange={setStaffLogin} autoComplete="username" />
                            <FloatField type="password" label="Пароль" value={staffPassword} onChange={setStaffPassword} autoComplete="current-password" />
                            <button type="submit" style={s.btnPrimary}>Войти</button>

                            <div style={s.divider}>
                                <span style={s.dividerLine} />
                                <span style={s.dividerText}>или</span>
                                <span style={s.dividerLine} />
                            </div>

                            <button
                                type="button"
                                style={s.btnTunduk}
                                onClick={() => alert('Интеграция с СМЭВ «Түндүк» ЕСИ - в разработке')}
                            >
                                Войти через СМЭВ Түндүк ЕСИ
                            </button>

                            <p style={s.registerRow}>
                                Нет доступа?{' '}
                                <a href="mailto:admin@gafkis.kg?subject=Запрос доступа сотрудника" style={s.registerLink}>Запросить доступ у администратора</a>
                            </p>
                        </form>
                    )}

                    {/* ── DEMO ROLE CARDS ── */}
                    <div style={s.demoDivider}>
                        <span style={s.dividerLine} />
                        <span style={s.dividerText}>Демо-вход - выберите роль</span>
                        <span style={s.dividerLine} />
                    </div>

                    {ROLE_GROUPS.map((group, gi) => (
                        <div key={gi} style={{ marginBottom: gi === 0 ? 14 : 0 }}>
                            <div style={s.groupTitle}>{t(group.titleKey)}</div>
                            <div style={s.roleGrid} className="login-role-grid">
                                {group.roles.map(r => (
                                    <button
                                        key={r.key}
                                        type="button"
                                        className="login-role-card"
                                        style={{ ...s.roleCard, '--role-glow': r.glow }}
                                        onClick={() => handleDemoLogin(r)}
                                    >
                                        <div style={{ ...s.roleIcon, background: r.iconBg }}>
                                            {ROLE_ICONS[r.key]}
                                        </div>
                                        <div style={s.roleName}>{t(r.labelKey)}</div>
                                        <div style={s.roleSub}>{t(r.subKey)}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Footer text */}
                    <div style={s.footerText}>
                        © 2026 ГАФКиС - Государственное агентство физической культуры и спорта
                    </div>
                </div>
            </div>

            {/* ── Responsive + a11y/animation styles ── */}
            <style>{`
                /* Pill-toggle tabs with sliding background */
                .login-tabs {
                    position: relative;
                    display: flex;
                    padding: 4px;
                    background: var(--theme-bg-panel, #f0f2f5);
                    border-radius: 10px;
                    margin-bottom: 16px;
                    overflow: hidden;
                }
                .login-tab {
                    flex: 1;
                    padding: 9px 16px;
                    border: none;
                    background: transparent;
                    font: inherit;
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--theme-text-secondary, #6e6e73);
                    cursor: pointer;
                    outline: none;
                    position: relative;
                    z-index: 1;
                    border-radius: 7px;
                    transition: color 0.25s ease;
                }
                .login-tab.is-active { color: #fff; }
                .login-tab:focus-visible {
                    outline: 2px solid #2B5EA7;
                    outline-offset: 2px;
                }
                .login-tabs__slider {
                    position: absolute;
                    top: 4px;
                    bottom: 4px;
                    left: 4px;
                    width: calc(50% - 4px);
                    background: linear-gradient(135deg, #1B3A6B 0%, #2B5EA7 100%);
                    border-radius: 7px;
                    box-shadow: 0 2px 6px rgba(27, 58, 107, 0.3);
                    transition: transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1);
                    pointer-events: none;
                }
                .login-tabs[data-active="staff"] .login-tabs__slider {
                    transform: translateX(100%);
                }

                /* Floating-label input */
                .login-field {
                    position: relative;
                }
                .login-field__input {
                    width: 100%;
                    padding: 14px 14px 14px;
                    border: 1px solid #d2d2d7;
                    border-radius: 8px;
                    background: var(--theme-bg-card, #fff);
                    color: #1a1a1a;
                    font-size: 14px;
                    font-family: inherit;
                    outline: none;
                    transition: border-color 0.2s;
                    box-sizing: border-box;
                }
                .login-field__input:focus {
                    border-color: #2B5EA7;
                }
                .login-field__label {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: var(--theme-bg-card, #fff);
                    padding: 0 4px;
                    color: #86868b;
                    font-size: 14px;
                    pointer-events: none;
                    transition: top 0.18s ease, font-size 0.18s ease, color 0.18s ease;
                }
                .login-field.is-active .login-field__label {
                    top: 0;
                    font-size: 11px;
                    color: #2B5EA7;
                    font-weight: 700;
                }

                /* Hover lift + colored glow on role cards (each role brings --role-glow) */
                .login-role-card {
                    background: #F0F4FA;
                    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
                                box-shadow 0.25s ease,
                                border-color 0.25s ease;
                    will-change: transform;
                }
                .login-role-card:hover {
                    transform: translateY(-6px);
                    box-shadow:
                        0 12px 28px rgba(var(--role-glow, 27, 58, 107), 0.35),
                        0 4px 8px rgba(var(--role-glow, 27, 58, 107), 0.15);
                    border-color: rgba(var(--role-glow, 27, 58, 107), 0.4);
                }
                .login-role-card:focus-visible {
                    outline: 3px solid rgba(var(--role-glow, 27, 58, 107), 0.5);
                    outline-offset: 2px;
                }

                /* Responsive */
                @media (max-width: 900px) {
                    .login-page { flex-direction: column !important; }
                    .login-left {
                        width: 100% !important;
                        min-height: auto !important;
                        height: auto !important;
                        padding: 32px 24px 24px !important;
                    }
                    .login-left .left-hero { display: none !important; }
                    .login-left .stats-row { display: none !important; }
                    .login-right { width: 100% !important; height: auto !important; min-height: auto !important; }
                }
                @media (max-width: 500px) {
                    .login-role-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                }
            `}</style>
        </div>
    )
}

/* ═══════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════ */
const s = {
    /* ── Page (100vh, two columns) ── */
    page: {
        display: 'flex', height: '100vh', overflow: 'hidden',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    },

    /* ── Left brand panel ── */
    left: {
        width: '45%', minWidth: 380,
        backgroundImage: 'linear-gradient(160deg, rgba(27,58,107,0.75) 0%, rgba(43,94,167,0.6) 50%, rgba(59,125,216,0.65) 100%), url(/login-collage.png)',
        backgroundSize: 'cover, cover',
        backgroundPosition: 'center, center',
        backgroundRepeat: 'no-repeat, no-repeat',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'flex-start',
        padding: '48px 48px',
        position: 'relative', overflow: 'hidden',
    },

    /* Decorative circles */
    circle1: {
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'rgba(255,255,255,0.03)',
        top: -80, right: -100,
    },
    circle2: {
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: 'rgba(255,255,255,0.04)',
        bottom: -60, left: -80,
    },
    circle3: {
        position: 'absolute', width: 200, height: 200, borderRadius: '50%',
        background: 'rgba(255,255,255,0.03)',
        top: '40%', right: '20%',
    },

    /* Logo */
    leftLogo: {
        display: 'flex', alignItems: 'center', gap: 12,
        marginBottom: 48, position: 'relative', zIndex: 1,
    },
    leftLogoImg: {
        width: 72, height: 72, borderRadius: '50%', objectFit: 'contain',
        background: '#fff', padding: 6,
        boxShadow: '0 3px 16px rgba(0,0,0,0.2)',
    },
    leftLogoText: {
        fontSize: 19, fontWeight: 700, color: 'rgba(255,255,255,0.85)',
        letterSpacing: 0.5,
    },

    /* Hero text */
    leftHero: { position: 'relative', zIndex: 1, marginBottom: 48 },
    leftTitle: {
        fontSize: 28, fontWeight: 500, color: '#fff',
        margin: '0 0 14px', lineHeight: 1.35, letterSpacing: -0.3,
    },
    leftSub: {
        fontSize: 15, color: 'rgba(255,255,255,0.7)',
        margin: 0, lineHeight: 1.6,
    },

    /* Stats row */
    statsRow: {
        display: 'flex', alignItems: 'center', gap: 24,
        position: 'relative', zIndex: 1,
    },
    statItem: { textAlign: 'center' },
    statValue: { fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 2 },
    statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.55)' },
    statDivider: {
        width: 1, height: 36,
        background: 'rgba(255,255,255,0.2)',
    },

    /* Slogan */
    slogan: {
        fontSize: 18, fontWeight: 300, color: 'rgba(255,255,255,0.9)',
        lineHeight: 1.6, margin: '28px 0 0', position: 'relative', zIndex: 1,
        textShadow: '0 1px 8px rgba(0,0,0,0.3)',
        fontStyle: 'italic',
    },

    /* ── Right form panel ── */
    right: {
        flex: 1, background: '#FAFAFA',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-start',
        padding: '24px 36px 20px',
        position: 'relative',
        overflowY: 'auto',
    },

    /* Back link */
    backLink: {
        position: 'absolute', top: 24, right: 32,
        fontSize: 13, fontWeight: 500, color: '#6e6e73',
        textDecoration: 'none',
    },

    /* Form container */
    formContainer: {
        width: '100%', maxWidth: 480,
    },
    formTitle: {
        fontSize: 20, fontWeight: 700, color: '#1a1a1a',
        margin: '0 0 14px', textAlign: 'center',
    },

    /* ── Segmented control (iOS style) ── */
    tabs: {
        display: 'flex', gap: 0,
        background: 'var(--theme-bg-panel)',
        borderRadius: 10, padding: 3,
        marginBottom: 16,
    },
    tab: {
        flex: 1, padding: '9px 16px',
        borderRadius: 8, border: 'none',
        background: 'transparent',
        fontSize: 13, fontWeight: 500, color: 'var(--theme-text-secondary)',
        fontFamily: 'inherit', cursor: 'pointer',
        transition: 'all 0.2s',
        outline: 'none',
    },
    tabActive: {
        background: 'var(--theme-bg-card)', color: 'var(--theme-text-main)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    },

    /* ── Form ── */
    form: { display: 'flex', flexDirection: 'column', gap: 10 },
    fieldGroup: { display: 'flex', flexDirection: 'column', gap: 5 },
    label: { fontSize: 12, fontWeight: 600, color: '#6e6e73' },
    input: {
        padding: '11px 14px',
        border: '1px solid #d2d2d7',
        borderRadius: 8,
        fontSize: 14, fontFamily: 'inherit',
        background: 'var(--theme-bg-card)', color: '#1a1a1a',
        outline: 'none',
        transition: 'border-color 0.2s',
    },

    /* Buttons */
    btnPrimary: {
        padding: '12px 20px',
        background: 'linear-gradient(135deg, #1B3A6B 0%, #2B5EA7 100%)',
        color: '#fff',
        border: 'none', borderRadius: 10,
        fontSize: 14, fontWeight: 700,
        fontFamily: 'inherit', cursor: 'pointer',
        marginTop: 4, transition: 'opacity 0.2s',
    },
    btnTunduk: {
        padding: '12px 20px',
        background: 'var(--theme-bg-card)', color: '#1a1a1a',
        border: '1px solid #D2D2D7', borderRadius: 10,
        fontSize: 13, fontWeight: 600,
        fontFamily: 'inherit', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        transition: 'all 0.2s',
    },
    registerRow: {
        textAlign: 'center', fontSize: 13, color: 'var(--theme-text-secondary)',
        margin: '12px 0 0',
    },
    registerLink: {
        color: '#2563EB', textDecoration: 'none', fontWeight: 600,
    },

    /* Dividers */
    divider: { display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' },
    demoDivider: { display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0 14px' },
    dividerLine: { flex: 1, height: 1, background: '#d2d2d7' },
    dividerText: { fontSize: 12, color: 'var(--theme-text-secondary)', fontWeight: 500, whiteSpace: 'nowrap' },

    /* ── Demo role cards ── */
    groupTitle: {
        fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase',
        letterSpacing: 0.8, marginBottom: 8,
    },
    roleGrid: {
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
    },
    roleCard: {
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '14px 12px', borderRadius: 12,
        border: '0.5px solid #DCE4F0',
        cursor: 'pointer',
        fontFamily: 'inherit', textAlign: 'center',
        transition: 'all 0.2s ease',
    },
    roleIcon: {
        width: 42, height: 42, borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, margin: '0 auto 8px',
    },
    roleName: {
        fontSize: 13, fontWeight: 500, color: '#1B3A6B',
    },
    roleSub: {
        fontSize: 11, marginTop: 2, color: '#5A7BA6',
    },

    /* Footer */
    footerText: {
        textAlign: 'center', fontSize: 11, color: '#b0b0b5',
        marginTop: 16, paddingBottom: 8,
    },
}
