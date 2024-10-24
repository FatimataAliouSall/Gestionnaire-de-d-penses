import express from 'express';
import userRouter from './src/routes/User.js';
import bodyParser from 'body-parser';

const app = express();

// Middleware pour parser le corps des requêtes en JSON
app.use(bodyParser.json());

// Utiliser le routeur défini dans router.js
app.use('/api', userRouter);

// Route de test pour vérifier que l'application fonctionne
app.get('/', (req, res) => {
  res.send('Bienvenue dans l\'API des utilisateurs');
});

// Définir le port
const PORT = process.env.PORT || 3000;

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
