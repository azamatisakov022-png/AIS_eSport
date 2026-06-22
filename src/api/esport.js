// Клиент API АИС eSport (Spring Boot, контекст /api - проксируется Vite на :8082).
// Прототип: для внутренних эндпоинтов используется демо-вход superadmin/password123.

const BASE = '/api'
const DEMO = { usernameOrEmail: 'superadmin', password: 'password123' }
const TOKEN_KEY = 'esport_token'

let token = (typeof localStorage !== 'undefined' && localStorage.getItem(TOKEN_KEY)) || null

async function login() {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(DEMO),
  })
  if (!res.ok) throw new Error('Не удалось авторизоваться в API')
  const data = await res.json()
  token = data.accessToken
  try { localStorage.setItem(TOKEN_KEY, token) } catch { /* ignore */ }
  return token
}

async function authFetch(path, opts = {}, retry = true) {
  if (!token) await login()
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(opts.headers || {}) },
  })
  if (res.status === 401 && retry) {
    token = null
    return authFetch(path, opts, false)
  }
  if (!res.ok) {
    let msg = `Ошибка ${res.status}`
    try { msg = (await res.json()).message || msg } catch { /* ignore */ }
    throw new Error(msg)
  }
  return res.status === 204 ? null : res.json()
}

async function publicFetch(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`Ошибка ${res.status}`)
  return res.json()
}

// ── Маппинг бэкенд → форма UI ──────────────────────────────────────────────
const MED_BADGE = {
  valid: { label: 'Действует', cls: 'ath-badge--green', key: 'valid' },
  expiring: { label: 'Истекает', cls: 'ath-badge--orange', key: 'expiring' },
  expired: { label: 'Истёк', cls: 'ath-badge--red', key: 'expired' },
  unknown: { label: '-', cls: '', key: 'unknown' },
}
const medBadge = (s) => MED_BADGE[s] || MED_BADGE.unknown

export function mapAthlete(a) {
  return {
    id: a.id,
    name: a.fullName,
    birth: a.birthDate,
    sex: a.sex === 'FEMALE' ? 'Ж' : 'М',
    phone: a.phone || '',
    email: a.email || '',
    region: a.region || '',
    sport: a.sport || '',
    rank: a.rank || '',
    coach: a.coachName || '-',
    org: a.organizationName || '-',
    team: a.teamName || null,
    medExp: a.medExpDate || null,
    medIssued: a.medIssuedDate || null,
    medBy: a.medIssuedBy || '-',
    insExp: a.insExpDate || null,
    _med: medBadge(a.medStatus),
    _ins: medBadge(a.insStatus),
    verificationStatus: a.verificationStatus,
    verificationStatusLabel: a.verificationStatusLabel,
    lifecycleStatus: a.lifecycleStatus,
    lifecycleStatusLabel: a.lifecycleStatusLabel,
    statusNote: a.statusNote || '',
    medals: (a.medals || []).map(m => ({ m: m.medalType, e: m.eventName, y: m.year, c: m.country })),
    docs: [],
  }
}

// ── Реестр (внутренний портал) ──────────────────────────────────────────────
export const athletesApi = {
  async list({ search, sport, rank, region, medStatus, verification, size = 100 } = {}) {
    const p = new URLSearchParams()
    if (search) p.set('search', search)
    if (sport) p.set('sport', sport)
    if (rank) p.set('rank', rank)
    if (region) p.set('region', region)
    if (medStatus && medStatus !== 'all') p.set('medStatus', medStatus)
    if (verification) p.set('verification', verification)
    p.set('size', size)
    const data = await authFetch(`/athletes?${p.toString()}`)
    return { items: (data.content || []).map(mapAthlete), total: data.totalElements }
  },
  async create(payload) {
    return authFetch('/athletes', { method: 'POST', body: JSON.stringify(payload) })
  },
  submit(id) { return authFetch(`/athletes/${id}/submit`, { method: 'POST' }) },
  verify(id) { return authFetch(`/athletes/${id}/verify`, { method: 'POST' }) },
  reject(id, reason) { return authFetch(`/athletes/${id}/reject`, { method: 'POST', body: JSON.stringify({ status: 'REJECTED', reason }) }) },
  lifecycle(id, status, reason) { return authFetch(`/athletes/${id}/lifecycle`, { method: 'POST', body: JSON.stringify({ status, reason }) }) },
}

