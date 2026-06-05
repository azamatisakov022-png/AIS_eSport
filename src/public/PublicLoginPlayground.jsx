import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { TbRun, TbStopwatch, TbClipboardList, TbId, TbSettings, TbBuilding, TbShieldCheck } from 'react-icons/tb'
import './loginPlayground.css'

/* ═══════════════════════════════════════════════
   PLAYGROUND for login page improvements.
   Route: /public/login-playground
   Lets you toggle 7 form/page improvements and
   compare 10 role-card animation variants live.
   ═══════════════════════════════════════════════ */

const ROLES = [
    { key: 'athlete', label: 'Спортсмен', desc: 'Звания, медосмотр', icon: TbRun, color: '#1B3A6B', glow: '27, 58, 107' },
    { key: 'coach', label: 'Тренер', desc: 'Ученики, расписание', icon: TbStopwatch, color: '#2B5EA7', glow: '43, 94, 167' },
    { key: 'judge', label: 'Судья', desc: 'Категория, лицензия', icon: TbClipboardList, color: '#4A90D9', glow: '74, 144, 217' },
    { key: 'org', label: 'Организация', desc: 'СДЮСШОР, ДЮСШ', icon: TbBuilding, color: '#6A5ACD', glow: '106, 90, 205' },
]

const ANIMATIONS = [
    { id: 1, name: '① Stagger entrance', desc: 'Карточки появляются волной слева-направо при загрузке', component: CardsStagger },
    { id: 2, name: '② Hover lift + colored glow', desc: 'translateY(-6px) + цветная подсветка снизу (свой цвет у каждой роли)', component: CardsLiftGlow },
    { id: 3, name: '③ 3D tilt', desc: 'Карточка наклоняется к курсору (Apple-style perspective)', component: CardsTilt },
    { id: 4, name: '④ Icon bounce', desc: 'Иконка пружинит scale 1 → 1.25 → 1 на hover', component: CardsIconBounce },
    { id: 5, name: '⑤ Icon morph (rotate)', desc: 'Иконка вращается / меняет позу на hover', component: CardsIconMorph },
    { id: 6, name: '⑥ Magnetic effect', desc: 'Карточка тянется за курсором когда он близко', component: CardsMagnetic },
    { id: 7, name: '⑦ Color sweep (shimmer)', desc: 'Диагональный блик пробегает по карточке на hover', component: CardsShimmer },
    { id: 8, name: '⑧ Ripple on click', desc: 'Material-style концентрическое кольцо появляется в точке клика', component: CardsRipple },
    { id: 9, name: '⑨ Icon → Title slide', desc: 'На hover иконка уезжает влево, появляется «Войти →»', component: CardsSlide },
    { id: 10, name: '⑩ Active breathing', desc: 'Активная карточка медленно «дышит» (scale 1.00 ↔ 1.03)', component: CardsBreathing },
]

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */
export default function PublicLoginPlayground() {
    const [features, setFeatures] = useState({
        glass: false,
        floatingLabels: false,
        progressOnButton: false,
        pillToggle: false,
        brandedEsi: false,
        animatedCounters: false,
        logoShimmer: false,
    })

    const toggle = (k) => setFeatures(p => ({ ...p, [k]: !p[k] }))

    return (
        <div className="pg-root">
            <header className="pg-header">
                <div>
                    <h1>Login Playground</h1>
                    <p>Live-превью всех улучшений. Включай тоглеры и сравнивай анимации ролей. Когда выберешь - скажи мне, и я применю в реальный <code>/public/login</code>.</p>
                </div>
                <Link to="/public/login" className="pg-back-link">← К текущему /login</Link>
            </header>

            {/* ───── PART 1: FORM TOGGLES + PREVIEW ───── */}
            <section className="pg-section">
                <h2>Часть 1 - улучшения формы</h2>
                <p className="pg-section-desc">Включай галочки слева - превью справа обновляется в реальном времени.</p>

                <div className="pg-form-layout">
                    <aside className="pg-toggles">
                        {[
                            { k: 'glass', label: 'Glassmorphism', desc: 'Полупрозрачная форма с blur поверх hero-фона' },
                            { k: 'floatingLabels', label: 'Floating labels', desc: 'Email/Пароль - лейбл поднимается при фокусе' },
                            { k: 'progressOnButton', label: 'Progress on button', desc: 'Полоска бежит по кнопке во время логина (нажми «Войти» для теста)' },
                            { k: 'pillToggle', label: 'Pill toggle', desc: 'Скользящий «pill» вместо квадратных табов' },
                            { k: 'brandedEsi', label: 'Branded ЭСИ', desc: 'Лого ГП КР рядом с «Войти через ЭСИ»' },
                            { k: 'animatedCounters', label: 'Animated counters', desc: '0→3847 при загрузке (нажми ↻ чтобы перезапустить)' },
                            { k: 'logoShimmer', label: 'Logo shimmer', desc: 'Раз в 3 сек по логотипу пробегает блик' },
                        ].map(({ k, label, desc }) => (
                            <label key={k} className={`pg-toggle${features[k] ? ' is-on' : ''}`}>
                                <input type="checkbox" checked={features[k]} onChange={() => toggle(k)} />
                                <span className="pg-toggle-box" aria-hidden="true" />
                                <div>
                                    <strong>{label}</strong>
                                    <small>{desc}</small>
                                </div>
                            </label>
                        ))}
                    </aside>

                    <div className="pg-preview-frame">
                        <LoginFormPreview features={features} />
                    </div>
                </div>
            </section>

            {/* ───── PART 2: ROLE CARD ANIMATIONS ───── */}
            <section className="pg-section">
                <h2>Часть 2 - 10 анимаций ролевых карточек</h2>
                <p className="pg-section-desc">Наводи мышкой, кликай - смотри как реагируют. Стрелки на ⑧ показывают точку клика. Все карточки активные.</p>

                <div className="pg-variants">
                    {ANIMATIONS.map(a => {
                        const Comp = a.component
                        return (
                            <article key={a.id} className="pg-variant">
                                <header>
                                    <h3>{a.name}</h3>
                                    <p>{a.desc}</p>
                                </header>
                                <div className="pg-variant-cards">
                                    <Comp />
                                </div>
                            </article>
                        )
                    })}
                </div>
            </section>

            <footer className="pg-footer">
                <p>Скажи мне номера вариантов которые понравились - например «Форма: glass + floating labels + pill. Анимации: ② + ④ + ⑦». Я применю выбранное в /public/login.</p>
            </footer>
        </div>
    )
}

