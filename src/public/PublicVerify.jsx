import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { publicApi } from '../api/esport'

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('ru-RU') : null

function ShieldIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}

function QrIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="6" height="6" rx="1.2" />
            <rect x="15" y="3" width="6" height="6" rx="1.2" />
            <rect x="3" y="15" width="6" height="6" rx="1.2" />
            <path d="M15 15h3" />
            <path d="M18 12v9" />
            <path d="M21 15v6" />
            <path d="M15 18h3" />
        </svg>
    )
}

function ResultRow({ label, value }) {
    return (
        <div className="verifyx-result__row">
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    )
}

export default function PublicVerify() {
    const { t } = useTranslation()
    const [code, setCode] = useState('')
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleVerify = async () => {
        const c = code.trim()
        if (!c || loading) return
        setLoading(true)
        try {
            const r = await publicApi.verify(c)
            setResult({
                found: r.found,
                valid: r.valid,
                status: r.statusLabel,
                reason: r.reason,
                docType: r.docType,
                holder: r.holder,
                number: r.code,
                issued: fmtDate(r.issued) || '—',
                validUntil: fmtDate(r.validUntil) || 'Бессрочно',
                extra: r.extra,
                issuedBy: 'ГАФКиС Кыргызской Республики',
            })
        } catch {
            setResult({ found: false })
        }
        setLoading(false)
    }

    return (
        <div className="pub-section">
            <div className="pub-container">
                <div className="verifyx-hero">
                    <div className="verifyx-hero__badge">
                        <ShieldIcon />
                        {t('public.breadcrumbVerify', { defaultValue: 'Проверка документов' })}
                    </div>
                    <h1 className="verifyx-hero__title">{t('public.verifyDocTitle')}</h1>
                    <p className="verifyx-hero__desc">{t('public.verifyDocDesc')}</p>
                </div>

                <div className="verifyx-layout">
                    <section className="verifyx-card">
                        <div className="verifyx-card__head">
                            <div className="verifyx-icon">
                                <QrIcon />
                            </div>
                            <div>
                                <div className="verifyx-card__eyebrow">{t('public.verifyBtn', { defaultValue: 'Проверить' })}</div>
                                <div className="verifyx-card__title">{t('public.verifyDocInputPlaceholder', { defaultValue: 'Введите код документа' })}</div>
                            </div>
                        </div>

                        <div className="verifyx-input-group">
                            <input
                                className="verifyx-input"
                                type="text"
                                placeholder={t('public.verifyDocInputPlaceholder')}
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                            />
                            <button className="verifyx-btn" onClick={handleVerify} disabled={loading}>
                                {loading ? 'Проверка…' : t('public.verifyBtn')}
                            </button>
                        </div>

                        <p className="verifyx-hint">
                            Введите номер удостоверения, свидетельства или аккредитации (например, УД-КР-2026-0001).
                            Сведения о действительности и причинах отзыва доступны всем.
                        </p>

                        {/* Действителен */}
                        {result && result.found && result.valid && (
                            <div className="verifyx-result verifyx-result--success">
                                <div className="verifyx-result__status">{result.status || t('public.verifyDocFound')}</div>
                                <div className="verifyx-result__grid">
                                    <ResultRow label={t('public.verifyDocTypeLabel')} value={result.docType} />
                                    <ResultRow label={t('public.verifyDocOwner')} value={result.holder} />
                                    <ResultRow label={t('public.verifyDocNumberLabel')} value={result.number} />
                                    {result.extra && <ResultRow label="Сведения" value={result.extra} />}
                                    <ResultRow label={t('public.verifyDocIssuedDate')} value={result.issued} />
                                    <ResultRow label={t('public.verifyDocValidUntil')} value={result.validUntil} />
                                    <ResultRow label={t('public.verifyDocIssuedBy')} value={result.issuedBy} />
                                </div>
                            </div>
                        )}

                        {/* Найден, но недействителен / приостановлен — причина видна всем (№14) */}
                        {result && result.found && !result.valid && (
                            <div className="verifyx-result verifyx-result--error">
                                <div className="verifyx-result__status">{result.status}</div>
                                <div className="verifyx-result__grid">
                                    <ResultRow label={t('public.verifyDocTypeLabel')} value={result.docType} />
                                    <ResultRow label={t('public.verifyDocOwner')} value={result.holder} />
                                    <ResultRow label={t('public.verifyDocNumberLabel')} value={result.number} />
                                </div>
                                {result.reason && (
                                    <p className="verifyx-result__text" style={{ marginTop: 10 }}>
                                        <strong>Причина:</strong> {result.reason}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Не найден */}
                        {result && !result.found && (
                            <div className="verifyx-result verifyx-result--error">
                                <div className="verifyx-result__status">{t('public.verifyDocNotFoundTitle')}</div>
                                <p className="verifyx-result__text">{result.reason || t('public.verifyDocNotFoundDesc')}</p>
                            </div>
                        )}
                    </section>

                    <aside className="verifyx-side">
                        <div className="verifyx-side__card">
                            <div className="verifyx-side__title">{t('public.verifyHowItWorks', { defaultValue: 'Как это работает' })}</div>
                            <div className="verifyx-side__list">
                                <div className="verifyx-side__item">
                                    <span>1</span>
                                    <p>{t('public.verifyStepOne', { defaultValue: 'Введите номер документа или отсканируйте QR-код.' })}</p>
                                </div>
                                <div className="verifyx-side__item">
                                    <span>2</span>
                                    <p>{t('public.verifyStepTwo', { defaultValue: 'Система сверит данные с публичным реестром АИС eSport.' })}</p>
                                </div>
                                <div className="verifyx-side__item">
                                    <span>3</span>
                                    <p>{t('public.verifyStepThree', { defaultValue: 'На экране сразу отобразится результат проверки и реквизиты документа.' })}</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                <style>{`
                    .verifyx-hero {
                        margin-bottom: 24px;
                        padding: 28px 32px;
                        border-radius: 24px;
                        background: linear-gradient(135deg, rgba(18, 35, 61, 0.96), rgba(28, 63, 107, 0.92));
                        color: #fff;
                        box-shadow: 0 24px 60px rgba(15, 23, 42, 0.16);
                    }
                    .verifyx-hero__badge {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        padding: 8px 12px;
                        border-radius: 999px;
                        background: rgba(255, 255, 255, 0.12);
                        border: 1px solid rgba(255, 255, 255, 0.14);
                        font-size: 11px;
                        font-weight: 700;
                        letter-spacing: 0.08em;
                        text-transform: uppercase;
                        color: rgba(255, 255, 255, 0.88);
                    }
                    .verifyx-hero__title {
                        margin: 16px 0 10px;
                        font-size: clamp(30px, 4vw, 44px);
                        line-height: 1.04;
                        letter-spacing: -0.04em;
                        font-weight: 800;
                    }
                    .verifyx-hero__desc {
                        margin: 0;
                        max-width: 760px;
                        font-size: 15px;
                        line-height: 1.75;
                        color: rgba(255, 255, 255, 0.78);
                    }
                    .verifyx-layout {
                        display: grid;
                        grid-template-columns: minmax(0, 1.6fr) minmax(280px, 0.8fr);
                        gap: 20px;
                        align-items: start;
                    }
                    .verifyx-card,
                    .verifyx-side__card {
                        background: var(--theme-bg-card);
                        border: 1px solid var(--theme-border);
                        border-radius: 20px;
                        box-shadow: 0 12px 32px rgba(15, 23, 42, 0.06);
                    }
                    .verifyx-card {
                        padding: 24px;
                    }
                    .verifyx-side__card {
                        padding: 22px;
                    }
                    .verifyx-card__head {
                        display: flex;
                        align-items: center;
                        gap: 14px;
                        margin-bottom: 20px;
                    }
                    .verifyx-icon {
                        width: 52px;
                        height: 52px;
                        border-radius: 16px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: rgba(27, 58, 107, 0.08);
                        color: #1B3A6B;
                        flex-shrink: 0;
                    }
                    .verifyx-card__eyebrow {
                        font-size: 11px;
                        font-weight: 700;
                        letter-spacing: 0.08em;
                        text-transform: uppercase;
                        color: var(--theme-text-secondary);
                        margin-bottom: 6px;
                    }
                    .verifyx-card__title {
                        font-size: 20px;
                        line-height: 1.2;
                        font-weight: 700;
                        color: var(--theme-text-main);
                    }
                    .verifyx-input-group {
                        display: grid;
                        grid-template-columns: minmax(0, 1fr) auto;
                        gap: 12px;
                    }
                    .verifyx-input {
                        min-width: 0;
                        height: 54px;
                        padding: 0 18px;
                        border-radius: 16px;
                        border: 1px solid var(--theme-border);
                        background: var(--theme-bg-main);
                        color: var(--theme-text-main);
                        font: inherit;
                        font-size: 15px;
                        outline: none;
                        transition: border-color 0.2s ease, box-shadow 0.2s ease;
                    }
                    .verifyx-input::placeholder {
                        color: var(--theme-text-secondary);
                    }
                    .verifyx-input:focus {
                        border-color: rgba(27, 58, 107, 0.42);
                        box-shadow: 0 0 0 4px rgba(27, 58, 107, 0.08);
                    }
                    .verifyx-btn {
                        height: 54px;
                        padding: 0 22px;
                        border: none;
                        border-radius: 16px;
                        background: #102a43;
                        color: #fff;
                        font: inherit;
                        font-size: 14px;
                        font-weight: 700;
                        cursor: pointer;
                        transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
                        box-shadow: 0 12px 24px rgba(16, 42, 67, 0.18);
                    }
                    .verifyx-btn:hover {
                        background: #0b2033;
                        transform: translateY(-1px);
                    }
                    .verifyx-hint {
                        margin: 12px 0 0;
                        font-size: 13px;
                        line-height: 1.6;
                        color: var(--theme-text-secondary);
                    }
                    .verifyx-result {
                        margin-top: 18px;
                        padding: 18px;
                        border-radius: 18px;
                        border: 1px solid var(--theme-border);
                    }
                    .verifyx-result--success {
                        background: linear-gradient(180deg, rgba(34, 197, 94, 0.08), rgba(255, 255, 255, 0.96));
                    }
                    .verifyx-result--error {
                        background: linear-gradient(180deg, rgba(239, 68, 68, 0.08), rgba(255, 255, 255, 0.96));
                        border-color: rgba(239, 68, 68, 0.18);
                    }
                    .verifyx-result__status,
                    .verifyx-side__title {
                        font-size: 17px;
                        line-height: 1.3;
                        font-weight: 700;
                        color: var(--theme-text-main);
                        margin-bottom: 14px;
                    }
                    .verifyx-result__grid {
                        display: grid;
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                        gap: 12px;
                    }
                    .verifyx-result__row {
                        padding: 14px;
                        border-radius: 14px;
                        background: rgba(255, 255, 255, 0.76);
                        border: 1px solid rgba(148, 163, 184, 0.16);
                    }
                    .verifyx-result__row span {
                        display: block;
                        margin-bottom: 6px;
                        font-size: 11px;
                        font-weight: 700;
                        letter-spacing: 0.06em;
                        text-transform: uppercase;
                        color: var(--theme-text-secondary);
                    }
                    .verifyx-result__row strong {
                        display: block;
                        font-size: 14px;
                        line-height: 1.5;
                        color: var(--theme-text-main);
                    }
                    .verifyx-result__text {
                        margin: 0;
                        font-size: 14px;
                        line-height: 1.7;
                        color: var(--theme-text-secondary);
                    }
                    .verifyx-side__list {
                        display: grid;
                        gap: 12px;
                    }
                    .verifyx-side__item {
                        display: grid;
                        grid-template-columns: 32px minmax(0, 1fr);
                        gap: 12px;
                        align-items: start;
                    }
                    .verifyx-side__item span {
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        background: rgba(27, 58, 107, 0.08);
                        color: #1B3A6B;
                        font-size: 13px;
                        font-weight: 800;
                    }
                    .verifyx-side__item p {
                        margin: 4px 0 0;
                        font-size: 14px;
                        line-height: 1.65;
                        color: var(--theme-text-secondary);
                    }
                    @media (max-width: 960px) {
                        .verifyx-layout {
                            grid-template-columns: 1fr;
                        }
                    }
                    @media (max-width: 720px) {
                        .verifyx-hero {
                            padding: 22px 20px;
                        }
                        .verifyx-card,
                        .verifyx-side__card {
                            padding: 18px;
                        }
                        .verifyx-input-group,
                        .verifyx-result__grid {
                            grid-template-columns: 1fr;
                        }
                        .verifyx-btn {
                            width: 100%;
                        }
                    }
                `}</style>
            </div>
        </div>
    )
}
