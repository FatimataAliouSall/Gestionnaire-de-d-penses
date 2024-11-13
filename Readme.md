# gestion des dépenses recurrente

cette application est conçue pour aider les utilisateurs à suivre leurs dépenses, à gérer leurs catégories de dépenses, à enregistrer diverses méthodes de paiement, et à planifier leurs dépenses futures. Ce projet met l’accent sur la simplicité d’utilisation et l’efficacité grâce à une interface conviviale et des fonctionnalités bien structurées. 

## Prérequis

- Node.js (version 18 ou supérieure)
- PostgresSQL
- Postman (pour tester l'API)

## Installation
Pour configurer le projet, suivez ces étapes :
1. Cloner le dépôt :
```bash
   git clone https://github.com/FatimataAliouSall/Gestionnaire-de-d-penses.git
   cd Gestionnaire-de-d-penses
   
```
2. Installer les dépendances :
```bash
    npm install
```
3. Démarrer le serveur :
```bash
  npm start
```
4. Créez une copie du fichier .env.example puis renommer le fichier en .env à la racine du projet et mettez vos information pour configuration de la connexion à la base de données :
```bash
  DATABASE_URL=""
JWT_SECRET=
```
L'API sera accessible à l'adresse http://localhost:3000
## Endpoints de l'API

1. Créer un utilisateur
- Méthode : POST
- Endpoint : /api/users
- Description : Ajoute un utilisateur dans la base de données.
- Corps de la requette :

```bash
    {
    "username": "Thimbo",
    "email": "Ab@example.com",
    "password": "1234567",
    "status": true
    }
```
- Réponse :
```bash
  "message": "Utilisateur créé avec succès",
```

2. Obtenir tous les utilisateurs
- Méthode : GET
- Endpoint : /api/users
- Description : Récupère toutes les recettes de la base de données.
- Réponse:
```bash
  {
        "id": 10,
        "username": "Thillo",
        "email": "seme@gmail.com",
        "password": "$2b$10$n2KLQpS6weqLLhBUiJhWKelhADFqP/aRnwi.MuWPTTedmEL.fShGy",
        "role": "Menager",
        "status": true
    },
```

3. Mettre à jour un utilisateur
- Méthode : PUT
- Endpoint : /api/users/:id
- Description : Mettre à jour un utilisateur par son ID.
- Corps :
```bash
  {
  "username": "JohnDoe e",
  "email": "john@example.com",
  "password": "password123",
  "status": true
}
```

- Réponse :
```bash
  "message": "Utilisateur mis à jour avec succès",

```
4. Supprimer un utilisateur.
Méthode : DELETE
Endpoint : /api/users/:id
Description : Supprime un utilisateur par son ID.

- Réponse :
```bash
  "message": "Utilisateur supprimé avec succès",

```
## Tests
Les tests unitaires sont écrits avec Jasmine. Pour les exécuter, utilisez la commande :

```bash
  npm test

```

## Analyse et formatage de code

Ce projet utilise ESLint pour le linting du code et Prettier pour le formatage. Cela permet de garantir que le code respecte des normes de qualité et de style cohérentes.

- Eslint

```bash
  npm run lint:fix

```
- Prettier

```bash
  npm run format

```
## Auteur

[- Fatimata Aliou Sall - Développeuse Full Stack](https://github.com/FatimataAliouSall)