/* ═══════════════════════════════════════════════
   PART 1 - Login form preview
   ═══════════════════════════════════════════════ */
function LoginFormPreview({ features }) {
    const [tab, setTab] = useState('citizen')
    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')
    const [emailFocus, setEmailFocus] = useState(false)
    const [pwdFocus, setPwdFocus] = useState(false)
    const [loading, setLoading] = useState(false)

    const onLogin = (e) => {
        e.preventDefault()
        if (!features.progressOnButton) return
        setLoading(true)
        setTimeout(() => setLoading(false), 2200)
    }

    return (
        <div className="pg-login-shell">
            {/* Left hero panel */}
            <div className="pg-login-left">
                <div className="pg-login-left-bg" />
                <div className="pg-login-left-overlay" />
                <div className="pg-login-left-content">
                    <div className={`pg-login-logo${features.logoShimmer ? ' has-shimmer' : ''}`}>
                        <span>АИС <b>eSport</b></span>
                    </div>
                    <h1>Цифровой спорт Кыргызстана</h1>
                    <p>Единая платформа управления спортом для ГАФКиС</p>
                    <CountersBlock animated={features.animatedCounters} />
                    <small>От первого шага до пьедестала - мы вместе</small>
                </div>
            </div>

            {/* Right form panel */}
            <div className={`pg-login-right${features.glass ? ' is-glass' : ''}`}>
                <h2>Вход в систему</h2>

                {/* Tab toggle */}
                {features.pillToggle ? (
                    <div className="pg-pill-toggle" data-active={tab}>
                        <button type="button" className={tab === 'citizen' ? 'is-active' : ''} onClick={() => setTab('citizen')}>Личный кабинет</button>
                        <button type="button" className={tab === 'staff' ? 'is-active' : ''} onClick={() => setTab('staff')}>Сотрудники</button>
                        <span className="pg-pill-toggle__slider" />
                    </div>
                ) : (
                    <div className="pg-tab-toggle">
                        <button type="button" className={tab === 'citizen' ? 'is-active' : ''} onClick={() => setTab('citizen')}>Личный кабинет</button>
                        <button type="button" className={tab === 'staff' ? 'is-active' : ''} onClick={() => setTab('staff')}>Сотрудники</button>
                    </div>
                )}

                <form onSubmit={onLogin}>
                    {/* Email */}
                    {features.floatingLabels ? (
                        <div className={`pg-float-field${(emailFocus || email) ? ' is-active' : ''}`}>
                            <label>Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} onFocus={() => setEmailFocus(true)} onBlur={() => setEmailFocus(false)} />
                        </div>
                    ) : (
                        <div className="pg-static-field">
                            <label>Email</label>
                            <input type="email" placeholder="example@mail.kg" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                    )}

                    {/* Password */}
                    {features.floatingLabels ? (
                        <div className={`pg-float-field${(pwdFocus || pwd) ? ' is-active' : ''}`}>
                            <label>Пароль</label>
                            <input type="password" value={pwd} onChange={e => setPwd(e.target.value)} onFocus={() => setPwdFocus(true)} onBlur={() => setPwdFocus(false)} />
                        </div>
                    ) : (
                        <div className="pg-static-field">
                            <label>Пароль</label>
                            <input type="password" placeholder="Введите пароль" value={pwd} onChange={e => setPwd(e.target.value)} />
                        </div>
                    )}

                    <button type="submit" className={`pg-submit${loading ? ' is-loading' : ''}`} disabled={loading}>
                        {loading ? 'Проверка...' : 'Войти'}
                        {features.progressOnButton && <span className="pg-submit-progress" />}
                    </button>
                </form>

                <div className="pg-or">или</div>

                <button type="button" className={`pg-esi-btn${features.brandedEsi ? ' is-branded' : ''}`}>
                    {features.brandedEsi && (
                        <span className="pg-esi-logo" aria-hidden="true">
                            <TbShieldCheck size={18} />
                        </span>
                    )}
                    Войти через ЭСИ Түндүк
                </button>

                <p className="pg-signup">Нет аккаунта? <a href="#">Зарегистрироваться</a></p>
            </div>
        </div>
    )
}

