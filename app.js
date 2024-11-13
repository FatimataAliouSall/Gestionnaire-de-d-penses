import express from 'express';
import bodyParser from 'body-parser';
import i18next from 'i18next';
import i18nextMiddleware from 'i18next-http-middleware';
import Backend from 'i18next-fs-backend';
import cors from 'cors';

import userRouter from './src/routes/User.js';
import expenseCategoryRouter from './src/routes/ExpenseCategory.js';
import paymentMethodRouter from './src/routes/PaymentMethod.js';
import expenseRouter from './src/routes/Expense.js';
import paymentRouter from './src/routes/Payment.js';
import planningRouter from './src/routes/Planning.js';
import loginRoute from './src/api/login.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'fr',
    backend: {
      loadPath: './locales/{{lng}}/translation.json',
    },
    detection: {
      order: ['querystring', 'cookie', 'header'],
      caches: ['cookie'],
    },
  });

const corsOptions = {
  origin: ['http://localhost:5173'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use('/api', userRouter);
app.use('/api', expenseCategoryRouter);
app.use('/api', paymentMethodRouter);
app.use('/api', expenseRouter);
app.use('/api', paymentRouter);
app.use('/api', planningRouter);
app.use('/api', loginRoute);

app.get('/', (req, res) => {
  res.send(req.t('Bienvenue dans mon application'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
