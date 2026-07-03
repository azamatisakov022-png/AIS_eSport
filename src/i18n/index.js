import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ru from '../locales/ru.json'

/* Ленивые локали: русский (язык по умолчанию) едет в основном бандле,
   кыргызский и английский догружаются отдельными чанками только при
   переключении языка — это ~180 КБ JSON вне первого экрана. */
const LAZY_LOCALES = {
    kg: () => import('../locales/kg.json'),
    en: () => import('../locales/en.json'),
}

i18n.use(initReactI18next).init({
    resources: {
        ru: { translation: ru },
    },
    lng: 'ru',
    fallbackLng: 'ru',
    interpolation: {
        escapeValue: false,
    },
})

async function ensureLocale(lng) {
    if (LAZY_LOCALES[lng] && !i18n.hasResourceBundle(lng, 'translation')) {
        const mod = await LAZY_LOCALES[lng]()
        i18n.addResourceBundle(lng, 'translation', mod.default || mod)
    }
}

/* Прозрачно для всех вызовов i18n.changeLanguage('kg'|'en') по приложению */
const origChangeLanguage = i18n.changeLanguage.bind(i18n)
i18n.changeLanguage = async (lng, ...args) => {
    await ensureLocale(lng)
    return origChangeLanguage(lng, ...args)
}

i18n.on('languageChanged', (lng) => {
    localStorage.setItem('lang', lng)
})

/* Восстановление сохранённого языка (kg/en догрузится чанком) */
const saved = localStorage.getItem('lang')
if (saved && saved !== 'ru') {
    i18n.changeLanguage(saved)
}

export default i18n
