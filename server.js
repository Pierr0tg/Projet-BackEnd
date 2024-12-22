require('dotenv').config();
const express = require('express');
const userRoutes = require('./src/routes/userRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const venueRoutes = require('./src/routes/venueRoutes');

const app = express();
app.use(express.json());

// Intégration des routes
app.use('/api', userRoutes); // Utilisateurs
app.use('/api/events', eventRoutes); // Événements
app.use('/api/venues', venuesRoutes); // Lieux

app.get('/', (req, res) => {
	res.json({ message: 'Bienvenue sur l\'API Spot On' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
