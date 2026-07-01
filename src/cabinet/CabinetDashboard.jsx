import { useTranslation } from 'react-i18next'
import { useRole } from '../context/RoleContext'

function getDashboardData(t) {
    return {
        athlete: {
            name: 'Асанов Бекболот Маратович',
            rank: 'МС КР',
            sport: 'Дзюдо',
            region: 'Бишкек',
            fields: [
                [t('fields.birthDate'), '15.04.1998'],
                [t('fields.gender'), 'Мужской'],
                [t('fields.sport'), 'Дзюдо'],
                [t('fields.rank'), 'Мастер спорта КР'],
                [t('fields.category'), 'I разряд'],
                [t('fields.region'), 'Бишкек'],
                [t('fields.coach'), 'Иванов С.П.'],
                [t('fields.organization'), 'СДЮСШОР №3'],
                [t('fields.team'), 'Национальная сборная КР по дзюдо'],
                [t('fields.medicalCertificate'), 'Действительна до 10.01.2026'],
            ],
        },
        coach: {
            name: 'Иванов Сергей Петрович',
            rank: 'Высшая категория',
            sport: 'Дзюдо',
            region: 'Бишкек',
            fields: [
                [t('fields.specialization'), 'Дзюдо'],
                [t('fields.category'), 'Высшая'],
                [t('fields.licenseNumber'), 'ТР-2023-001245'],
                [t('fields.issuedDate'), '15.03.2023'],
                [t('fields.expiryDate'), 'Бессрочно'],
                [t('fields.organization'), 'РСДЮШОР по дзюдо'],
                [t('fields.region'), 'Бишкек'],
                [t('fields.athletesCount'), '12'],
            ],
        },
        judge: {
            name: 'Мамытов Руслан Кайратович',
            rank: 'Судья 1 категории',
            sport: 'Бокс',
            region: 'Бишкек',
            fields: [
                [t('fields.category'), 'Судья 1 категории'],
                [t('fields.sport'), 'Бокс'],
                [t('fields.certificateNumber'), 'СУ-2024-000312'],
                [t('fields.issuedDate'), '20.06.2024'],
                [t('fields.expiryDate'), '20.06.2029'],
                [t('fields.organization'), 'ГАФКиС КР'],
                [t('fields.region'), 'Бишкек'],
                [t('fields.qualification'), 'Подтверждена'],
            ],
        },
        org: {
            name: 'СДЮСШ Олимп',
            rank: 'Школа олимпийского резерва',
            sport: 'Многопрофильная',
            region: 'Бишкек',
            fields: [
                [t('fields.organization'), 'СДЮСШ Олимп'],
                [t('fields.region'), 'Бишкек'],
                ['ИНН', '01234567890123'],
                ['Адрес', 'г. Бишкек, ул. Спортивная 12'],
                ['Руководитель', 'Асанов Бакыт Маратович'],
                ['Прикрепленных спортсменов', '245'],
                ['Прикрепленных тренеров', '18'],
                ['Спортивных объектов', '3'],
            ],
        },
    }
}

function getInitials(name) {
    const p = name.split(' ')
    return (p[0]?.[0] || '') + (p[1]?.[0] || '')
}

export default function CabinetDashboard() {
    const { t } = useTranslation()
    const { currentRole } = useRole()
    const dashboardData = getDashboardData(t)
    const data = dashboardData[currentRole] || dashboardData.athlete

    return (
        <div>
            <h1 style={s.pageTitle}>{t('cabinet.dashboard.title')}</h1>

            {/* V2 White hero card */}
            <div style={s.heroCard}>
                <div style={s.heroAvatar}>{getInitials(data.name)}</div>
                <div style={s.heroName}>{data.name}</div>
                <div style={s.heroBadges}>
                    <span style={s.badgeGold}>{data.rank}</span>
                    <span style={s.badgeBlue}>{data.sport}</span>
                    <span style={s.badgeGray}>{data.region}</span>
                </div>
                <button style={s.heroEditBtn} className="cab-edit-btn">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    {t('cabinet.dashboard.edit')}
                </button>
            </div>

            {/* Data rows */}
            <div style={s.dataSection}>
                {data.fields.map(([label, value], i) => (
                    <div key={i} style={{ ...s.dataRow, ...(i === data.fields.length - 1 ? { borderBottom: 'none' } : {}) }}>
                        <span style={s.dataLabel}>{label}</span>
                        <span style={s.dataValue}>{value}</span>
                    </div>
                ))}
            </div>

            <style>{`
                .cab-edit-btn:hover { background: var(--bg-panel) !important; }
            `}</style>
        </div>
    )
}

const shadowXs = '0 1px 2px rgba(0,0,0,0.03)'
const shadowSm = '0 4px 12px rgba(0,0,0,0.04)'

const s = {
    pageTitle: { fontSize: 24, fontWeight: 300, color: 'var(--text-primary)', marginBottom: 24, letterSpacing: -0.3 },
    heroCard: {
        background: 'var(--bg-card)', borderRadius: 20, padding: '36px 32px',
        boxShadow: shadowSm, border: '1px solid var(--border-color)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        marginBottom: 28, position: 'relative',
    },
    heroAvatar: {
        width: 80, height: 80, borderRadius: '50%',
        background: 'linear-gradient(135deg, #7EB6F6, #B8A9EE)',
        color: 'var(--text-inverse)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, fontWeight: 400, marginBottom: 16,
        boxShadow: '0 4px 20px rgba(126,182,246,0.35)',
    },
    heroName: { fontSize: 22, fontWeight: 300, color: 'var(--text-primary)', letterSpacing: -0.3, marginBottom: 12 },
    heroBadges: { display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
    badgeGold: {
        display: 'inline-block', padding: '4px 14px', borderRadius: 20,
        background: 'var(--badge-gold-bg)', color: 'var(--badge-gold-text)',
        fontSize: 12, fontWeight: 600,
    },
    badgeBlue: {
        display: 'inline-block', padding: '4px 14px', borderRadius: 20,
        background: 'rgba(10,132,255,0.15)', color: 'var(--accent)', fontSize: 12, fontWeight: 500,
    },
    badgeGray: {
        display: 'inline-block', padding: '4px 14px', borderRadius: 20,
        background: 'var(--bg-panel)', color: 'var(--text-muted)', fontSize: 12, fontWeight: 500,
    },
    heroEditBtn: {
        position: 'absolute', top: 20, right: 24,
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: 10,
        background: 'var(--bg-primary)', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500,
        fontFamily: 'inherit', cursor: 'pointer',
    },
    dataSection: {
        background: 'var(--bg-card)', borderRadius: 16, padding: '4px 0',
        boxShadow: 'var(--shadow-sm)',
    },
    dataRow: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 24px', borderBottom: '1px solid var(--border-color)',
    },
    dataLabel: { fontSize: 13, color: 'var(--text-muted)' },
    dataValue: { fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right' },
}
