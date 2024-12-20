const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');
const { isAdmin, isOrganizer } = require('../middleware/roleCheck');

const router = express.Router();

// Routes d'authentification (publiques)
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Routes de profil (authentifiées)
router.get('/profile', authenticateToken, userController.getProfile); // Obtenir son propre profil
router.put('/edit/profile/:id', authenticateToken, userController.updateProfile); // Modifier son profil
router.put('/edit/profile/:id/password', authenticateToken, userController.changePassword); // Changer son mot de passe
router.delete('/delete/profile/:id', authenticateToken, userController.deleteAccount); // Supprimer son compte

// Routes admin et organisateur
router.get(
	'/users/:id',
	authenticateToken,
	isOrganizer, // Accessible aux organisateurs et admins
	userController.getUserProfile
);

// Routes admin uniquement
router.get('/users', authenticateToken, isAdmin, userController.getAllUsers); // Liste de tous les utilisateurs

router.put('/users/:id/role', authenticateToken, isAdmin, userController.changeUserRole); // Changer le rôle d'un utilisateur

// Route de test de connexion
router.get('/protected', authenticateToken, (req, res) => {
	res.json({ message: `Bienvenue ${req.user.username} !`, user: req.user });
});

module.exports = router;
