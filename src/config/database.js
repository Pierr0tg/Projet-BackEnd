const { Sequelize } = require('sequelize');
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
	throw new Error('DATABASE_URL is not defined in environment variables');
}

const sequelize = new Sequelize(DATABASE_URL, {
	dialect: 'mysql',
	logging: false,
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
});

const initDatabase = async () => {
	try {
		await sequelize.authenticate();
		console.log('Connexion réussie à la base de données.');

		await sequelize.sync({ force: false });
		console.log('Synchronisation des modèles réussie.');
	} catch (error) {
		console.error('Erreur de connexion à la base de données:', error);
		process.exit(1);
	}
};

initDatabase();

module.exports = sequelize;
