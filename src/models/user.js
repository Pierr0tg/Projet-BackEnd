const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

class User extends Model {
	async validatePassword(password) {
		return bcrypt.compare(password, this.password);
	}
}

User.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: { isEmail: true },
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		role: {
			type: DataTypes.ENUM('user', 'organizer', 'admin'),
			defaultValue: 'user',
		},
	},
	{
		sequelize,
		modelName: 'User',
		hooks: {
			beforeCreate: async (user) => {
				user.password = await bcrypt.hash(user.password, 10);
			},
		},
	}
);

// À la fin de votre fichier user.js, avant module.exports
console.log('User model initialized:', User === sequelize.models.User); // Devrait afficher true
console.log('Available models:', Object.keys(sequelize.models));
console.log('User.create exists:', typeof User.create === 'function'); // Devrait afficher true

module.exports = User;
