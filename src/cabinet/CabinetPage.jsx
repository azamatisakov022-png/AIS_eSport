import { useTranslation } from 'react-i18next'
import { useRole } from '../context/RoleContext'

function getSectionData(t) {
    return {
        /* ── Спортсмен ── */
        passport: {
            title: t('cabinet.nav.ranks'),
            roles: ['athlete'],
            rows: [
                [t('common.name'), 'Асанов Бекболот Маратович'],
                [t('fields.birthDate'), '15.04.1998'],
                [t('fields.gender'), 'Мужской'],
                [t('fields.sport'), 'Дзюдо'],
                [t('cabinet.fields.sportTitle'), 'Мастер спорта КР'],
                [t('fields.category'), 'I разряд'],
                [t('common.status'), { text: 'Активен', status: 'ok' }],
            ],
        },
        medical: {
            title: t('cabinet.nav.medical'),
            roles: ['athlete'],
            rows: [
                [t('cabinet.fields.certificateType'), 'Допуск к соревнованиям'],
                [t('fields.issuedDate'), '10.01.2025'],
                [t('fields.expiryDate'), '10.01.2026'],
                [t('cabinet.fields.medInstitution'), 'РЦСМ г. Бишкек'],
                [t('common.status'), { text: 'Действительна', status: 'ok' }],
            ],
        },
        events: {
            title: t('cabinet.nav.events'),
            roles: ['athlete', 'coach', 'judge'],
            rowsByRole: {
                athlete: [
                    ['Чемпионат КР по дзюдо', '15.03.2025 - Бишкек'],
                    ['Кубок Азии', '20.05.2025 - Ташкент'],
                    ['Спартакиада', '10.04.2025 - Бишкек'],
                ],
                coach: [
                    ['Чемпионат КР по дзюдо', '15.03.2025 - Тренер сборной'],
                    ['Сборы (Иссык-Куль)', '01-14.06.2025 - Главный тренер'],
                    ['Кубок Азии', '20.05.2025 - Секундант'],
                ],
                judge: [
                    ['Кубок Бишкека по боксу', '22.03.2025 - Главный судья'],
                    ['Первенство КР', '01.04.2025 - Боковой судья'],
                    ['Спартакиада школьников', '10.04.2025 - Рефери'],
                ],
                org: [
                    ['Чемпионат Республики', 'Организатор - 15.03.2025'],
                    ['Городской турнир', 'Организатор - 01.04.2025'],
                ],
            },
        },
        training: {
            title: t('cabinet.nav.training'),
            roles: ['athlete', 'coach'],
            rows: [
                [t('cabinet.fields.schedule'), 'Пн-Пт, 08:00-11:00'],
                [t('cabinet.fields.location'), 'РСДЮШОР по дзюдо, зал №2'],
                [t('fields.coach'), 'Иванов С.П.'],
                [t('cabinet.fields.nextTraining'), 'Завтра, 08:00'],
            ],
        },
        coaches: {
            title: t('cabinet.nav.coaches'),
            roles: ['athlete', 'org'],
            rowsByRole: {
                athlete: [
                    [t('fields.coach'), 'Иванов Сергей Петрович'],
                    [t('fields.organization'), 'РСДЮШОР по дзюдо'],
                    [t('fields.phone'), '+996 555 12 34 56'],
                ],
                org: [
                    ['Тренеров в штате', '18'],
                    ['Заслуженных тренеров КР', '2'],
                    ['Высшая квалификация', '10'],
                ],
            },
        },
        medals: {
            title: t('pages.cabinetMedals'),
            roles: ['athlete'],
            rows: [
                [t('cabinet.fields.gold'), '3'],
                [t('cabinet.fields.silver'), '5'],
                [t('cabinet.fields.bronze'), '8'],
                [t('cabinet.fields.internationalRating'), '147 (IJF)'],
            ],
        },
        team: {
            title: t('pages.cabinetTeam'),
            roles: ['athlete', 'coach'],
            rows: [
                [t('fields.team'), 'Национальная сборная КР по дзюдо'],
                [t('common.status'), { text: 'В составе', status: 'ok' }],
                [t('fields.category'), 'Мужчины -73 кг'],
                [t('cabinet.fields.lastCamp'), 'Иссык-Куль, июнь 2024'],
            ],
        },
        applications: {
            title: t('cabinet.nav.applications'),
            roles: ['athlete', 'coach', 'judge', 'org'],
            rowsByRole: {
                athlete: [
                    [t('cabinet.fields.participationApplication'), { text: 'Одобрено', status: 'ok' }],
                    [t('cabinet.fields.rankAssignment'), { text: 'На рассмотрении', status: 'pending' }],
                ],
                coach: [
                    [t('cabinet.fields.participationApplication'), { text: 'Одобрено', status: 'ok' }],
                ],
                judge: [
                    [t('cabinet.fields.participationApplication'), { text: 'Одобрено', status: 'ok' }],
                ],
                org: [
                    ['Представление на МС КР', { text: 'Одобрено', status: 'ok' }],
                    ['Ходатайство на ЗТ КР', { text: 'На рассмотрении', status: 'pending' }],
                ]
            },
        },
        notifications: {
            title: t('cabinet.nav.notifications'),
            roles: ['athlete', 'coach', 'judge', 'org'],
            rowsByRole: {
                athlete: [
                    ['Чемпионат КР по дзюдо', 'Регистрация открыта - до 10.03.2025'],
                    ['Медицинская справка', 'Срок истекает через 30 дней'],
                ],
                coach: [
                    ['Допуск', 'Все документы проверены'],
                ],
                judge: [
                    ['Назначение', 'Вы назначены боковым судьей'],
                ],
                org: [
                    ['Отчетность', 'Сдача ежеквартального отчета до 30.03.2025'],
                    ['Регламент', 'Обновлен регламент проведения соревнований'],
                ],
            },
        },
        certificate: {
            title: t('cabinet.nav.certificate'),
            roles: ['coach'],
            rows: [
                [t('common.name'), 'Иванов Сергей Петрович'],
                [t('fields.licenseNumber'), 'ТР-2023-001245'],
                [t('fields.issuedDate'), '15.03.2023'],
                [t('fields.expiryDate'), 'Бессрочно'],
                [t('fields.category'), 'Высшая'],
                [t('fields.specialization'), 'Дзюдо'],
                [t('common.status'), { text: 'Действительна', status: 'ok' }],
            ],
        },
        athletes: {
            title: t('cabinet.nav.athletes'),
            roles: ['coach', 'org'],
            rowsByRole: {
                coach: [
                    ['Асанов Бекболот', 'МС КР - Дзюдо'],
                    ['Касымова Айгерим', 'КМС - Дзюдо'],
                    ['Токтоматов Эрлан', 'I разряд - Дзюдо'],
                    ['Белекова Жазгул', 'КМС - Дзюдо'],
                    [t('cabinet.fields.totalAthletes'), '12'],
                ],
                org: [
                    ['Всего спортсменов', '245'],
                    ['Из них МСМК', '12'],
                    ['Из них МС КР', '34'],
                ],
            },
        },
        license: {
            title: t('pages.cabinetLicense'),
            roles: ['judge'],
            rows: [
                [t('common.name'), 'Мамытов Руслан Кайратович'],
                [t('fields.certificateNumber'), 'СУ-2024-000312'],
                [t('fields.issuedDate'), '20.06.2024'],
                [t('fields.expiryDate'), '20.06.2029'],
                [t('common.status'), { text: 'Действительно', status: 'ok' }],
            ],
        },
        category: {
            title: t('cabinet.nav.category'),
            roles: ['judge'],
            rows: [
                [t('cabinet.fields.judgeCategory'), 'Судья 1 категории'],
                [t('fields.sport'), 'Бокс'],
                [t('cabinet.fields.awardDate'), '15.01.2024'],
                [t('fields.qualification'), { text: 'Подтверждена', status: 'ok' }],
            ],
        },
        facilities: {
            title: 'Спортивные объекты',
            roles: ['org'],
            rows: [
                ['ФОК "Газпром"', { text: 'Действует', status: 'ok' }],
                ['Главная Арена СДЮСШ', { text: 'Действует', status: 'ok' }],
                ['Малый тренировочный зал', { text: 'Ремонт', status: 'pending' }],
            ],
        },
    }
}

