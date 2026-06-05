/**
 * Assistant response engine.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  SINGLE SWAP POINT for the real LLM.                                  │
 * │                                                                       │
 * │  Right now askAssistant() runs a local rule-based engine over the     │
 * │  knowledge base - no network, works offline, looks alive for demos.   │
 * │                                                                       │
 * │  To go live with a real model later, replace the body of              │
 * │  askAssistant() with a single backend call (example commented below). │
 * │  The UI (AiAssistant.jsx) never changes - it only depends on the      │
 * │  {text, links, suggestions} shape returned here.                      │
 * └─────────────────────────────────────────────────────────────────────┘
 */

import { PUBLIC_SECTIONS, INTERNAL_SECTIONS, GOV_SERVICES, FACTS } from './knowledgeBase'

/**
 * Ask the assistant.
 * @param {string} message              user's message
 * @param {object} opts
 * @param {'public'|'internal'} opts.context  which portal the user is on
 * @returns {Promise<{text:string, links?:Array<{label:string,to:string}>, suggestions?:string[]}>}
 */
export async function askAssistant(message, { context = 'public' } = {}) {
    // Simulate "thinking" latency so the typing indicator feels natural.
    await delay(380 + Math.random() * 420)

    // ── FUTURE: real LLM via backend proxy (one-line swap) ──────────────
    // const res = await fetch('/api/assistant/chat', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ message, context }),
    // })
    // if (!res.ok) throw new Error('assistant_unavailable')
    // return await res.json()   // backend returns { text, links, suggestions }
    // ────────────────────────────────────────────────────────────────────

    return ruleBasedResponse(message, context)
}

function delay(ms) {
    return new Promise(r => setTimeout(r, ms))
}

const norm = (s) => (s || '').toLowerCase().replace(/ё/g, 'е').trim()

const SECTIONS = (context) => (context === 'internal' ? INTERNAL_SECTIONS : PUBLIC_SECTIONS)

/* Find a section whose label keywords appear in the message. */
function matchSection(msg, context) {
    const m = norm(msg)
    let best = null
    for (const sec of SECTIONS(context)) {
        for (const label of sec.labels) {
            if (m.includes(norm(label))) {
                if (!best || label.length > best.matchLen) {
                    best = { sec, matchLen: label.length }
                }
            }
        }
    }
    return best?.sec || null
}

function has(msg, ...keys) {
    const m = norm(msg)
    return keys.some(k => m.includes(norm(k)))
}

