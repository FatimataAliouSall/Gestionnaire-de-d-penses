import express from 'express';
import bodyParser from 'body-parser';

import userRouter from './src/routes/User.js';
import expenseCategoryRouter from './src/routes/ExpenseCategory.js'; 
import paymentMethodRouter from './src/routes/PaymentMethod.js'; 
import expenseRouter from './src/routes/Expense.js';
import paymentRouter from './src/routes/Payment.js'; 
import planningRouter from './src/routes/Planning.js';

const app = express();
app.use(bodyParser.json());
app.use('/api', userRouter);
app.use('/api', expenseCategoryRouter);
app.use('/api', paymentMethodRouter);
app.use('/api', expenseRouter);
app.use('/api', paymentRouter); 
app.use('/api', planningRouter);
app.get('/', (req, res) => {
  res.send("Bienvenue dans mon application");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
