import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ru from '../locales/ru.json'
import kg from '../locales/kg.json'
import en from '../locales/en.json'

i18n.use(initReactI18next).init({
    resources: {
        ru: { translation: ru },
        kg: { translation: kg },
        en: { translation: en },
    },
    lng: localStorage.getItem('lang') || 'ru',
    fallbackLng: 'ru',
    interpolation: {
        escapeValue: false,
    },
})

i18n.on('languageChanged', (lng) => {
    localStorage.setItem('lang', lng)
})

export default i18n
