const User = require('../models/user');
const bcrypt = require('bcrypt');
const { roleCheck, isAdmin, isOrganizer } = require('../middleware/roleCheck');

const userController = {
	// Obtenir son propre profil (tous les utilisateurs connectés)
	async getProfile(req, res) {
		try {
			const user = await User.findByPk(req.user.id, {
				attributes: { exclude: ['password'] },
			});

			if (!user) {
				return res.status(404).json({ message: 'Utilisateur non trouvé' });
			}

			res.json(user);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},

	// Obtenir le profil d'un utilisateur spécifique (admin et organizateur seulement)
	async getUserProfile(req, res) {
		try {
			if (req.user.role !== 'admin' && req.user.role !== 'organizer') {
				return res.status(403).json({ message: 'Accès non autorisé' });
			}

			const user = await User.findByPk(req.params.id, {
				attributes: { exclude: ['password'] },
			});

			if (!user) {
				return res.status(404).json({ message: 'Utilisateur non trouvé' });
			}

			res.json(user);
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: error.message });
		}
	},

	// Obtenir tous les utilisateurs (admin seulement)
	async getAllUsers(req, res) {
		try {
			if (req.user.role !== 'admin') {
				return res.status(403).json({ message: 'Accès non autorisé' });
			}

			const users = await User.findAll({
				attributes: { exclude: ['password'] },
			});

			res.json(users);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},

	// Mettre à jour son propre profil
	async updateProfile(req, res) {
		try {
			// Vérifier si l'utilisateur essaie de modifier son propre profil
			if (req.params.id !== req.user.id && req.user.role !== 'admin') {
				return res.status(403).json({
					message: 'Vous ne pouvez modifier que votre propre profil',
				});
			}

			const { username, email } = req.body;
			const user = await User.findByPk(req.params.id);

			if (!user) {
				return res.status(404).json({ message: 'Utilisateur non trouvé' });
			}

			// Mise à jour des champs
			if (username) user.username = username;
			if (email) user.email = email;

			await user.save();

			const userResponse = { ...user.get(), password: undefined };
			res.json(userResponse);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},

	// Changer son propre mot de passe
	async changePassword(req, res) {
		try {
			// Vérifier si l'utilisateur essaie de modifier son propre mot de passe
			if (req.params.id !== req.user.id) {
				return res.status(403).json({
					message: 'Vous ne pouvez changer que votre propre mot de passe',
				});
			}

			const { currentPassword, newPassword } = req.body;
			const user = await User.findByPk(req.params.id);

			if (!user) {
				return res.status(404).json({ message: 'Utilisateur non trouvé' });
			}

			// Vérifier l'ancien mot de passe (sauf pour l'admin)
			if (req.user.role !== 'admin') {
				const isValid = await user.validatePassword(currentPassword);
				if (!isValid) {
					return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
				}
			}

			// Hasher et sauvegarder le nouveau mot de passe
			user.password = await bcrypt.hash(newPassword, 10);
			await user.save();

			res.json({ message: 'Mot de passe mis à jour avec succès' });
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},

	// Changer le rôle d'un utilisateur (admin seulement)
	async changeUserRole(req, res) {
		try {
			if (req.user.role !== 'admin') {
				return res.status(403).json({ message: 'Accès non autorisé' });
			}

			const { role } = req.body;
			const user = await User.findByPk(req.params.id);

			if (!user) {
				return res.status(404).json({ message: 'Utilisateur non trouvé' });
			}

			if (!['user', 'organizer', 'admin'].includes(role)) {
				return res.status(400).json({ message: 'Rôle invalide' });
			}

			user.role = role;
			await user.save();

			const userResponse = { ...user.get(), password: undefined };
			res.json(userResponse);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},

	// Supprimer un compte (soi-même ou admin)
	async deleteAccount(req, res) {
		try {
			// Vérifier si l'utilisateur essaie de supprimer son propre compte ou s'il est admin
			if (req.params.id !== req.user.id && req.user.role !== 'admin') {
				return res.status(403).json({
					message: 'Vous ne pouvez supprimer que votre propre compte',
				});
			}

			const user = await User.findByPk(req.params.id);

			if (!user) {
				return res.status(404).json({ message: 'Utilisateur non trouvé' });
			}

			await user.destroy();
			res.json({ message: 'Compte supprimé avec succès' });
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},
};

module.exports = userController;
