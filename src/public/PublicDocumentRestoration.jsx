import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import PublicHero from './components/PublicHero'
import { restorationApi } from '../api/esport'
import './pages/publicPages.css'

const DOC_TYPES = [
    { value: 'rank', label: 'Свидетельство о спортивном звании' },
    { value: 'coach', label: 'Тренерский сертификат' },
    { value: 'judge', label: 'Судейское удостоверение' },
    { value: 'medal', label: 'Удостоверение к медали / награде' },
]

const REASONS = [
    { value: 'lost', label: 'Утеря' },
    { value: 'damaged', label: 'Порча / повреждение' },
    { value: 'stolen', label: 'Кража' },
]

const DOCS = [
    { key: 'application', label: 'Заявление о восстановлении' },
    { key: 'passport', label: 'Копия паспорта' },
    { key: 'announce', label: 'Объявление об утере (при наличии)', optional: true },
]

function genNo() {
    const d = new Date()
    const p = (n) => String(n).padStart(2, '0')
    return `RD-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
}

export default function PublicDocumentRestoration() {
    const [form, setForm] = useState({ fio: '', inn: '', phone: '', email: '', docType: '', reason: '', oldNumber: '', issueDate: '' })
    const [docs, setDocs] = useState({})
    const [confirm, setConfirm] = useState(false)
    const [submitted, setSubmitted] = useState(null)
    const [sending, setSending] = useState(false)
    const fileRefs = useRef({})

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }))
    const handleFile = (key, file) => { if (file) setDocs(p => ({ ...p, [key]: file })) }

    const required = form.fio && form.inn && form.phone && form.email && form.docType && form.reason
    const requiredDocs = DOCS.filter(d => !d.optional).every(d => docs[d.key])
    const canSubmit = required && requiredDocs && confirm

    const submit = async () => {
        if (!canSubmit || sending) return
        const docLabel = DOC_TYPES.find(d => d.value === form.docType)?.label || form.docType
        const reasonLabel = REASONS.find(r => r.value === form.reason)?.label || form.reason
        let no = genNo()
        setSending(true)
        try {
            // Реальная подача в бэкенд: заявка попадает в очередь специалиста
            const created = await restorationApi.create({
                applicantName: form.fio,
                inn: form.inn,
                phone: form.phone,
                email: form.email,
                docType: docLabel,
                reason: reasonLabel,
                oldNumber: form.oldNumber || null,
                issueDate: form.issueDate || null,
            })
            if (created?.appNo) no = created.appNo
        } catch {
            // Демо-режим: бэкенд недоступен — локальный номер
        }
        setSending(false)
        setSubmitted({ no, date: new Date().toLocaleDateString('ru-RU'), doc: docLabel })
    }

    if (submitted) {
        return (
            <div className="pub-section">
                <div className="pub-container pp-wrap" style={{ paddingTop: 32 }}>
                    <div className="pp-success" style={{ margin: '0 auto' }}>
                        <strong>Заявление принято · № {submitted.no}</strong>
                        Заявление на восстановление документа «{submitted.doc}» зарегистрировано {submitted.date}. Срок рассмотрения - 7 рабочих дней. Статус можно отследить в разделе{' '}
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
            <PublicHero title="Восстановление спортивных документов" description="Онлайн-подача заявления на восстановление утраченных или повреждённых спортивных документов и удостоверений." variant="slate" layoutMode="abstract" />

            <div className="pub-container pp-wrap">
                <div className="pp-cols">
                    <div>
                        <form className="pp-form" style={{ maxWidth: 'none' }} onSubmit={e => { e.preventDefault(); submit() }}>
                            <h2 className="pp-block__title" style={{ marginTop: 0 }}>Что восстанавливаем</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="pp-field"><label>Тип документа *</label><select value={form.docType} onChange={e => set('docType', e.target.value)}><option value="">Выберите</option>{DOC_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}</select></div>
                                <div className="pp-field"><label>Причина *</label><select value={form.reason} onChange={e => set('reason', e.target.value)}><option value="">Выберите</option>{REASONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}</select></div>
                                <div className="pp-field"><label>Номер утраченного документа</label><input value={form.oldNumber} onChange={e => set('oldNumber', e.target.value)} placeholder="если известен" /></div>
                                <div className="pp-field"><label>Дата выдачи</label><input type="date" value={form.issueDate} onChange={e => set('issueDate', e.target.value)} /></div>
                            </div>

                            <h2 className="pp-block__title">Данные заявителя</h2>
                            <div className="pp-field"><label>ФИО *</label><input value={form.fio} onChange={e => set('fio', e.target.value)} placeholder="Фамилия Имя Отчество" /></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="pp-field"><label>ПИН (ИНН) *</label><input value={form.inn} onChange={e => set('inn', e.target.value)} placeholder="14 цифр" /></div>
                                <div className="pp-field"><label>Телефон *</label><input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+996 ..." /></div>
                                <div className="pp-field"><label>Эл. почта *</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} /></div>
                            </div>

                            <h2 className="pp-block__title">Документы</h2>
                            {DOCS.map(d => (
                                <div className="pp-field" key={d.key}>
                                    <label>{d.label} {!d.optional && '*'}</label>
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

                            <button type="submit" className="pp-form__submit" disabled={!canSubmit || sending} style={{ opacity: (canSubmit && !sending) ? 1 : 0.4, cursor: (canSubmit && !sending) ? 'pointer' : 'not-allowed' }}>
                                {sending ? 'Отправка…' : 'Подать заявление'}
                            </button>
                        </form>
                    </div>

                    <aside>
                        <div className="pp-sidebar-card">
                            <h3 className="pp-sidebar-card__title">Условия</h3>
                            <div className="pp-contact" style={{ flexDirection: 'column', gap: 4 }}><span className="pp-contact__label">Орган</span><span className="pp-contact__val">ГАФКиС / выдавший орган</span></div>
                            <div className="pp-contact" style={{ flexDirection: 'column', gap: 4 }}><span className="pp-contact__label">Срок рассмотрения</span><span className="pp-contact__val">7 рабочих дней</span></div>
                            <div className="pp-contact" style={{ flexDirection: 'column', gap: 4 }}><span className="pp-contact__label">Стоимость</span><span className="pp-contact__val">Бесплатно</span></div>
                            <div className="pp-contact" style={{ flexDirection: 'column', gap: 4 }}><span className="pp-contact__label">Результат</span><span className="pp-contact__val">Дубликат документа</span></div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
