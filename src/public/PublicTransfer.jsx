import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import PublicHero from './components/PublicHero'
import { transferApi } from '../api/esport'
import './pages/publicPages.css'

const SPORTS = ['Дзюдо', 'Бокс', 'Борьба', 'Вольная борьба', 'Тхэквондо', 'Каратэ', 'Лёгкая атлетика', 'Плавание', 'Футбол', 'Волейбол', 'Гимнастика', 'Тяжёлая атлетика', 'Самбо', 'Шахматы', 'Другой']

const DOCS = [
    { key: 'application', label: 'Заявление о переходе' },
    { key: 'release', label: 'Согласие старого клуба (открепление)' },
    { key: 'passport', label: 'Копия паспорта / свидетельства о рождении' },
]

function genNo() {
    const d = new Date()
    const p = (n) => String(n).padStart(2, '0')
    return `TF-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
}

export default function PublicTransfer() {
    const [form, setForm] = useState({ athleteName: '', sport: '', oldClub: '', newClub: '', region: '', reason: '', phone: '', email: '' })
    const [docs, setDocs] = useState({})
    const [confirm, setConfirm] = useState(false)
    const [submitted, setSubmitted] = useState(null)
    const [sending, setSending] = useState(false)
    const fileRefs = useRef({})

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }))
    const handleFile = (key, file) => { if (file) setDocs(p => ({ ...p, [key]: file })) }

    const required = form.athleteName && form.sport && form.newClub && form.phone
    const allDocs = DOCS.every(d => docs[d.key])
    const canSubmit = required && allDocs && confirm

    const submit = async () => {
        if (!canSubmit || sending) return
        let no = genNo()
        setSending(true)
        try {
            const created = await transferApi.create({
                athleteName: form.athleteName,
                sport: form.sport,
                oldClub: form.oldClub,
                newClub: form.newClub,
                region: form.region,
                reason: form.reason,
                phone: form.phone,
                email: form.email,
                docsTotal: DOCS.length,
            })
            if (created?.appNo) no = created.appNo
        } catch {
            // Демо-режим: бэкенд недоступен — локальный номер
        }
        setSending(false)
        setSubmitted({ no, date: new Date().toLocaleDateString('ru-RU'), name: form.athleteName, club: form.newClub })
    }

    if (submitted) {
        return (
            <div className="pub-section">
                <div className="pub-container pp-wrap" style={{ paddingTop: 32 }}>
                    <div className="pp-success" style={{ margin: '0 auto' }}>
                        <strong>Заявление принято · № {submitted.no}</strong>
                        Заявление на переход «{submitted.name}» в «{submitted.club}» зарегистрировано {submitted.date}. Переход подтверждают старый клуб, новый клуб и федерация. Статус — в личном кабинете.
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
            <PublicHero title="Переход спортсмена в другой клуб" description="Онлайн-подача заявления на переход (смену клуба/спортшколы). Переход подтверждают старый клуб, новый клуб и федерация по виду спорта." variant="indigo" layoutMode="abstract" />

            <div className="pub-container pp-wrap">
                <div className="pp-cols">
                    <div>
                        <form className="pp-form" style={{ maxWidth: 'none' }} onSubmit={e => { e.preventDefault(); submit() }}>
                            <h2 className="pp-block__title" style={{ marginTop: 0 }}>Данные спортсмена</h2>
                            <div className="pp-field"><label>ФИО спортсмена *</label><input value={form.athleteName} onChange={e => set('athleteName', e.target.value)} placeholder="Фамилия Имя Отчество" /></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="pp-field"><label>Вид спорта *</label><select value={form.sport} onChange={e => set('sport', e.target.value)}><option value="">Выберите</option>{SPORTS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                                <div className="pp-field"><label>Регион</label><input value={form.region} onChange={e => set('region', e.target.value)} placeholder="напр. г. Бишкек" /></div>
                                <div className="pp-field"><label>Телефон *</label><input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+996 ..." /></div>
                                <div className="pp-field"><label>Эл. почта</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} /></div>
                            </div>

                            <h2 className="pp-block__title">Клубы</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="pp-field"><label>Старый клуб</label><input value={form.oldClub} onChange={e => set('oldClub', e.target.value)} placeholder="откуда переходит" /></div>
                                <div className="pp-field"><label>Новый клуб *</label><input value={form.newClub} onChange={e => set('newClub', e.target.value)} placeholder="куда переходит" /></div>
                            </div>
                            <div className="pp-field"><label>Причина перехода</label><input value={form.reason} onChange={e => set('reason', e.target.value)} placeholder="напр. переезд, смена тренера" /></div>

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
                                <span>Подтверждаю достоверность сведений и согласие на обработку персональных данных.</span>
                            </label>

                            <button type="submit" className="pp-form__submit" disabled={!canSubmit || sending} style={{ opacity: (canSubmit && !sending) ? 1 : 0.4, cursor: (canSubmit && !sending) ? 'pointer' : 'not-allowed' }}>
                                {sending ? 'Отправка…' : 'Подать заявление'}
                            </button>
                        </form>
                    </div>

                    <aside>
                        <div className="pp-sidebar-card">
                            <h3 className="pp-sidebar-card__title">Порядок</h3>
                            <div className="pp-contact" style={{ flexDirection: 'column', gap: 4 }}><span className="pp-contact__label">Подтверждают</span><span className="pp-contact__val">Старый клуб → Новый клуб → Федерация</span></div>
                            <div className="pp-contact" style={{ flexDirection: 'column', gap: 4 }}><span className="pp-contact__label">Срок рассмотрения</span><span className="pp-contact__val">10 рабочих дней</span></div>
                            <div className="pp-contact" style={{ flexDirection: 'column', gap: 4 }}><span className="pp-contact__label">Стоимость</span><span className="pp-contact__val">Бесплатно</span></div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
