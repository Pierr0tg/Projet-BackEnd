const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Venue extends Model {}

Venue.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true 
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Paris'
    },
    postalCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^[0-9]{5}$/
        }
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false 
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true 
    },
    amenities: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true 
    }
}, {
    sequelize,
    modeName: 'Venue'
});

module.exports = Venue;