import express from 'express';
import bodyParser from 'body-parser';

import userRouter from './src/routes/User.js';
import expenseCategoryRouter from './src/routes/ExpenseCategory.js'; 
import paymentMethodRouter from './src/routes/PaymentMethod.js'; 

const app = express();
app.use(bodyParser.json());
app.use('/api', userRouter);
app.use('/api', expenseCategoryRouter);
app.use('/api', paymentMethodRouter); 
// Route de test pour vérifier que l'application fonctionne
app.get('/', (req, res) => {
  res.send("Bienvenue dans l'API des utilisateurs, des catégories de dépenses et des méthodes de paiement");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
