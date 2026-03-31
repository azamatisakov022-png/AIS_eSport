import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

/* ═══════════════════════════════════════════════
   DEMO DATA FOR ALL 9 REGIONS
   ═══════════════════════════════════════════════ */
const REGION_DATA = {
    'Бишкек': {
        hint: 'Борьба, бокс, дзюдо · Подробнее →',
        schools: 14,
        topSports: [
            { name: 'Борьба', count: 320 },
            { name: 'Бокс', count: 280 },
            { name: 'Дзюдо', count: 210 },
            { name: 'Тяж. атлетика', count: 145 },
            { name: 'Лёгкая атл.', count: 130 },
        ],
        growth: [820, 910, 1020, 1120, 1245],
        facilities: [
            { name: 'Дворец спорта им. Кожомкула', type: 'Дворец спорта', address: 'ул. Тоголок Молдо, 40', cap: '5 000 мест', icon: '' },
            { name: 'Стадион «Спартак»', type: 'Стадион', address: 'ул. Токтогула, 127', cap: '22 000 мест', icon: '' },
            { name: 'Стадион «Долон Омурзакова»', type: 'Стадион', address: 'ул. Ахунбаева, 97', cap: '30 000 мест', icon: '' },
            { name: 'СДЮШОР №1 по борьбе', type: 'Спортшкола', address: 'ул. Боконбаева, 105', cap: '200 уч.', icon: '' },
            { name: 'Зал бокса «Чемпион»', type: 'Зал', address: 'ул. Жибек Жолу, 414', cap: '120 мест', icon: '' },
            { name: 'Спортшкола олимп. резерва №3', type: 'Спортшкола', address: 'ул. Логвиненко, 26', cap: '350 уч.', icon: '' },
        ],
        athletes: [
            { name: 'Акжол Махмудов', sport: 'Греко-римская борьба', rank: 'МСМК', medals: 12 },
            { name: 'Айсулуу Тыныбекова', sport: 'Вольная борьба', rank: 'ЗМС', medals: 18 },
            { name: 'Эрназар Акматалиев', sport: 'Бокс', rank: 'МС', medals: 8 },
            { name: 'Мээрим Жумабаева', sport: 'Дзюдо', rank: 'МСМК', medals: 9 },
            { name: 'Арген Улуков', sport: 'Тяжёлая атлетика', rank: 'МС', medals: 6 },
            { name: 'Дарика Касымова', sport: 'Лёгкая атлетика', rank: 'КМС', medals: 5 },
        ],
    },
    'Ош': {
        hint: 'Борьба, тяжёлая атлетика, бокс · Подробнее →',
        schools: 8,
        topSports: [
            { name: 'Борьба', count: 180 },
            { name: 'Тяж. атлетика', count: 120 },
            { name: 'Бокс', count: 110 },
            { name: 'Футбол', count: 95 },
            { name: 'Тхэквондо', count: 60 },
        ],
        growth: [410, 460, 510, 570, 620],
        facilities: [
            { name: 'Стадион «Ак-Буура»', type: 'Стадион', address: 'ул. Курманжан Датка, 235', cap: '12 000 мест', icon: '' },
            { name: 'Дворец спорта г. Ош', type: 'Дворец спорта', address: 'ул. Масалиева, 52', cap: '3 000 мест', icon: '' },
            { name: 'СДЮШОР №2 по борьбе', type: 'Спортшкола', address: 'ул. Навои, 28', cap: '180 уч.', icon: '' },
            { name: 'Зал тяжёлой атлетики', type: 'Зал', address: 'ул. Алишера Навои, 12', cap: '80 мест', icon: '' },
            { name: 'Спортшкола олимп. резерва', type: 'Спортшкола', address: 'ул. Ленина, 302', cap: '250 уч.', icon: '' },
        ],
        athletes: [
            { name: 'Жоомарт Эралиев', sport: 'Борьба', rank: 'МСМК', medals: 10 },
            { name: 'Иззат Артыков', sport: 'Тяжёлая атлетика', rank: 'МС', medals: 7 },
            { name: 'Бакыт Сатыбалдиев', sport: 'Бокс', rank: 'МС', medals: 6 },
            { name: 'Нурайым Акматова', sport: 'Тхэквондо', rank: 'КМС', medals: 5 },
            { name: 'Султан Мырзабеков', sport: 'Футбол', rank: 'МС', medals: 3 },
        ],
    },
    'Чуйская обл.': {
        hint: 'Лёгкая атлетика, футбол, борьба · Подробнее →',
        schools: 6,
        topSports: [
            { name: 'Лёгкая атл.', count: 140 },
            { name: 'Футбол', count: 120 },
            { name: 'Борьба', count: 90 },
            { name: 'Волейбол', count: 65 },
            { name: 'Плавание', count: 40 },
        ],
        growth: [310, 350, 390, 430, 480],
        facilities: [
            { name: 'Стадион «Ынтымак»', type: 'Стадион', address: 'г. Токмок, ул. Центральная, 5', cap: '5 000 мест', icon: '' },
            { name: 'Спорткомплекс «Кара-Балта»', type: 'Дворец спорта', address: 'г. Кара-Балта, ул. Спортивная, 1', cap: '2 000 мест', icon: '' },
            { name: 'ДЮСШ г. Токмок', type: 'Спортшкола', address: 'г. Токмок, ул. Ибраимова, 23', cap: '150 уч.', icon: '' },
            { name: 'Стадион «Дордой»', type: 'Стадион', address: 'Аламединский р-н', cap: '10 000 мест', icon: '' },
        ],
        athletes: [
            { name: 'Данияр Кобонов', sport: 'Лёгкая атлетика', rank: 'МС', medals: 6 },
            { name: 'Аскар Жумагулов', sport: 'Футбол', rank: 'МС', medals: 4 },
            { name: 'Нургул Абдиева', sport: 'Борьба', rank: 'КМС', medals: 5 },
            { name: 'Кайрат Бекболотов', sport: 'Волейбол', rank: 'МС', medals: 3 },
            { name: 'Элиза Сагынбаева', sport: 'Плавание', rank: 'КМС', medals: 4 },
        ],
    },
    'Иссык-Куль': {
        hint: 'Плавание, триатлон, борьба · Подробнее →',
        schools: 5,
        topSports: [
            { name: 'Плавание', count: 90 },
            { name: 'Триатлон', count: 55 },
            { name: 'Борьба', count: 70 },
            { name: 'Лёгкая атл.', count: 45 },
            { name: 'Конный спорт', count: 30 },
        ],
        growth: [200, 230, 260, 285, 310],
        facilities: [
            { name: 'Стадион «Каракол»', type: 'Стадион', address: 'г. Каракол, ул. Токтогула, 80', cap: '6 000 мест', icon: '' },
            { name: 'Аквацентр «Иссык-Куль»', type: 'Дворец спорта', address: 'г. Чолпон-Ата, наб. Озёрная', cap: '500 мест', icon: '' },
            { name: 'ДЮСШ «Олимп»', type: 'Спортшкола', address: 'г. Каракол, ул. Ленина, 115', cap: '120 уч.', icon: '' },
            { name: 'Ипподром «Каракол»', type: 'Стадион', address: 'г. Каракол, восточная окраина', cap: '2 000 мест', icon: '' },
        ],
        athletes: [
            { name: 'Нурбек Орозбаев', sport: 'Плавание', rank: 'МС', medals: 7 },
            { name: 'Тилек Жээнбеков', sport: 'Триатлон', rank: 'КМС', medals: 4 },
            { name: 'Адилет Кулуев', sport: 'Борьба', rank: 'МС', medals: 6 },
            { name: 'Айгерим Токтосунова', sport: 'Лёгкая атлетика', rank: 'КМС', medals: 3 },
            { name: 'Бакай Асанбеков', sport: 'Конный спорт', rank: 'МС', medals: 5 },
        ],
    },
    'Нарын': {
        hint: 'Конный спорт, борьба, стрельба · Подробнее →',
        schools: 3,
        topSports: [
            { name: 'Конный спорт', count: 55 },
            { name: 'Борьба', count: 50 },
            { name: 'Стрельба', count: 30 },
            { name: 'Лёгкая атл.', count: 28 },
            { name: 'Бокс', count: 22 },
        ],
        growth: [120, 140, 155, 175, 195],
        facilities: [
            { name: 'Стадион «Нарын»', type: 'Стадион', address: 'г. Нарын, ул. Ленина, 40', cap: '3 000 мест', icon: '' },
            { name: 'Ипподром «Нарын»', type: 'Стадион', address: 'г. Нарын, южная окраина', cap: '3 000 мест', icon: '' },
            { name: 'ДЮСШ г. Нарын', type: 'Спортшкола', address: 'г. Нарын, ул. Манаса, 17', cap: '100 уч.', icon: '' },
            { name: 'Стрелковый тир «Мерген»', type: 'Зал', address: 'г. Нарын, ул. Спортивная, 8', cap: '50 мест', icon: '' },
        ],
        athletes: [
            { name: 'Талгат Мусаев', sport: 'Конный спорт', rank: 'МС', medals: 6 },
            { name: 'Нурлан Борубаев', sport: 'Борьба', rank: 'КМС', medals: 4 },
            { name: 'Кубат Алыбаев', sport: 'Стрельба', rank: 'МС', medals: 5 },
            { name: 'Айдай Токтогулова', sport: 'Лёгкая атлетика', rank: 'КМС', medals: 3 },
            { name: 'Самат Жумабеков', sport: 'Бокс', rank: 'КМС', medals: 2 },
        ],
    },
    'Джалал-Абад': {
        hint: 'Борьба, бокс, тяжёлая атлетика · Подробнее →',
        schools: 6,
        topSports: [
            { name: 'Борьба', count: 110 },
            { name: 'Бокс', count: 85 },
            { name: 'Тяж. атлетика', count: 65 },
            { name: 'Футбол', count: 55 },
            { name: 'Волейбол', count: 40 },
        ],
        growth: [250, 280, 310, 345, 380],
        facilities: [
            { name: 'Стадион «Курулуш»', type: 'Стадион', address: 'г. Джалал-Абад, ул. Ленина, 85', cap: '8 000 мест', icon: '' },
            { name: 'Спортзал «Арсланбоб»', type: 'Зал', address: 'с. Арсланбоб, ул. Центральная', cap: '200 мест', icon: '' },
            { name: 'СДЮШОР по борьбе', type: 'Спортшкола', address: 'г. Джалал-Абад, ул. Токтогула, 32', cap: '160 уч.', icon: '' },
            { name: 'Дворец спорта «Достук»', type: 'Дворец спорта', address: 'г. Джалал-Абад, пр. Манаса, 10', cap: '2 500 мест', icon: '' },
            { name: 'ДЮСШ «Жаштык»', type: 'Спортшкола', address: 'г. Таш-Кумыр, ул. Спортивная, 5', cap: '130 уч.', icon: '' },
        ],
        athletes: [
            { name: 'Уланбек Абдуллаев', sport: 'Борьба', rank: 'МСМК', medals: 9 },
            { name: 'Руслан Мамытов', sport: 'Бокс', rank: 'МС', medals: 7 },
            { name: 'Гулнара Жолдошева', sport: 'Тяжёлая атлетика', rank: 'МС', medals: 5 },
            { name: 'Адис Осмонов', sport: 'Футбол', rank: 'КМС', medals: 3 },
            { name: 'Жылдыз Абдыкалыкова', sport: 'Волейбол', rank: 'КМС', medals: 4 },
        ],
    },
    'Баткен': {
        hint: 'Борьба, бокс, волейбол · Подробнее →',
        schools: 3,
        topSports: [
            { name: 'Борьба', count: 65 },
            { name: 'Бокс', count: 50 },
            { name: 'Волейбол', count: 35 },
            { name: 'Тхэквондо', count: 28 },
            { name: 'Лёгкая атл.', count: 20 },
        ],
        growth: [130, 150, 170, 190, 210],
        facilities: [
            { name: 'Стадион «Баткен»', type: 'Стадион', address: 'г. Баткен, ул. Ленина, 30', cap: '4 000 мест', icon: '' },
            { name: 'ДЮСШ г. Баткен', type: 'Спортшкола', address: 'г. Баткен, ул. Манаса, 12', cap: '100 уч.', icon: '' },
            { name: 'Спортзал «Исфана»', type: 'Зал', address: 'г. Исфана, ул. Центральная, 5', cap: '150 мест', icon: '' },
            { name: 'Стадион «Кызыл-Кия»', type: 'Стадион', address: 'г. Кызыл-Кия, ул. Спортивная', cap: '5 000 мест', icon: '' },
        ],
        athletes: [
            { name: 'Мирлан Рахманов', sport: 'Борьба', rank: 'МС', medals: 6 },
            { name: 'Бекзат Нурматов', sport: 'Бокс', rank: 'КМС', medals: 4 },
            { name: 'Айнура Базарбаева', sport: 'Волейбол', rank: 'МС', medals: 5 },
            { name: 'Тимур Абдуллаев', sport: 'Тхэквондо', rank: 'КМС', medals: 3 },
            { name: 'Зарина Мамасадыкова', sport: 'Лёгкая атлетика', rank: 'КМС', medals: 2 },
        ],
    },
    'Талас': {
        hint: 'Борьба, конный спорт, дзюдо · Подробнее →',
        schools: 3,
        topSports: [
            { name: 'Борьба', count: 50 },
            { name: 'Конный спорт', count: 40 },
            { name: 'Дзюдо', count: 30 },
            { name: 'Бокс', count: 25 },
            { name: 'Лёгкая атл.', count: 18 },
        ],
        growth: [110, 125, 140, 158, 175],
        facilities: [
            { name: 'Стадион «Талас»', type: 'Стадион', address: 'г. Талас, ул. Бердике Баатыра, 70', cap: '5 000 мест', icon: '' },
            { name: 'Мемориал «Манас-Ордо»', type: 'Стадион', address: 'с. Манас-Ордо, Таласский р-н', cap: '1 000 мест', icon: '' },
            { name: 'ДЮСШ г. Талас', type: 'Спортшкола', address: 'г. Талас, ул. Ленина, 45', cap: '90 уч.', icon: '' },
            { name: 'Борцовский зал «Манас»', type: 'Зал', address: 'г. Талас, ул. Спортивная, 3', cap: '100 мест', icon: '' },
        ],
        athletes: [
            { name: 'Канат Аманкулов', sport: 'Борьба', rank: 'МС', medals: 7 },
            { name: 'Айбек Токторбаев', sport: 'Конный спорт', rank: 'МС', medals: 5 },
            { name: 'Нурзат Осмонова', sport: 'Дзюдо', rank: 'КМС', medals: 4 },
            { name: 'Эмир Касымбеков', sport: 'Бокс', rank: 'КМС', medals: 3 },
            { name: 'Бегимай Жумалиева', sport: 'Лёгкая атлетика', rank: 'КМС', medals: 2 },
        ],
    },
    'Ош (обл.)': {
        hint: 'Борьба, бокс, футбол · Подробнее →',
        schools: 4,
        topSports: [
            { name: 'Борьба', count: 75 },
            { name: 'Бокс', count: 55 },
            { name: 'Футбол', count: 40 },
            { name: 'Тяж. атлетика', count: 30 },
            { name: 'Волейбол', count: 22 },
        ],
        growth: [150, 170, 190, 210, 232],
        facilities: [
            { name: 'Стадион «Узген»', type: 'Стадион', address: 'г. Узген, ул. Центральная, 15', cap: '4 000 мест', icon: '' },
            { name: 'Спорткомплекс «Кара-Суу»', type: 'Дворец спорта', address: 'г. Кара-Суу, ул. Манаса, 8', cap: '1 500 мест', icon: '' },
            { name: 'ДЮСШ «Алай»', type: 'Спортшкола', address: 'с. Гульча, Алайский р-н', cap: '80 уч.', icon: '' },
            { name: 'Стадион «Ноокат»', type: 'Стадион', address: 'г. Ноокат, ул. Спортивная', cap: '3 000 мест', icon: '' },
            { name: 'ДЮСШ «Узген»', type: 'Спортшкола', address: 'г. Узген, ул. Токтогула, 22', cap: '120 уч.', icon: '' },
        ],
        athletes: [
            { name: 'Абдималик Ибрагимов', sport: 'Борьба', rank: 'МС', medals: 6 },
            { name: 'Бекболот Сулайманов', sport: 'Бокс', rank: 'КМС', medals: 4 },
            { name: 'Нуржан Абдуллаев', sport: 'Футбол', rank: 'МС', medals: 3 },
            { name: 'Гулзат Исмаилова', sport: 'Тяжёлая атлетика', rank: 'КМС', medals: 3 },
            { name: 'Эрмек Токтобеков', sport: 'Волейбол', rank: 'КМС', medals: 2 },
        ],
    },
}

