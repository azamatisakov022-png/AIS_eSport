import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import { loadAwards, awardRoute, AWARD_LEVELS } from './awardsStore'

/* ЛК спортсмена: мои звания и разряды. Присвоенные звания отображаются тут
   (реестр званий не публичный — только в ЛК). Значок + заказ дубликата удостоверения. */

const ME = 'Джумабаев Эрлан Калыкович' // демо-спортсмен

export default function CabinetMyAwards() {
    const toast = useToast()
    const [awards] = useState(loadAwards)

    const mine = awards.filter(a => a.athlete === ME)
    const granted = mine.filter(a => a.step >= awardRoute(a).length)
    const inProgress = mine.filter(a => a.step < awardRoute(a).length && !a.returned)

    const orderDuplicate = (a) => toast(`Заявление на дубликат «${a.title}»: копия паспорта + 2 фото 3х4 + госпошлина 30 сом → отдел СВД, срок 14 раб. дней`)

    return (
        <div>
            <h1 style={s.title}>Мои звания и разряды</h1>

            {granted.length === 0 && inProgress.length === 0 && (
                <div style={s.empty}>У вас пока нет присвоенных званий и разрядов</div>
            )}

            {granted.length > 0 && (
                <>
                    <div style={s.section}>Присвоено</div>
                    {granted.map(a => (
                        <div key={a.id} style={s.card}>
                            <div style={s.row}>
                                <div>
                                    <div style={s.awardTitle}>{a.title}</div>
                                    <div style={s.sub}>{a.sport}{a.discipline ? ` · ${a.discipline}` : ''} · {AWARD_LEVELS[a.level].label}</div>
                                    <div style={s.meta}>Приказ: {a.order || '—'} · основание: {a.competition}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={s.badge}>Действует · бессрочно</span>
                                    {a.badgeIssued && <div style={s.znak}>Значок выдан</div>}
                                </div>
                            </div>
                            <button style={s.dupBtn} onClick={() => orderDuplicate(a)}>Заказать дубликат удостоверения</button>
                        </div>
                    ))}
                </>
            )}

            {inProgress.length > 0 && (
                <>
                    <div style={s.section}>В процессе присвоения</div>
                    {inProgress.map(a => {
                        const route = awardRoute(a)
                        return (
                            <div key={a.id} style={s.card}>
                                <div style={s.row}>
                                    <div>
                                        <div style={s.awardTitle}>{a.title}</div>
                                        <div style={s.sub}>{a.sport} · заявление {a.num}</div>
                                    </div>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5 }}>
                                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#d97706' }} />
                                        Шаг {a.step + 1} из {route.length}: {route[a.step].role}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </>
            )}
        </div>
    )
}

const s = {
    title: { fontSize: 24, fontWeight: 300, color: 'var(--text-primary)', marginBottom: 16, letterSpacing: -0.3 },
    section: { fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.6, margin: '18px 0 8px' },
    card: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '16px 20px', marginBottom: 12 },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' },
    awardTitle: { fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' },
    sub: { fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 },
    meta: { fontSize: 12, color: 'var(--text-muted)', marginTop: 4 },
    badge: { fontSize: 11.5, fontWeight: 700, color: '#166534', background: '#dcfce7', borderRadius: 12, padding: '4px 10px' },
    znak: { fontSize: 11.5, color: 'var(--text-muted)', marginTop: 6 },
    dupBtn: { marginTop: 12, padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-secondary)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
    empty: { fontSize: 13.5, color: 'var(--text-muted)', background: 'var(--bg-card)', border: '1px dashed var(--border-color)', borderRadius: 12, padding: 24, textAlign: 'center' },
}