export default function CabinetPage({ section }) {
    const { t } = useTranslation()
    const { currentRole } = useRole()
    const sectionData = getSectionData(t)
    const data = sectionData[section]

    if (!data) {
        return (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <div style={{ fontSize: 16, fontWeight: 500, marginTop: 12 }}>{t('cabinet.sectionNotFound')}</div>
            </div>
        )
    }

    const rows = data.rowsByRole ? (data.rowsByRole[currentRole] || []) : (data.rows || [])

    return (
        <div>
            <h1 style={s.pageTitle}>{data.title}</h1>
            <div style={s.dataGrid}>
                {rows.map(([label, value], i) => (
                    <div key={i} style={s.dataField}>
                        <span style={s.dataLabel}>{label}</span>
                        <span style={s.dataValue}>
                            {typeof value === 'object' && value.status ? (
                                <span style={{
                                    display: 'inline-block', padding: '2px 8px', borderRadius: 8,
                                    fontSize: 11, fontWeight: 500,
                                    background: value.status === 'ok' ? 'var(--green-light, rgba(46, 125, 50, 0.15))' :
                                        value.status === 'pending' ? 'var(--amber-light, rgba(230, 81, 0, 0.15))' : 'var(--bg-secondary, rgba(142, 142, 147, 0.15))',
                                    color: value.status === 'ok' ? 'var(--green, #2E7D32)' :
                                        value.status === 'pending' ? 'var(--amber, #E65100)' : 'var(--text-secondary, #6E6E73)',
                                }}>
                                    {value.text}
                                </span>
                            ) : value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

const s = {
    pageTitle: { fontSize: 18, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 20 },
    dataGrid: {
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
    },
    dataField: {
        padding: '12px 16px', background: 'var(--bg-panel, #F8F9FB)', borderRadius: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    },
    dataLabel: { fontSize: 12, color: 'var(--text-secondary, #86868B)' },
    dataValue: { fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right' },
}