/* ═══════════════════════════════════════════════
   REGION MODAL COMPONENT
   ═══════════════════════════════════════════════ */
export default function RegionModal({ region, onClose }) {
    const { t } = useTranslation()
    const [tab, setTab] = useState('overview')
    const [facilityFilter, setFacilityFilter] = useState('all')
    const [sportFilter, setSportFilter] = useState('all')
    const d = REGION_DATA[region.name] || {}
    const maxSport = d.topSports?.[0]?.count || 1
    const maxGrowth = Math.max(...(d.growth || [1]))

    // Close on Escape + lock body scroll
    useEffect(() => {
        const fn = e => e.key === 'Escape' && onClose()
        window.addEventListener('keydown', fn)
        document.body.style.overflow = 'hidden'
        return () => {
            window.removeEventListener('keydown', fn)
            document.body.style.overflow = ''
        }
    }, [onClose])

    // Facility types for filter
    const facTypes = ['all', ...new Set((d.facilities || []).map(f => f.type))]
    const filteredFac = facilityFilter === 'all' ? d.facilities : d.facilities?.filter(f => f.type === facilityFilter)

    // Sports for athlete filter
    const sportTypes = ['all', ...new Set((d.athletes || []).map(a => a.sport))]
    const filteredAthl = sportFilter === 'all' ? d.athletes : d.athletes?.filter(a => a.sport === sportFilter)

    return (
        <div style={m.backdrop} onClick={onClose}>
            <div style={m.modal} onClick={e => e.stopPropagation()}>
                {/* ── Header with image ── */}
                <div style={{ ...m.header, backgroundImage: `url(${region.img})` }}>
                    <div style={m.headerOverlay}>
                        <div style={m.headerTitle}>{region.name}</div>
                        <div style={m.headerSub}>{d.hint?.replace(' · Подробнее →', '')}</div>
                    </div>
                    <button style={m.closeBtn} onClick={onClose}>✕</button>
                </div>

                {/* ── Tabs ── */}
                <div style={m.tabBar}>
                    {['overview', 'facilities', 'athletes'].map(tabKey => (
                        <button key={tabKey} style={tab === tabKey ? { ...m.tab, ...m.tabActive } : m.tab}
                                onClick={() => setTab(tabKey)}>
                            {tabKey === 'overview' ? t('public.regionOverview') : tabKey === 'facilities' ? t('public.regionFacilitiesSchools') : t('public.regionAthletesTab')}
                        </button>
                    ))}
                </div>

                {/* ── Content ── */}
                <div style={m.body}>
                    {tab === 'overview' && (
                        <>
                            {/* Stats row */}
                            <div style={m.statsRow}>
                                {[
                                    { val: region.athletes.toLocaleString('ru-RU'), label: t('public.regionAthletesCount') },
                                    { val: region.coaches, label: t('public.regionCoachesCount') },
                                    { val: region.orgs, label: t('public.regionFacilitiesCount') },
                                    { val: d.schools || 0, label: t('public.regionSchoolsCount') },
                                ].map((s, i) => (
                                    <div key={i} style={m.statCard}>
                                        <div style={m.statVal}>{s.val}</div>
                                        <div style={m.statLabel}>{s.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Top 5 sports */}
                            <div style={m.sectionTitle}>{t('public.regionTop5Sports')}</div>
                            <div style={m.barsWrap}>
                                {d.topSports?.map((s, i) => (
                                    <div key={i} style={m.barRow}>
                                        <span style={m.barLabel}>{s.name}</span>
                                        <div style={m.barTrack}>
                                            <div style={{ ...m.barFill, width: `${(s.count / maxSport) * 100}%` }} />
                                        </div>
                                        <span style={m.barVal}>{s.count}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Growth chart */}
                            <div style={m.sectionTitle}>{t('public.regionGrowthTitle')}</div>
                            <div style={m.chartWrap}>
                                {d.growth?.map((v, i) => (
                                    <div key={i} style={m.chartCol}>
                                        <div style={m.chartValLabel}>{v}</div>
                                        <div style={{ ...m.chartBar, height: `${(v / maxGrowth) * 100}%` }} />
                                        <div style={m.chartYear}>{2022 + i}</div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {tab === 'facilities' && (
                        <>
                            <div style={m.pills}>
                                {facTypes.map(ft => (
                                    <button key={ft} style={facilityFilter === ft ? { ...m.pill, ...m.pillActive } : m.pill}
                                            onClick={() => setFacilityFilter(ft)}>{ft === 'all' ? t('public.allFilter') : ft}</button>
                                ))}
                            </div>
                            <div style={m.listWrap}>
                                {filteredFac?.map((f, i) => (
                                    <div key={i} style={m.facCard}>
                                        <div style={m.facIcon}>{f.icon}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={m.facName}>
                                                {f.name}
                                                <span style={m.facBadge}>{f.type}</span>
                                            </div>
                                            <div style={m.facMeta}>{f.address} · {f.cap}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {tab === 'athletes' && (
                        <>
                            <div style={m.pills}>
                                {sportTypes.map(st => (
                                    <button key={st} style={sportFilter === st ? { ...m.pill, ...m.pillActive } : m.pill}
                                            onClick={() => setSportFilter(st)}>{st === 'all' ? t('public.allFilter') : st}</button>
                                ))}
                            </div>
                            <div style={m.listWrap}>
                                {filteredAthl?.map((a, i) => (
                                    <div key={i} style={m.athRow}>
                                        <div style={m.athAvatar}>
                                            {a.name.split(' ').map(w => w[0]).join('')}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={m.athName}>{a.name}</div>
                                            <div style={m.athMeta}>{a.sport} · {a.rank}</div>
                                        </div>
                                        <div style={m.athMedals}>{a.medals}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={m.allLink}>{t('public.regionAllAthletes')}</div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

/* Helper: get initials from name */
export function getRegionHint(regionName) {
    return REGION_DATA[regionName]?.hint || ''
}

/* ═══════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════ */
const m = {
    /* Backdrop */
    backdrop: {
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'rmFadeIn 0.25s ease',
    },
    modal: {
        width: '90%', maxWidth: 800,
        background: '#ffffff', borderRadius: 16,
        overflow: 'hidden', maxHeight: '90vh',
        display: 'flex', flexDirection: 'column',
        animation: 'rmSlideUp 0.25s ease',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
    },

    /* Header */
    header: {
        position: 'relative', height: 120,
        backgroundSize: 'cover', backgroundPosition: 'center',
    },
    headerOverlay: {
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.15))',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '16px 24px',
    },
    headerTitle: { fontSize: 20, fontWeight: 600, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.4)' },
    headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
    closeBtn: {
        position: 'absolute', top: 10, right: 10,
        width: 32, height: 32, borderRadius: '50%',
        background: 'rgba(255,255,255,0.25)', border: 'none',
        color: '#fff', fontSize: 16, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
    },

    /* Tabs */
    tabBar: {
        display: 'flex', gap: 0,
        background: '#f2f2f7', borderRadius: 10, padding: 3,
        margin: '14px 20px 0',
    },
    tab: {
        flex: 1, padding: '8px 12px', borderRadius: 8,
        border: 'none', background: 'transparent',
        fontSize: 13, fontWeight: 500, color: '#86868b',
        fontFamily: 'inherit', cursor: 'pointer',
        transition: 'all 0.2s', outline: 'none',
    },
    tabActive: {
        background: '#ffffff', color: '#1d1d1f',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    },

    /* Body */
    body: { flex: 1, overflowY: 'auto', padding: '16px 20px 20px' },

    /* Stats */
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 },
    statCard: {
        background: '#F5F5F7', borderRadius: 12, padding: '12px 10px', textAlign: 'center',
    },
    statVal: { fontSize: 20, fontWeight: 600, color: '#1B3A6B' },
    statLabel: { fontSize: 11, color: '#86868b', marginTop: 2 },

    /* Section title */
    sectionTitle: { fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 10 },

    /* Bars */
    barsWrap: { marginBottom: 20 },
    barRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 },
    barLabel: { width: 80, fontSize: 12, color: '#6e6e73', flexShrink: 0 },
    barTrack: { flex: 1, height: 8, background: '#E8E8ED', borderRadius: 4, overflow: 'hidden' },
    barFill: {
        height: '100%', borderRadius: 4,
        background: 'linear-gradient(90deg, #1B3A6B, #3B7DD8)',
        transition: 'width 0.6s ease',
    },
    barVal: { width: 36, fontSize: 12, fontWeight: 600, color: '#1B3A6B', textAlign: 'right' },

    /* Chart */
    chartWrap: {
        display: 'flex', alignItems: 'flex-end', gap: 12,
        height: 120, padding: '0 10px',
    },
    chartCol: {
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        height: '100%', justifyContent: 'flex-end',
    },
    chartValLabel: { fontSize: 11, fontWeight: 600, color: '#1B3A6B', marginBottom: 4 },
    chartBar: {
        width: '100%', maxWidth: 40, borderRadius: '6px 6px 0 0',
        background: 'linear-gradient(180deg, #3B7DD8, #1B3A6B)',
        transition: 'height 0.6s ease',
    },
    chartYear: { fontSize: 11, color: '#86868b', marginTop: 6 },

    /* Pills */
    pills: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
    pill: {
        padding: '5px 12px', borderRadius: 16, border: '1px solid #d2d2d7',
        background: '#ffffff', fontSize: 12, color: '#6e6e73',
        fontFamily: 'inherit', cursor: 'pointer', outline: 'none',
        transition: 'all 0.15s',
    },
    pillActive: {
        background: '#1B3A6B', color: '#fff', borderColor: '#1B3A6B',
    },

    /* List */
    listWrap: { display: 'flex', flexDirection: 'column', gap: 8 },

    /* Facility card */
    facCard: {
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 12px', borderRadius: 12,
        background: '#F5F5F7', cursor: 'pointer',
        transition: 'background 0.15s',
    },
    facIcon: {
        width: 36, height: 36, borderRadius: 10,
        background: '#1B3A6B', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, flexShrink: 0,
    },
    facName: { fontSize: 13, fontWeight: 500, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: 8 },
    facBadge: {
        fontSize: 10, padding: '2px 8px', borderRadius: 10,
        background: 'rgba(27,58,107,0.1)', color: '#1B3A6B', fontWeight: 600, whiteSpace: 'nowrap',
    },
    facMeta: { fontSize: 11, color: '#86868b', marginTop: 2 },

    /* Athlete row */
    athRow: {
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 12px', borderRadius: 12,
        background: '#F5F5F7',
    },
    athAvatar: {
        width: 36, height: 36, borderRadius: '50%',
        background: '#D1D5DB', color: '#6B7280',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 600, flexShrink: 0,
    },
    athName: { fontSize: 13, fontWeight: 500, color: '#1a1a1a' },
    athMeta: { fontSize: 11, color: '#86868b', marginTop: 1 },
    athMedals: { fontSize: 12, fontWeight: 600, color: '#1B3A6B', whiteSpace: 'nowrap' },

    /* All link */
    allLink: {
        textAlign: 'center', fontSize: 13, color: '#1B3A6B',
        fontWeight: 500, marginTop: 14, cursor: 'pointer',
    },
}
