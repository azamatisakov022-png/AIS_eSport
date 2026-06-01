import './intranet.css'

const PAGES = [
    { path: '/public', title: 'Главная', updated: '2026-05-28', status: 'published', author: 'Канцелярия' },
    { path: '/public/news', title: 'Новости', updated: '2026-05-31', status: 'published', author: 'Пресс-служба' },
    { path: '/public/about', title: 'О ГАФКиС', updated: '2026-04-12', status: 'published', author: 'Канцелярия' },
    { path: '/public/npa', title: 'НПА', updated: '2026-05-15', status: 'published', author: 'Юридический отдел' },
    { path: '/public/budget', title: 'Программный бюджет', updated: '2026-03-20', status: 'draft', author: 'Финансовая служба' },
    { path: '/public/calendar', title: 'Календарный план', updated: '2026-05-10', status: 'published', author: 'Отдел спортшкол' },
    { path: '/public/announcements', title: 'Объявления', updated: '2026-05-25', status: 'published', author: 'Канцелярия' },
    { path: '/public/services', title: 'Государственные услуги', updated: '2026-04-05', status: 'published', author: 'Отдел делопроизводства' },
    { path: '/public/antidoping', title: 'Антидопинговая деятельность', updated: '2026-03-28', status: 'draft', author: 'Медицинская служба' },
    { path: '/public/anticorruption', title: 'Антикоррупционные меры', updated: '2026-05-08', status: 'published', author: 'Юридический отдел' },
    { path: '/public/reception', title: 'Интернет-приёмная', updated: '2026-05-12', status: 'published', author: 'Канцелярия' },
]

const STATUS_COLOR = {
    published: { bg: '#e8f5e9', fg: '#2e7d32', label: 'Опубликовано' },
    draft: { bg: '#fff3e0', fg: '#ef6c00', label: 'Черновик' },
}

function fmtDate(iso) {
    return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function IntranetCMS() {
    return (
        <div className="intra">
            <div className="intra-page-head">
                <div>
                    <h1 className="intra-page-head__title">Управление контентом веб-сайта</h1>
                    <p className="intra-page-head__sub">
                        Редактирование публичных страниц портала ГАФКиС. Поддерживает быструю публикацию, черновики, версионность и
                        архивирование (Распоряжение №59-р).
                    </p>
                </div>
                <button className="intra-doc__action intra-doc__action--primary">+ Новая страница</button>
            </div>

            <div className="intra-stats-row">
                <div className="intra-stat-card"><div className="intra-stat-card__val">{PAGES.length}</div><div className="intra-stat-card__label">Всего страниц</div></div>
                <div className="intra-stat-card"><div className="intra-stat-card__val">{PAGES.filter(p => p.status === 'published').length}</div><div className="intra-stat-card__label">Опубликовано</div></div>
                <div className="intra-stat-card"><div className="intra-stat-card__val">{PAGES.filter(p => p.status === 'draft').length}</div><div className="intra-stat-card__label">В работе</div></div>
                <div className="intra-stat-card"><div className="intra-stat-card__val">3</div><div className="intra-stat-card__label">Языковые версии</div></div>
            </div>

            <div className="intra-doc-list" style={{ marginTop: 20 }}>
                {PAGES.map(p => {
                    const c = STATUS_COLOR[p.status]
                    return (
                        <div key={p.path} className="intra-doc">
                            <div className="intra-doc__icon">🌐</div>
                            <div className="intra-doc__body">
                                <div className="intra-doc__meta">
                                    <span className="intra-doc__cat">{p.path}</span>
                                    <span>обновил: {p.author}</span>
                                    <span>· {fmtDate(p.updated)}</span>
                                </div>
                                <h3 className="intra-doc__title">{p.title}</h3>
                            </div>
                            <span className="intra-doc__badge" style={{ background: c.bg, color: c.fg }}>{c.label}</span>
                            <button className="intra-doc__action">Редактировать</button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
