import type en from '@/localizations/en.json';

declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'translation';
        strictKeyChecks: true;
        resources: {
            translation: typeof en;
        };
    }
}
