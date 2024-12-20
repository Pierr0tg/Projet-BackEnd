require('dotenv').config();
const express = require('express');
const userRoutes = require('./src/routes/userRoutes');

const app = express();
app.use(express.json());

// Intégration des routes utilisateur
app.use('', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

app.get('', (req, res) => {
	res.json({ message: 'Hello, world !' });
});
