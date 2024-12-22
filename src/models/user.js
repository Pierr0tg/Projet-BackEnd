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

module.exports = User;
