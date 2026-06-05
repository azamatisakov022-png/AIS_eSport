import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import PublicHero from './components/PublicHero'
import './pages/publicPages.css'

const SPORTS = ['Дзюдо', 'Бокс', 'Борьба', 'Тхэквондо', 'Каратэ', 'Лёгкая атлетика', 'Плавание', 'Футбол', 'Волейбол', 'Гимнастика', 'Тяжёлая атлетика', 'Другой']

const CATEGORIES = [
    { value: 'III', label: 'III категория' },
    { value: 'II', label: 'II категория' },
    { value: 'I', label: 'I категория' },
    { value: 'national', label: 'Национальная категория' },
    { value: 'intl', label: 'Международная категория' },
]

const DOCS = [
    { key: 'cert', label: 'Копия судейского удостоверения' },
    { key: 'protocols', label: 'Протоколы обслуженных мероприятий' },
    { key: 'petition', label: 'Представление от федерации' },
    { key: 'passport', label: 'Копия паспорта' },
]

function genNo() {
    const d = new Date()
    const p = (n) => String(n).padStart(2, '0')
    return `JD-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
}

export default function PublicJudgeCategory() {
    const [form, setForm] = useState({ fio: '', inn: '', phone: '', email: '', sport: '', current: '', requested: '', events: '', experience: '' })
    const [docs, setDocs] = useState({})
    const [confirm, setConfirm] = useState(false)
    const [submitted, setSubmitted] = useState(null)
    const fileRefs = useRef({})

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }))
    const handleFile = (key, file) => { if (file) setDocs(p => ({ ...p, [key]: file })) }

    const required = form.fio && form.inn && form.phone && form.email && form.sport && form.requested
    const allDocs = DOCS.every(d => docs[d.key])
    const canSubmit = required && allDocs && confirm

    const submit = () => {
        if (!canSubmit) return
        setSubmitted({ no: genNo(), date: new Date().toLocaleDateString('ru-RU'),
            cat: CATEGORIES.find(c => c.value === form.requested)?.label || form.requested })
    }

    if (submitted) {
        return (
            <div className="pub-section">
                <div className="pub-container pp-wrap" style={{ paddingTop: 32 }}>
                    <div className="pp-success" style={{ margin: '0 auto' }}>
                        <strong>📥 Заявление принято · № {submitted.no}</strong>
                        Заявление на присвоение «{submitted.cat}» зарегистрировано {submitted.date}. Срок рассмотрения аттестационной комиссией - 10 рабочих дней. Статус можно отследить в разделе{' '}
                        <Link to="/public/services" style={{ color: '#1e8e3e', fontWeight: 600 }}>Госуслуги</Link>.
                        <div style={{ marginTop: 16 }}>
                            <Link to="/public/cabinet" className="pp-row__action pp-row__action--primary" style={{ display: 'inline-block' }}>Вернуться в кабинет</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="pub-section">
            <PublicHero title="Заявление на присвоение судейской категории" description="Онлайн-подача заявления на присвоение или повышение судейской категории. Рассмотрение - аттестационная комиссия ГАФКиС." variant="indigo" layoutMode="abstract" />

            <div className="pub-container pp-wrap">
                <div className="pp-cols">
                    <div>
                        <form className="pp-form" style={{ maxWidth: 'none' }} onSubmit={e => { e.preventDefault(); submit() }}>
                            <h2 className="pp-block__title" style={{ marginTop: 0 }}>Данные заявителя</h2>
                            <div className="pp-field"><label>ФИО *</label><input value={form.fio} onChange={e => set('fio', e.target.value)} placeholder="Фамилия Имя Отчество" /></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="pp-field"><label>ПИН (ИНН) *</label><input value={form.inn} onChange={e => set('inn', e.target.value)} placeholder="14 цифр" /></div>
                                <div className="pp-field"><label>Вид спорта *</label><select value={form.sport} onChange={e => set('sport', e.target.value)}><option value="">Выберите</option>{SPORTS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                                <div className="pp-field"><label>Телефон *</label><input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+996 ..." /></div>
                                <div className="pp-field"><label>Эл. почта *</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} /></div>
                            </div>

                            <h2 className="pp-block__title">Категория</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="pp-field"><label>Текущая категория</label><select value={form.current} onChange={e => set('current', e.target.value)}><option value="">Нет / не указана</option>{CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
                                <div className="pp-field"><label>Запрашиваемая категория *</label><select value={form.requested} onChange={e => set('requested', e.target.value)}><option value="">Выберите</option>{CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
                                <div className="pp-field"><label>Обслужено мероприятий</label><input type="number" min="0" value={form.events} onChange={e => set('events', e.target.value)} placeholder="напр. 24" /></div>
                                <div className="pp-field"><label>Стаж судейства (лет)</label><input type="number" min="0" value={form.experience} onChange={e => set('experience', e.target.value)} placeholder="напр. 5" /></div>
                            </div>

                            <h2 className="pp-block__title">Документы</h2>
                            {DOCS.map(d => (
                                <div className="pp-field" key={d.key}>
                                    <label>{d.label} *</label>
                                    {docs[d.key] ? (
                                        <div className="pp-badge pp-badge--green" style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                                            ✓ {docs[d.key].name}
                                            <span style={{ cursor: 'pointer' }} onClick={() => setDocs(p => ({ ...p, [d.key]: null }))}>✕</span>
                                        </div>
                                    ) : (
                                        <button type="button" className="pp-row__action" onClick={() => fileRefs.current[d.key]?.click()}>📎 Прикрепить файл</button>
                                    )}
                                    <input ref={el => fileRefs.current[d.key] = el} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={e => handleFile(d.key, e.target.files[0])} />
                                </div>
                            ))}

                            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, margin: '8px 0 18px', cursor: 'pointer' }}>
                                <input type="checkbox" checked={confirm} onChange={e => setConfirm(e.target.checked)} style={{ marginTop: 3 }} />
                                <span>Подтверждаю достоверность указанных данных и согласие на обработку персональных данных.</span>
                            </label>

                            <button type="submit" className="pp-form__submit" disabled={!canSubmit} style={{ opacity: canSubmit ? 1 : 0.4, cursor: canSubmit ? 'pointer' : 'not-allowed' }}>
                                Подать заявление
                            </button>
                        </form>
                    </div>

                    <aside>
                        <div className="pp-sidebar-card">
                            <h3 className="pp-sidebar-card__title">Условия</h3>
                            <div className="pp-contact" style={{ flexDirection: 'column', gap: 4 }}><span className="pp-contact__label">Орган</span><span className="pp-contact__val">Аттестационная комиссия ГАФКиС</span></div>
                            <div className="pp-contact" style={{ flexDirection: 'column', gap: 4 }}><span className="pp-contact__label">Срок рассмотрения</span><span className="pp-contact__val">10 рабочих дней</span></div>
                            <div className="pp-contact" style={{ flexDirection: 'column', gap: 4 }}><span className="pp-contact__label">Стоимость</span><span className="pp-contact__val">Бесплатно</span></div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
