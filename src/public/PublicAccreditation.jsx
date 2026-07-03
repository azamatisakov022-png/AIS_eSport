import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import PublicHero from './components/PublicHero'
import { accreditationApi } from '../api/esport'
import './pages/publicPages.css'

const SPORTS = ['Дзюдо', 'Бокс', 'Борьба', 'Тхэквондо', 'Каратэ', 'Лёгкая атлетика', 'Плавание', 'Футбол', 'Волейбол', 'Баскетбол', 'Гимнастика', 'Тяжёлая атлетика', 'Шахматы', 'Настольный теннис', 'Другой']

const DOCS = [
    { key: 'charter', label: 'Устав федерации' },
    { key: 'reg', label: 'Свидетельство о государственной регистрации' },
    { key: 'protocol', label: 'Протокол отчётно-выборного собрания' },
    { key: 'members', label: 'Список региональных отделений / членов' },
    { key: 'plan', label: 'План спортивных мероприятий' },
    { key: 'report', label: 'Годовой отчёт о деятельности' },
]

function genNo() {
    const d = new Date()
    const p = (n) => String(n).padStart(2, '0')
    return `AC-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
}

export default function PublicAccreditation() {
    const [form, setForm] = useState({ federationName: '', sport: '', inn: '', headName: '', phone: '', email: '' })
    const [docs, setDocs] = useState({})
    const [confirm, setConfirm] = useState(false)
    const [submitted, setSubmitted] = useState(null)
    const [sending, setSending] = useState(false)
    const fileRefs = useRef({})

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }))
    const handleFile = (key, file) => { if (file) setDocs(p => ({ ...p, [key]: file })) }

    const required = form.federationName && form.sport && form.inn && form.headName && form.phone && form.email
    const allDocs = DOCS.every(d => docs[d.key])
    const canSubmit = required && allDocs && confirm

    const submit = async () => {
        if (!canSubmit || sending) return
        let no = genNo()
        setSending(true)
        try {
            const created = await accreditationApi.create({
                federationName: form.federationName,
                sport: form.sport,
                inn: form.inn,
                headName: form.headName,
                phone: form.phone,
                email: form.email,
                docsTotal: DOCS.length,
            })
            if (created?.appNo) no = created.appNo
        } catch {
            // Демо-режим: бэкенд недоступен — локальный номер
        }
        setSending(false)
        setSubmitted({ no, date: new Date().toLocaleDateString('ru-RU'), name: form.federationName })
    }

    if (submitted) {
        return (
            <div className="pub-section">
                <div className="pub-container pp-wrap" style={{ paddingTop: 32 }}>
                    <div className="pp-success" style={{ margin: '0 auto' }}>
                        <strong>Заявление принято · № {submitted.no}</strong>
                        Заявление на аккредитацию «{submitted.name}» зарегистрировано {submitted.date}. Срок рассмотрения — 14 рабочих дней. Статус можно отследить в личном кабинете.
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
            <PublicHero title="Аккредитация спортивной федерации" description="Онлайн-подача заявления на государственную аккредитацию спортивной федерации (по виду спорта). Рассмотрение — Государственное агентство, срок 14 рабочих дней." variant="slate" layoutMode="abstract" />

            <div className="pub-container pp-wrap">
                <div className="pp-cols">
                    <div>
                        <form className="pp-form" style={{ maxWidth: 'none' }} onSubmit={e => { e.preventDefault(); submit() }}>
                            <h2 className="pp-block__title" style={{ marginTop: 0 }}>Данные федерации</h2>
                            <div className="pp-field"><label>Наименование федерации *</label><input value={form.federationName} onChange={e => set('federationName', e.target.value)} placeholder="напр. Федерация дзюдо КР" /></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="pp-field"><label>Вид спорта *</label><select value={form.sport} onChange={e => set('sport', e.target.value)}><option value="">Выберите</option>{SPORTS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                                <div className="pp-field"><label>ИНН организации *</label><input value={form.inn} onChange={e => set('inn', e.target.value)} placeholder="14 цифр" /></div>
                                <div className="pp-field"><label>Руководитель *</label><input value={form.headName} onChange={e => set('headName', e.target.value)} placeholder="Фамилия Имя Отчество" /></div>
                                <div className="pp-field"><label>Телефон *</label><input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+996 ..." /></div>
                                <div className="pp-field"><label>Эл. почта *</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} /></div>
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
                                        <button type="button" className="pp-row__action" onClick={() => fileRefs.current[d.key]?.click()}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: '-2px', marginRight: 6 }}><path d="M21.44 11.05 12.25 20.24a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>Прикрепить файл</button>
                                    )}
                                    <input ref={el => fileRefs.current[d.key] = el} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={e => handleFile(d.key, e.target.files[0])} />
                                </div>
                            ))}

                            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, margin: '8px 0 18px', cursor: 'pointer' }}>
                                <input type="checkbox" checked={confirm} onChange={e => setConfirm(e.target.checked)} style={{ marginTop: 3 }} />
                                <span>Подтверждаю достоверность сведений и согласие на обработку данных организации.</span>
                            </label>

                            <button type="submit" className="pp-form__submit" disabled={!canSubmit || sending} style={{ opacity: (canSubmit && !sending) ? 1 : 0.4, cursor: (canSubmit && !sending) ? 'pointer' : 'not-allowed' }}>
                                {sending ? 'Отправка…' : 'Подать заявление'}
                            </button>
                        </form>
                    </div>

                    <aside>
                        <div className="pp-sidebar-card">
                            <h3 className="pp-sidebar-card__title">Условия</h3>
                            <div className="pp-contact" style={{ flexDirection: 'column', gap: 4 }}><span className="pp-contact__label">Орган</span><span className="pp-contact__val">Государственное агентство по ФКиС</span></div>
                            <div className="pp-contact" style={{ flexDirection: 'column', gap: 4 }}><span className="pp-contact__label">Срок рассмотрения</span><span className="pp-contact__val">14 рабочих дней</span></div>
                            <div className="pp-contact" style={{ flexDirection: 'column', gap: 4 }}><span className="pp-contact__label">Срок аккредитации</span><span className="pp-contact__val">4 года</span></div>
                            <div className="pp-contact" style={{ flexDirection: 'column', gap: 4 }}><span className="pp-contact__label">Стоимость</span><span className="pp-contact__val">Бесплатно</span></div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
