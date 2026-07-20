import { useState } from 'react'
import { useToast } from '../context/ToastContext'

/* ЛК спортшколы: зачисление спортсмена с проверкой по ИНН.
   Правило «один спортсмен — одна спортшкола» (УРФКиМС, 16.07.2026):
   двойное числение блокируется, легальный путь — процесс перехода с историей. */

const MY_SCHOOL = 'СДЮСШ «Олимп»'

/* Демо-реестр: кто где числится */
const INN_DB = {
    '20415199800101': {
        name: 'Асанов Бекболот Маратович', sport: 'Дзюдо',
        school: 'СДЮСШОР №3 г. Бишкек', region: 'Главное управление (Бишкек)', since: '2024',
        history: [
            { year: '2021', text: 'Зачислен в СДЮСШ «Ак-Марал» (г. Ош)' },
            { year: '2024', text: 'Переход в СДЮСШОР №3 г. Бишкек — смена места жительства (подтверждён: обе школы + федерация)' },
        ],
    },
    '21510200500202': {
        name: 'Токтогулова Назира Асылбековна', sport: 'Плавание',
        school: 'СДЮСШ «Олимп»', region: 'Чуйская область', since: '2023',
        history: [{ year: '2023', text: 'Зачислена в СДЮСШ «Олимп»' }],
    },
}

export default function SchoolEnrollment() {
    const toast = useToast()
    const [inn, setInn] = useState('')
    const [result, setResult] = useState(null)
    const [enrolled, setEnrolled] = useState([])

    const check = () => {
        if (!/^\d{14}$/.test(inn)) { setResult({ kind: 'invalid' }); return }
        const rec = INN_DB[inn]
        if (!rec) setResult({ kind: 'free', inn })
        else if (rec.school === MY_SCHOOL) setResult({ kind: 'ours', rec })
        else setResult({ kind: 'taken', rec })
    }

    const enroll = () => {
        setEnrolled([...enrolled, inn])
        toast('Спортсмен зачислен в СДЮСШ «Олимп» (демо)')
        setResult({ ...result, kind: 'enrolled' })
    }

    return (
        <div>
            <h1 style={s.title}>Зачисление спортсменов</h1>
            <div style={s.note}>
                <b>Правило ГАФКиС:</b> один спортсмен числится только в одной спортшколе.
                Перед зачислением АИС проверяет по ИНН, не числится ли спортсмен в другой школе.
                Легальный путь смены школы — заявление на переход (история переходов сохраняется).
            </div>

            <div style={s.searchCard}>
                <label style={s.label}>ИНН спортсмена (14 цифр)</label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <input
                        style={{ ...s.input, flex: '1 1 260px', fontFamily: 'monospace', letterSpacing: 1 }}
                        placeholder="20415199800101"
                        value={inn}
                        maxLength={14}
                        onChange={e => { setInn(e.target.value.replace(/\D/g, '')); setResult(null) }}
                    />
                    <button style={s.primaryBtn} onClick={check}>Проверить</button>
                </div>
                <div style={s.hint}>Демо: 20415199800101 — числится в другой школе · 21510200500202 — уже в вашей · любой другой корректный ИНН — свободен</div>
            </div>

            {result?.kind === 'invalid' && (
                <div style={{ ...s.result, ...s.resRed }}>ИНН должен состоять из 14 цифр.</div>
            )}

            {result?.kind === 'free' && (
                <div style={{ ...s.result, ...s.resGreen }}>
                    <div style={s.resTitle}>Спортсмен свободен</div>
                    <div style={s.resText}>По ИНН {result.inn} действующего числения в спортшколах не найдено. Можно зачислить.</div>
                    <button style={{ ...s.primaryBtn, marginTop: 12 }} onClick={enroll}>Зачислить в {MY_SCHOOL}</button>
                </div>
            )}

            {result?.kind === 'enrolled' && (
                <div style={{ ...s.result, ...s.resGreen }}>
                    <div style={s.resTitle}>Зачислен</div>
                    <div style={s.resText}>Спортсмен зачислен в {MY_SCHOOL}. Запись появится в реестре после проверки специалистом.</div>
                </div>
            )}

            {result?.kind === 'ours' && (
                <div style={{ ...s.result, ...s.resAmber }}>
                    <div style={s.resTitle}>{result.rec.name} — уже числится в вашей школе</div>
                    <div style={s.resText}>{result.rec.sport} · в {MY_SCHOOL} с {result.rec.since} г. Повторное зачисление не требуется.</div>
                </div>
            )}

            {result?.kind === 'taken' && (
                <div style={{ ...s.result, ...s.resRed }}>
                    <div style={s.resTitle}>Зачисление заблокировано</div>
                    <div style={s.resText}>
                        <b>{result.rec.name}</b> ({result.rec.sport}) уже числится в: <b>{result.rec.school}</b> ({result.rec.region}), с {result.rec.since} г.
                        Двойное числение в двух спортшколах запрещено.
                    </div>
                    <div style={s.histTitle}>История переходов</div>
                    {result.rec.history.map((h, i) => (
                        <div key={i} style={s.histRow}><span style={s.histYear}>{h.year}</span>{h.text}</div>
                    ))}
                    <button style={{ ...s.primaryBtn, marginTop: 14 }} onClick={() => toast('Заявление на переход — процесс «Переход между школами» (демо)')}>
                        Оформить переход в {MY_SCHOOL}
                    </button>
                </div>
            )}
        </div>
    )
}

const s = {
    title: { fontSize: 24, fontWeight: 300, color: 'var(--text-primary)', marginBottom: 14, letterSpacing: -0.3 },
    note: {
        background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderLeft: '3px solid #2B5EA7',
        borderRadius: 10, padding: '12px 16px', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 18, lineHeight: 1.55,
    },
    searchCard: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '18px 20px', marginBottom: 16 },
    label: { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 },
    input: {
        padding: '10px 14px', borderRadius: 9, border: '1px solid var(--border-color)',
        background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 14,
    },
    hint: { fontSize: 11.5, color: 'var(--text-muted)', marginTop: 10 },
    primaryBtn: {
        padding: '10px 18px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        background: 'linear-gradient(135deg, #1B3A6B, #2B5EA7)', color: '#fff', fontSize: 13.5, fontWeight: 700,
    },
    result: { borderRadius: 14, padding: '16px 20px', border: '1px solid' },
    resGreen: { background: '#f0fdf4', borderColor: '#bbf7d0' },
    resAmber: { background: '#fffbeb', borderColor: '#fde68a' },
    resRed: { background: '#fef2f2', borderColor: '#fecaca' },
    resTitle: { fontSize: 15, fontWeight: 700, color: '#1d2c47', marginBottom: 6 },
    resText: { fontSize: 13.5, color: '#3f4c63', lineHeight: 1.55 },
    histTitle: { fontSize: 12, fontWeight: 700, color: '#6b7280', margin: '14px 0 6px', textTransform: 'uppercase', letterSpacing: 0.4 },
    histRow: { fontSize: 13, color: '#3f4c63', padding: '5px 0', borderBottom: '1px dashed #e5e7eb' },
    histYear: { display: 'inline-block', width: 46, fontWeight: 700, color: '#1d2c47' },
}
