const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key';

function authenticateToken(req, res, next) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		return res.status(401).json({ message: 'Token manquant.' });
	}
	const user = jwt.verify(token, SECRET_KEY);
	if (!user) {
		return res.status(403).json({ message: 'Token invalide.' });
	} else {
		req.user = user;
		next();
	}
}

module.exports = authenticateToken;
