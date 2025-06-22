import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import uaTranslation from "./locales/ua/translation.json";
import enTranslation from "./locales/en/translation.json";

i18n.use(initReactI18next).init({
    resources: {
        ua: { translation: uaTranslation },
        en: { translation: enTranslation }
    },
    lng: "ua",
    fallbackLng: "ua",
    interpolation: {
        escapeValue: false
    }
});

export default i18n;