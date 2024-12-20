const jwt = require('jsonwebtoken');
const User = require('../models/user');
const SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key';

const authController = {
	async register(req, res) {
		try {
			const { username, email, password, role } = req.body;
			if (!username || !email || !password) {
				return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
			}

			const newUser = await User.create({ username, email, password, role });

			// Création du token avec plus d'informations utilisateur
			const token = jwt.sign(
				{
					id: newUser.id,
					username: newUser.username,
					email: newUser.email,
					role: newUser.role,
				},
				SECRET_KEY,
				{ expiresIn: '1h' }
			);

			res.status(201).json({
				message: 'Utilisateur créé avec succès.',
				user: {
					id: newUser.id,
					username: newUser.username,
					email: newUser.email,
					role: newUser.role,
				},
				token,
			});
		} catch (error) {
			res.status(500).json({ message: error.message });
			console.log(error);
		}
	},

	async login(req, res) {
		try {
			const { email, password } = req.body;
			const user = await User.findOne({ where: { email } });

			if (!user || !(await user.validatePassword(password))) {
				return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
			}

			// Création du token avec plus d'informations utilisateur
			const token = jwt.sign(
				{
					id: user.id,
					username: user.username,
					email: user.email,
					role: user.role,
				},
				SECRET_KEY,
				{ expiresIn: '1h' }
			);

			res.json({
				message: 'Connexion réussie.',
				user: {
					id: user.id,
					username: user.username,
					email: user.email,
					role: user.role,
				},
				token,
			});
		} catch (error) {
			res.status(500).json({ message: error.message });
			console.log(error);
		}
	},
};

module.exports = authController;
