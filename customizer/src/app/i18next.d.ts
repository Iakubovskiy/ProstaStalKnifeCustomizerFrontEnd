import "i18next";
import type uaTranslation from "../locales/ua/translation.json";

declare module "i18next" {
    interface CustomTypeOptions {
        defaultNS: "translation";
        resources: {
            translation: typeof uaTranslation;
        };
    }
}