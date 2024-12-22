const { Op } = require('sequelize');
const Venue = require('../models/venue');
const Event = require('../models/event');

const venueController = {

    // Créer un lieu
    async create(req, res) {
        try {
            const {
                name,
                address,
                city,
                postalCode,
                capacity,
                description,
                amenities,
                imageUrl
            } = req.body;

            const venue = await Venue.create({
                name,
                address,
                city,
                postalCode,
                capacity,
                description,
                amenities,
                imageUrl
            });

            res.status(201).json(venue);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Obtenir tous les lieux avec des filtres
    async getAll(req, res) {
        try {
            const {
                city,
                capacity,
                amenities,
                search,
                page = 1,
                limit = 10,
                sortBy = 'name',
                order = 'ASC'
            } = req.query;

            let whereClause = {};

            if (city) {
                whereClause.city = city;
            }

            if (capacity) {
                whereClause.capacity = {
                    [Op.gte]: parseInt(capacity)
                };
            }

            if (amenities) {
                whereClause.amenities = {
                    [Op.contains]: amenities.split(',')
                };
            }

            if (search) {
                whereClause = {
                    ...whereClause,
                    [Op.or]: [
                        { name: { [Op.iLike]: `%${search}%` } },
                        { address: { [Op.iLike]: `%${search}%` } },
                        { description: { [Op.iLike]: `%${search}%` } }
                    ]
                };
            }

            const offset = (page - 1) * limit;

            const venues = await Venue.findAndCountAll({
                where: whereClause,
                limit: parseInt(limit),
                offset: offset,
                order: [[sortBy, order.toUpperCase()]]
            });

            const totalPages = Math.ceil(venues.count / limit);

            res.json({
                venues: venues.rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: venues.count,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Obtenir un lieu par ID
    async getById(req, res) {
        try {
            const venue = await Venue.findByPk(req.params.id);

            if (!venue) {
                return res.status(404).json({ message: 'Venue not found' });
            }

            res.json(venue);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Mettre à jour un lieu
    async update(req, res) {
        try {
            const venue = await Venue.findByPk(req.params.id);

            if (!venue) {
                return res.status(404).json({ message: 'Venue not found' });
            }

            await venue.update(req.body);
            res.json(venue);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Supprimer un lieu
    async delete(req, res) {
        try {
            const venue = await Venue.findByPk(req.params.id);

            if (!venue) {
                return res.status(404).json({ message: 'Venue not found' });
            }

            await venue.destroy();
            res.json({ message: 'Venue deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Vérifier la disponibilité d'un lieu
    async checkAvailability(req, res) {
        try {
            const { id } = req.params;
            const { date } = req.query;

            const venue = await Venue.findByPk(id);

            if (!venue) {
                return res.status(404).json({ message: 'Venue not found' });
            }

            const existingEvents = await Event.count({
                where: {
                    venueId: id,
                    date: {
                        [Op.between]: [
                            new Date(date).setHours(0, 0, 0, 0),
                            new Date(date).setHours(23, 59, 59, 999)
                        ]
                    },
                    status: {
                        [Op.not]: 'cancelled'
                    }
                }
            });

            if (existingEvents > 0) {
                return res.status(400).json({ message: 'Venue is not available on the selected date' });
            }

            res.status(200).json({ message: 'Venue is available on the selected date' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = venueController;