function CountersBlock({ animated }) {
    const [values, setValues] = useState(animated ? [0, 0, 0] : [3847, 247, 186])
    const [seed, setSeed] = useState(0)

    useEffect(() => {
        if (!animated) {
            setValues([3847, 247, 186])
            return
        }
        const targets = [3847, 247, 186]
        const start = performance.now()
        const duration = 1600
        let raf
        const step = (now) => {
            const p = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            setValues(targets.map(t => Math.round(eased * t)))
            if (p < 1) raf = requestAnimationFrame(step)
        }
        raf = requestAnimationFrame(step)
        return () => cancelAnimationFrame(raf)
    }, [animated, seed])

    return (
        <div className="pg-counters">
            <div><b>{values[0].toLocaleString('ru-RU')}</b><span>Спортсменов</span></div>
            <div><b>{values[1].toLocaleString('ru-RU')}</b><span>Тренеров</span></div>
            <div><b>{values[2].toLocaleString('ru-RU')}</b><span>Судей</span></div>
            {animated && <button type="button" className="pg-counters-restart" onClick={() => setSeed(s => s + 1)} title="Перезапустить">↻</button>}
        </div>
    )
}

/* ═══════════════════════════════════════════════
   PART 2 - Role card animation variants
   Each component renders the same 4 roles but
   applies its specific animation style.
   ═══════════════════════════════════════════════ */
function BaseCard({ role, className = '', style = {}, onClick, children }) {
    const Icon = role.icon
    return (
        <button type="button" className={`pg-role ${className}`} style={style} onClick={onClick}>
            <span className="pg-role__icon" style={{ background: role.color }}>
                <Icon size={20} color="#fff" />
            </span>
            <div className="pg-role__text">
                <strong>{role.label}</strong>
                <small>{role.desc}</small>
            </div>
            {children}
        </button>
    )
}

/* ① Stagger entrance */
function CardsStagger() {
    const [key, setKey] = useState(0)
    return (
        <>
            <div className="pg-grid" key={key}>
                {ROLES.map((r, i) => (
                    <BaseCard key={r.key} role={r} className="pg-anim-stagger" style={{ animationDelay: `${i * 90}ms` }} />
                ))}
            </div>
            <button type="button" className="pg-replay" onClick={() => setKey(k => k + 1)}>↻ Replay</button>
        </>
    )
}

/* ② Hover lift + colored glow */
function CardsLiftGlow() {
    return (
        <div className="pg-grid">
            {ROLES.map(r => (
                <BaseCard key={r.key} role={r} className="pg-anim-liftglow" style={{ '--glow': r.glow }} />
            ))}
        </div>
    )
}

