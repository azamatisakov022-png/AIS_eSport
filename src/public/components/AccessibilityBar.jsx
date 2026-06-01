import { useTranslation } from 'react-i18next'

/**
 * GOST Р 52872-2021 "версия для слабовидящих" toolbar.
 * Appears at the very top of the public portal when enabled.
 * Controls: font size (3), colour scheme (3), images on/off, exit.
 *
 * Props:
 *   settings: { on, font, scheme, images }
 *   onChange(patch)
 *   onExit()
 */
export default function AccessibilityBar({ settings, onChange, onExit }) {
    const { t } = useTranslation()
    if (!settings.on) return null

    const SIZES = [
        { key: 'normal', label: 'А', title: t('a11y.sizeNormal') },
        { key: 'large', label: 'А', title: t('a11y.sizeLarge') },
        { key: 'xlarge', label: 'А', title: t('a11y.sizeXLarge') },
    ]
    const SCHEMES = [
        { key: 'white', title: t('a11y.schemeWhite') },
        { key: 'black', title: t('a11y.schemeBlack') },
        { key: 'blue', title: t('a11y.schemeBlue') },
    ]

    return (
        <div className="a11y-bar" role="region" aria-label={t('a11y.title')}>
            <div className="pub-container">
                <div className="a11y-bar__inner">
                    {/* Font size */}
                    <div className="a11y-bar__group">
                        <span className="a11y-bar__label">{t('a11y.fontSize')}</span>
                        <div className="a11y-bar__btns">
                            {SIZES.map((s, i) => (
                                <button
                                    key={s.key}
                                    type="button"
                                    className={`a11y-bar__btn a11y-bar__size a11y-bar__size--${s.key}${settings.font === s.key ? ' is-active' : ''}`}
                                    onClick={() => onChange({ font: s.key })}
                                    aria-pressed={settings.font === s.key}
                                    title={s.title}
                                >
                                    {s.label}{i > 0 && <sup>{'+'.repeat(i)}</sup>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Colour scheme */}
                    <div className="a11y-bar__group">
                        <span className="a11y-bar__label">{t('a11y.colorScheme')}</span>
                        <div className="a11y-bar__btns">
                            {SCHEMES.map(s => (
                                <button
                                    key={s.key}
                                    type="button"
                                    className={`a11y-bar__btn a11y-bar__scheme a11y-bar__scheme--${s.key}${settings.scheme === s.key ? ' is-active' : ''}`}
                                    onClick={() => onChange({ scheme: s.key })}
                                    aria-pressed={settings.scheme === s.key}
                                    title={s.title}
                                >
                                    Ц
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Images */}
                    <div className="a11y-bar__group">
                        <span className="a11y-bar__label">{t('a11y.images')}</span>
                        <div className="a11y-bar__btns">
                            <button
                                type="button"
                                className={`a11y-bar__btn a11y-bar__toggle${settings.images ? ' is-active' : ''}`}
                                onClick={() => onChange({ images: true })}
                                aria-pressed={settings.images}
                            >
                                {t('a11y.imagesOn')}
                            </button>
                            <button
                                type="button"
                                className={`a11y-bar__btn a11y-bar__toggle${!settings.images ? ' is-active' : ''}`}
                                onClick={() => onChange({ images: false })}
                                aria-pressed={!settings.images}
                            >
                                {t('a11y.imagesOff')}
                            </button>
                        </div>
                    </div>

                    {/* Exit */}
                    <button type="button" className="a11y-bar__exit" onClick={onExit}>
                        {t('a11y.exit')}
                    </button>
                </div>
            </div>
        </div>
    )
}
