const roleCheck = (...allowedRoles) => {
	return (req, res, next) => {
		if (!req.user) {
			return res.status(401).json({
				message: 'Non authentifié',
			});
		}

		if (!allowedRoles.includes(req.user.role)) {
			return res.status(403).json({
				message: 'Accès non autorisé pour ce rôle',
			});
		}

		next();
	};
};

// Middlewares spécifiques par rôle
const isAdmin = roleCheck('admin');
const isOrganizer = roleCheck('organizer', 'admin');
const isUser = roleCheck('user', 'organizer', 'admin');

module.exports = {
	roleCheck,
	isAdmin,
	isOrganizer,
	isUser,
};