/* ③ 3D tilt */
function CardsTilt() {
    const onMove = (e) => {
        const el = e.currentTarget
        const rect = el.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        el.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(4px)`
    }
    const onLeave = (e) => {
        e.currentTarget.style.transform = ''
    }
    return (
        <div className="pg-grid">
            {ROLES.map(r => (
                <BaseCard key={r.key} role={r} className="pg-anim-tilt"
                    onMouseMove={onMove} onMouseLeave={onLeave}
                />
            ))}
        </div>
    )
}
// Wrap BaseCard to pass mouse handlers (since BaseCard's props don't expose them by default)
function TiltCard({ role }) {
    const ref = useRef(null)
    const onMove = (e) => {
        const el = ref.current; if (!el) return
        const rect = el.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        el.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(4px)`
    }
    const onLeave = () => { if (ref.current) ref.current.style.transform = '' }
    const Icon = role.icon
    return (
        <button ref={ref} type="button" className="pg-role pg-anim-tilt"
            onMouseMove={onMove} onMouseLeave={onLeave}>
            <span className="pg-role__icon" style={{ background: role.color }}><Icon size={20} color="#fff" /></span>
            <div className="pg-role__text"><strong>{role.label}</strong><small>{role.desc}</small></div>
        </button>
    )
}
// Override the simple version with the ref-based one
function CardsTiltV2() {
    return <div className="pg-grid">{ROLES.map(r => <TiltCard key={r.key} role={r} />)}</div>
}

/* ④ Icon bounce */
function CardsIconBounce() {
    return (
        <div className="pg-grid">
            {ROLES.map(r => (
                <BaseCard key={r.key} role={r} className="pg-anim-bounce" />
            ))}
        </div>
    )
}

/* ⑤ Icon morph (rotate) */
function CardsIconMorph() {
    return (
        <div className="pg-grid">
            {ROLES.map(r => (
                <BaseCard key={r.key} role={r} className="pg-anim-morph" />
            ))}
        </div>
    )
}

/* ⑥ Magnetic */
function MagneticCard({ role }) {
    const ref = useRef(null)
    const onMove = (e) => {
        const el = ref.current; if (!el) return
        const rect = el.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) * 0.18
        const y = (e.clientY - rect.top - rect.height / 2) * 0.18
        el.style.transform = `translate(${x}px, ${y}px)`
    }
    const onLeave = () => { if (ref.current) ref.current.style.transform = '' }
    const Icon = role.icon
    return (
        <button ref={ref} type="button" className="pg-role pg-anim-magnetic"
            onMouseMove={onMove} onMouseLeave={onLeave}>
            <span className="pg-role__icon" style={{ background: role.color }}><Icon size={20} color="#fff" /></span>
            <div className="pg-role__text"><strong>{role.label}</strong><small>{role.desc}</small></div>
        </button>
    )
}
function CardsMagnetic() {
    return <div className="pg-grid">{ROLES.map(r => <MagneticCard key={r.key} role={r} />)}</div>
}

/* ⑦ Color sweep (shimmer) */
function CardsShimmer() {
    return (
        <div className="pg-grid">
            {ROLES.map(r => (
                <BaseCard key={r.key} role={r} className="pg-anim-shimmer" />
            ))}
        </div>
    )
}

/* ⑧ Ripple on click */
function RippleCard({ role }) {
    const [ripples, setRipples] = useState([])
    const onClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const id = Date.now() + Math.random()
        setRipples(rs => [...rs, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
        setTimeout(() => setRipples(rs => rs.filter(r => r.id !== id)), 700)
    }
    const Icon = role.icon
    return (
        <button type="button" className="pg-role pg-anim-ripple" onClick={onClick}>
            <span className="pg-role__icon" style={{ background: role.color }}><Icon size={20} color="#fff" /></span>
            <div className="pg-role__text"><strong>{role.label}</strong><small>{role.desc}</small></div>
            {ripples.map(r => (
                <span key={r.id} className="pg-ripple-wave" style={{ left: r.x, top: r.y }} />
            ))}
        </button>
    )
}
function CardsRipple() {
    return <div className="pg-grid">{ROLES.map(r => <RippleCard key={r.key} role={r} />)}</div>
}

/* ⑨ Icon → Title slide */
function CardsSlide() {
    return (
        <div className="pg-grid">
            {ROLES.map(r => {
                const Icon = r.icon
                return (
                    <button key={r.key} type="button" className="pg-role pg-anim-slide">
                        <span className="pg-role__icon" style={{ background: r.color }}><Icon size={20} color="#fff" /></span>
                        <div className="pg-role__text"><strong>{r.label}</strong><small>{r.desc}</small></div>
                        <span className="pg-slide-cta">Войти →</span>
                    </button>
                )
            })}
        </div>
    )
}

/* ⑩ Breathing on the first/active card */
function CardsBreathing() {
    const [active, setActive] = useState(0)
    return (
        <div className="pg-grid">
            {ROLES.map((r, i) => (
                <BaseCard key={r.key} role={r}
                    className={`pg-anim-breath${i === active ? ' is-active' : ''}`}
                    onClick={() => setActive(i)} />
            ))}
        </div>
    )
}

/* Replace CardsTilt with the ref-based working version */
ANIMATIONS[2].component = CardsTiltV2
