require('dotenv').config();
const express = require('express');
const sequelize = require('./src/config/database');
const app = express();
const ticketRoutes = require('./src/routes/ticketRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const swaggerSetup = require('./swagger');
const userRoutes = require('./src/routes/userRoutes');

app.use(express.json());

// Configuration Swagger
swaggerSetup(app); // Configure Swagger ici

// Routes
app.use('', transactionRoutes);
app.use('', ticketRoutes);
app.use('', userRoutes);

// Route de test
app.get('/', (req, res) => {
  res.send('Bienvenue sur Spot On API !');
});

// Lancer le serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données réussie.');
  } catch (error) {
    console.error('Erreur de connexion à la base de données :', error);
  }
  console.log(`Serveur démarré sur le port ${PORT}`);
});

// Synchronise les modèles avec la base
sequelize.sync({ alter: true }) 
  .then(() => console.log('Modèles synchronisés avec la base de données.'))
  .catch(error => console.error('Erreur lors de la synchronisation des modèles :', error));