/* ───────────────────────── RULE-BASED CORE ───────────────────────── */
function ruleBasedResponse(message, context) {
    const m = norm(message)

    /* Greeting */
    if (has(m, 'привет', 'здравств', 'салам', 'hello', 'hi', 'добрый') && m.length < 25) {
        return {
            text: 'Здравствуйте! Я цифровой помощник АИС eSport. Помогу найти нужный раздел, расскажу про государственные услуги и проверку документов. Что вас интересует?',
            suggestions: context === 'internal'
                ? ['Где реестр спортсменов?', 'Как обработать заявку?', 'Открыть аналитику']
                : ['Как подать заявку на звание?', 'Где проверить документ?', 'Найти спортсмена'],
        }
    }

    /* Gratitude */
    if (has(m, 'спасибо', 'благодар', 'рахмат', 'thank')) {
        return { text: 'Пожалуйста! Обращайтесь, если понадобится что-то ещё. 🙂' }
    }

    /* Document verification */
    if (has(m, 'проверить документ', 'подлинност', 'qr', 'верифик', 'действителен ли', 'текшер')) {
        return {
            text: `${FACTS.verify} Введите номер документа - система покажет статус: действителен, не найден или недействителен.`,
            links: [{ label: 'Перейти к проверке документа', to: '/public/verify' }],
            suggestions: ['Какие документы можно проверить?', 'Где взять номер документа?'],
        }
    }

    /* Trainer registration */
    if (has(m, 'регистрац тренер', 'стать тренером', 'тренерск', 'свидетельство тренер') ||
        (has(m, 'тренер') && has(m, 'регистр', 'докумен', 'подать', 'заявк'))) {
        const s = GOV_SERVICES.find(x => x.key === 'trainerReg')
        return {
            text: `Для регистрации тренера нужны документы:\n• ${s.documents.join('\n• ')}\n\nСрок рассмотрения - ${s.deadline}. ${s.note}`,
            links: [{ label: 'Открыть форму регистрации тренера', to: s.to }],
            suggestions: ['Как подать заявку на звание?', 'Где проверить готовность?'],
        }
    }

    /* Award application */
    if (has(m, 'звание', 'разряд', 'присвоен', 'кмс', 'мастер спорта', 'награда')) {
        const s = GOV_SERVICES.find(x => x.key === 'awardApp')
        return {
            text: `Заявка на присвоение спортивного звания/разряда. Сроки рассмотрения: ${s.deadline}.\nКоличество документов:\n• ${s.documents.join('\n• ')}\n${s.note}`,
            links: [{ label: 'Открыть форму заявки на звание', to: s.to }],
            suggestions: ['Какие документы для группы А?', 'Сколько времени рассматривают?'],
        }
    }

    /* Government services overview */
    if (has(m, 'госуслуг', 'услуг', 'какие услуги', 'кызмат')) {
        return {
            text: 'ГАФКиС предоставляет онлайн-услуги:\n• Регистрация тренера (свидетельство)\n• Присвоение спортивного звания/разряда\n• Присвоение судейской категории\n\nВсе услуги доступны онлайн с загрузкой документов.',
            links: [
                { label: 'Все государственные услуги', to: '/public/services' },
                { label: 'Регистрация тренера', to: '/public/trainer-registration' },
                { label: 'Заявка на звание', to: '/public/award-application' },
            ],
        }
    }

    /* Login / cabinet */
    if (has(m, 'вход', 'войти', 'логин', 'кабинет', 'авториз', 'кирүү', 'login', 'зарегистр')) {
        return {
            text: 'Войти в личный кабинет можно через форму входа: по email и паролю либо через СМЭВ Түндүк ЕСИ. Для спортсменов, тренеров и судей доступен личный кабинет, для сотрудников - внутренний портал.',
            links: [{ label: 'Перейти ко входу', to: '/public/login' }],
        }
    }

    /* Languages */
    if (has(m, 'язык', 'тил', 'language', 'кыргызс', 'русск', 'english', 'английск')) {
        return {
            text: `Портал доступен на ${FACTS.languages.join(', ')}. Переключить язык можно в верхней панели сайта (кнопки RU / KG / EN).`,
        }
    }

    /* Accessibility */
    if (has(m, 'слабовид', 'инвалид', 'доступност', 'контраст', 'крупный шрифт', 'accessibility')) {
        return { text: FACTS.accessibility }
    }

    /* Contacts / about */
    if (has(m, 'контакт', 'телефон', 'адрес', 'почта', 'email', 'связ', 'где находит', 'о гафкис', 'агентство')) {
        return {
            text: `${FACTS.contacts.org}.\nАдрес: ${FACTS.contacts.address}\nEmail: ${FACTS.contacts.email}`,
            links: [{ label: 'Подробнее о ГАФКиС', to: '/public/about' }],
        }
    }

    /* Direct section match (navigation) */
    const sec = matchSection(message, context)
    if (sec) {
        const base = context === 'internal' ? '' : ''
        return {
            text: `Раздел «${sec.title}» - ${navHint(sec.key, context)} Открыть?`,
            links: [{ label: `Открыть «${sec.title}»`, to: sec.to }],
            suggestions: relatedSuggestions(sec.key, context),
        }
    }

    /* "where / how to find" without a specific section */
    if (has(m, 'где', 'найти', 'как открыть', 'покажи', 'куда', 'раздел')) {
        return {
            text: 'Подскажите, что именно нужно найти - например: спортсмены, тренеры, судьи, мероприятия, организации, спортивные объекты, проверка документа или государственные услуги.',
            suggestions: context === 'internal'
                ? ['Реестр спортсменов', 'Заявки на звания', 'Аналитика']
                : ['Спортсмены', 'Мероприятия', 'Спортобъекты', 'Госуслуги'],
        }
    }

    /* Fallback - honest about scope + helpful menu */
    return {
        text: 'Пока я отвечаю на вопросы про навигацию по порталу, государственные услуги и проверку документов. Скоро смогу больше. Выберите тему или переформулируйте вопрос:',
        suggestions: context === 'internal'
            ? ['Где реестр судей?', 'Как обработать заявку тренера?', 'Открыть аналитику', 'Настройки']
            : ['Как стать тренером?', 'Подать на звание', 'Проверить документ', 'Найти спортобъект'],
    }
}

function navHint(key, context) {
    const hints = {
        athletes: 'единый реестр спортсменов с фильтрами по виду спорта, разряду и региону.',
        coaches: 'реестр тренеров с поиском по специализации и организации.',
        judges: 'реестр судей с категориями и видами спорта.',
        events: 'все спортивные мероприятия с фильтрами по типу и виду спорта.',
        facilities: 'спортивные объекты на карте Кыргызстана с адресами и контактами.',
        organizations: 'спортивные федерации, клубы и школы.',
        schools: 'спортивные школы (ДЮСШ, СДЮШОР, УОР).',
        teams: 'сборные команды Кыргызстана.',
        verify: 'проверка подлинности документа по номеру или QR-коду.',
        services: 'каталог государственных онлайн-услуг.',
        analytics: 'KPI и аналитика по показателям спортивной отрасли.',
        awardApps: 'обработка заявок на присвоение, лишение и восстановление званий.',
        trainerApps: 'обработка заявок на регистрацию тренеров.',
    }
    return hints[key] || 'нужная информация здесь.'
}

function relatedSuggestions(key, context) {
    if (context === 'internal') {
        return ['Открыть аналитику', 'Заявки на рассмотрении', 'Дашборд']
    }
    const map = {
        athletes: ['Найти тренера', 'Мероприятия', 'Проверить документ'],
        coaches: ['Стать тренером', 'Реестр спортсменов'],
        events: ['Календарный план', 'Спортобъекты'],
        facilities: ['Организации', 'Спортивные школы'],
        verify: ['Госуслуги', 'Как подать заявку'],
        services: ['Регистрация тренера', 'Заявка на звание'],
    }
    return map[key] || ['Госуслуги', 'Проверить документ', 'Мероприятия']
}
