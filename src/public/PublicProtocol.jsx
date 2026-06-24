import { useState } from 'react'
import { Link } from 'react-router-dom'
import PublicHero from './components/PublicHero'
import { protocolsApi } from '../api/esport'
import './pages/publicPages.css'

const SPORTS = ['Дзюдо', 'Бокс', 'Борьба', 'Вольная борьба', 'Тхэквондо', 'Каратэ', 'Лёгкая атлетика', 'Плавание', 'Футбол', 'Волейбол', 'Гимнастика', 'Тяжёлая атлетика', 'Самбо', 'Шахматы', 'Другой']
const LEVELS = ['Городской', 'Областной', 'Республиканский', 'Международный']
const MEDALS = ['', 'Золото', 'Серебро', 'Бронза']

function genNo() {
    const d = new Date()
    const p = (n) => String(n).padStart(2, '0')
    return `PR-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
}

const emptyRow = () => ({ athleteName: '', discipline: '', place: '', medalType: '' })

export default function PublicProtocol() {
    const [form, setForm] = useState({ federationName: '', sport: '', eventName: '', eventDate: '', level: '', city: '', phone: '', email: '' })
    const [results, setResults] = useState([emptyRow(), emptyRow(), emptyRow()])
    const [confirm, setConfirm] = useState(false)
    const [submitted, setSubmitted] = useState(null)
    const [sending, setSending] = useState(false)

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }))
    const setRow = (i, k, v) => setResults(rs => rs.map((r, idx) => idx === i ? { ...r, [k]: v } : r))
    const addRow = () => setResults(rs => [...rs, emptyRow()])
    const removeRow = (i) => setResults(rs => rs.length > 1 ? rs.filter((_, idx) => idx !== i) : rs)

    const filledRows = results.filter(r => r.athleteName.trim())
    const required = form.federationName && form.sport && form.eventName
    const canSubmit = required && filledRows.length > 0 && confirm

    const submit = async () => {
        if (!canSubmit || sending) return
        let no = genNo()
        setSending(true)
        try {
            const created = await protocolsApi.create({
                federationName: form.federationName,
                sport: form.sport,
                eventName: form.eventName,
                eventDate: form.eventDate || null,
                level: form.level,
                city: form.city,
                phone: form.phone,
                email: form.email,
                results: filledRows.map(r => ({
                    athleteName: r.athleteName,
                    discipline: r.discipline,
                    place: r.place ? Number(r.place) : null,
                    medalType: r.medalType || null,
                })),
            })
            if (created?.appNo) no = created.appNo
        } catch {
            // Демо-режим: бэкенд недоступен
        }
        setSending(false)
        setSubmitted({ no, date: new Date().toLocaleDateString('ru-RU'), event: form.eventName, count: filledRows.length })
    }

    if (submitted) {
        return (
            <div className="pub-section">
                <div className="pub-container pp-wrap" style={{ paddingTop: 32 }}>
                    <div className="pp-success" style={{ margin: '0 auto' }}>
                        <strong>Протокол принят · № {submitted.no}</strong>
                        Протокол соревнования «{submitted.event}» ({submitted.count} результатов) зарегистрирован {submitted.date}. После проверки специалистом результаты будут опубликованы. Срок — 5 рабочих дней.
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
            <PublicHero title="Загрузка протокола соревнования" description="Федерация загружает протокол с результатами соревнования напрямую в систему. После проверки специалистом результаты публикуются." variant="indigo" layoutMode="abstract" />

            <div className="pub-container pp-wrap">
                <form className="pp-form" style={{ maxWidth: 'none' }} onSubmit={e => { e.preventDefault(); submit() }}>
                    <h2 className="pp-block__title" style={{ marginTop: 0 }}>Соревнование</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div className="pp-field"><label>Федерация *</label><input value={form.federationName} onChange={e => set('federationName', e.target.value)} placeholder="напр. Федерация бокса КР" /></div>
                        <div className="pp-field"><label>Вид спорта *</label><select value={form.sport} onChange={e => set('sport', e.target.value)}><option value="">Выберите</option>{SPORTS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                        <div className="pp-field" style={{ gridColumn: '1 / -1' }}><label>Наименование соревнования *</label><input value={form.eventName} onChange={e => set('eventName', e.target.value)} placeholder="напр. Чемпионат КР 2026" /></div>
                        <div className="pp-field"><label>Дата проведения</label><input type="date" value={form.eventDate} onChange={e => set('eventDate', e.target.value)} /></div>
                        <div className="pp-field"><label>Уровень</label><select value={form.level} onChange={e => set('level', e.target.value)}><option value="">Выберите</option>{LEVELS.map(l => <option key={l} value={l}>{l}</option>)}</select></div>
                        <div className="pp-field"><label>Город</label><input value={form.city} onChange={e => set('city', e.target.value)} placeholder="г. Бишкек" /></div>
                        <div className="pp-field"><label>Контактный телефон</label><input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+996 ..." /></div>
                    </div>

                    <h2 className="pp-block__title">Результаты <span style={{ fontWeight: 400, fontSize: 13, color: 'var(--pub-text-muted)' }}>(спортсмен, дисциплина, место, медаль)</span></h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {results.map((r, i) => (
                            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 0.7fr 1fr auto', gap: 8, alignItems: 'center' }}>
                                <input className="pp-inline-input" value={r.athleteName} onChange={e => setRow(i, 'athleteName', e.target.value)} placeholder="ФИО спортсмена" />
                                <input className="pp-inline-input" value={r.discipline} onChange={e => setRow(i, 'discipline', e.target.value)} placeholder="дисциплина / вес" />
                                <input className="pp-inline-input" type="number" min="1" value={r.place} onChange={e => setRow(i, 'place', e.target.value)} placeholder="место" />
                                <select className="pp-inline-input" value={r.medalType} onChange={e => setRow(i, 'medalType', e.target.value)}>
                                    {MEDALS.map(m => <option key={m} value={m}>{m || '— медаль —'}</option>)}
                                </select>
                                <button type="button" onClick={() => removeRow(i)} title="Удалить строку"
                                        style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, color: '#ef4444', padding: '0 6px' }}>✕</button>
                            </div>
                        ))}
                    </div>
                    <button type="button" className="pp-row__action" onClick={addRow} style={{ marginTop: 10 }}>+ Добавить строку</button>

                    <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, margin: '18px 0', cursor: 'pointer' }}>
                        <input type="checkbox" checked={confirm} onChange={e => setConfirm(e.target.checked)} style={{ marginTop: 3 }} />
                        <span>Подтверждаю достоверность результатов и полномочия федерации на подачу протокола.</span>
                    </label>

                    <button type="submit" className="pp-form__submit" disabled={!canSubmit || sending} style={{ opacity: (canSubmit && !sending) ? 1 : 0.4, cursor: (canSubmit && !sending) ? 'pointer' : 'not-allowed' }}>
                        {sending ? 'Отправка…' : `Загрузить протокол (${filledRows.length})`}
                    </button>
                </form>
            </div>
        </div>
    )
}