// ── Заявления на звание/разряд ──────────────────────────────────────────────
export const awardsApi = {
  async list({ search, group, status, size = 100 } = {}) {
    const p = new URLSearchParams()
    if (search) p.set('search', search)
    if (group) p.set('group', group)
    if (status) p.set('status', status)
    p.set('size', size)
    const data = await authFetch(`/award-applications?${p.toString()}`)
    return { items: data.content || [], total: data.totalElements }
  },
  get(id) { return authFetch(`/award-applications/${id}`) },
  create(payload) { return authFetch('/award-applications', { method: 'POST', body: JSON.stringify(payload) }) },
  changeStatus(id, status, reason) {
    return authFetch(`/award-applications/${id}/status`, { method: 'PUT', body: JSON.stringify({ status, reason }) })
  },
}

// Переходы статуса заявки определяет бэкенд (поле nextStatuses в ответе),
// т.к. они зависят от трека звания (прямой / комиссия / Кабинет Министров).

// ── Судьи: реестр и заявки на категорию ─────────────────────────────────────
export function mapJudge(j) {
  return {
    id: j.id,
    name: j.fullName,
    cert: j.certNumber || '—',
    category: j.category || '—',
    sports: j.sports || [],
    region: j.region || '—',
    endDate: j.endDate || null,
    annulled: !!j.annulled,
    // детальные поля (могут отсутствовать в списочном ответе / у судьи из заявки)
    birth: j.birthDate || null,
    sex: j.sex === 'FEMALE' ? 'Ж' : (j.sex === 'MALE' ? 'М' : ''),
    phone: j.phone || '',
    email: j.email || '',
    attestDate: j.attestDate || null,
    org: j.organizationName || '—',
  }
}

export const judgesApi = {
  async list({ search, category, sport, region, status, size = 200 } = {}) {
    const p = new URLSearchParams()
    if (search) p.set('search', search)
    if (category) p.set('category', category)
    if (sport) p.set('sport', sport)
    if (region) p.set('region', region)
    if (status && status !== 'all') p.set('status', status)
    p.set('size', size)
    const data = await authFetch(`/judges?${p.toString()}`)
    return { items: (data.content || []).map(mapJudge), total: data.totalElements }
  },
  get(id) { return authFetch(`/judges/${id}`).then(mapJudge) },
}

export const judgeAppsApi = {
  async list({ search, category, status, size = 100 } = {}) {
    const p = new URLSearchParams()
    if (search) p.set('search', search)
    if (category) p.set('category', category)
    if (status) p.set('status', status)
    p.set('size', size)
    const data = await authFetch(`/judge-applications?${p.toString()}`)
    return { items: data.content || [], total: data.totalElements }
  },
  get(id) { return authFetch(`/judge-applications/${id}`) },
  create(payload) { return authFetch('/judge-applications', { method: 'POST', body: JSON.stringify(payload) }) },
  changeStatus(id, status, reason) {
    return authFetch(`/judge-applications/${id}/status`, { method: 'PUT', body: JSON.stringify({ status, reason }) })
  },
}

// ── Публичный портал ────────────────────────────────────────────────────────
export const publicApi = {
  async athletes({ size = 200 } = {}) {
    const data = await publicFetch(`/public/athletes?size=${size}`)
    return (data.content || []).map(mapAthlete)
  },
  async athlete(id) {
    return mapAthlete(await publicFetch(`/public/athletes/${id}`))
  },
}

// Статусы для фильтров/действий
export const VERIFICATION = [
  { code: 'DRAFT', label: 'Черновик' },
  { code: 'IN_REVIEW', label: 'На проверке' },
  { code: 'VERIFIED', label: 'Подтверждено' },
  { code: 'REJECTED', label: 'Отклонено' },
]
export const LIFECYCLE = [
  { code: 'ACTIVE', label: 'Активный' },
  { code: 'INACTIVE', label: 'Временно не участвует' },
  { code: 'SUSPENDED', label: 'Приостановлен' },
  { code: 'DISQUALIFIED', label: 'Дисквалифицирован' },
  { code: 'RETIRED', label: 'Завершил карьеру' },
  { code: 'EXCLUDED', label: 'Исключён' },
]
