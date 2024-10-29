// import express from 'express';
// import i18n from 'i18next';
// import Backend from 'i18next-http-backend';
// import LanguageDetector from 'i18next-express-middleware';

// const app = express();

// i18n
//   .use(Backend) // Charger les fichiers de traduction
//   .use(LanguageDetector.LanguageDetector) // Détecter la langue du client
//   .init({
//     fallbackLng: 'en', // Langue par défaut
//     debug: true,
//     backend: {
//       loadPath: './locales/{{lng}}/translation.json', // Chemin vers les fichiers de traduction
//     },
//     interpolation: {
//       escapeValue: false,
//     },
//   });

// // Utilisation du middleware d'i18next avec Express
// app.use(LanguageDetector.handle(i18n));

// app.get('/', (req, res) => {
//   res.send(req.t('welcome')); // Utilisation de `req.t` pour traduire les textes
// });

// export default app;

import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-express-middleware';

i18n
  .use(Backend)
  .use(LanguageDetector.LanguageDetector)
  .init({
    fallbackLng: 'en',
    debug: true,
    backend: {
      loadPath: './locales/{{lng}}/translation.json',
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
