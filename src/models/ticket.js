const { Model, DataTypes } = require('sequelize');
const User = require('./user');
const Event = require('./event');
const sequelize = require('../config/database');

class Ticket extends Model {}

Ticket.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  eventId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Events',
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM('active', 'used', 'resale', 'refunded'),
    defaultValue: 'active',
  },
  purchasePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  resalePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  qrCode: {
    type: DataTypes.STRING,
    unique: true,
  },
}, {
  sequelize,
  modelName: 'Ticket',
});

module.exports = Ticket;