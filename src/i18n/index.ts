import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import zhCommon from './locales/zh/common.json';
import zhHome from './locales/zh/home.json';
import zhCalendar from './locales/zh/calendar.json';
import zhStats from './locales/zh/stats.json';
import zhAi from './locales/zh/ai.json';
import zhAdd from './locales/zh/add.json';
import zhFood from './locales/zh/food.json';
import zhExercise from './locales/zh/exercise.json';
import zhPrompts from './locales/zh/prompts.json';

import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enCalendar from './locales/en/calendar.json';
import enStats from './locales/en/stats.json';
import enAi from './locales/en/ai.json';
import enAdd from './locales/en/add.json';
import enFood from './locales/en/food.json';
import enExercise from './locales/en/exercise.json';
import enPrompts from './locales/en/prompts.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      zh: {
        common: zhCommon,
        home: zhHome,
        calendar: zhCalendar,
        stats: zhStats,
        ai: zhAi,
        add: zhAdd,
        food: zhFood,
        exercise: zhExercise,
        prompts: zhPrompts,
      },
      en: {
        common: enCommon,
        home: enHome,
        calendar: enCalendar,
        stats: enStats,
        ai: enAi,
        add: enAdd,
        food: enFood,
        exercise: enExercise,
        prompts: enPrompts,
      },
    },
    fallbackLng: 'zh',
    supportedLngs: ['zh', 'en'],
    ns: ['common', 'food', 'exercise'],
    defaultNS: 'common',
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'calmorie_lang',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
