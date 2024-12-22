const { Op } = require('sequelize');
const Event = require('../models/event');
const User = require('../models/user');
const Venue = require('../models/venue');
const Ticket = require('../models/ticket');

const eventController = {

    //Créer un événement (uniquement pour les organisateurs)
    async create(req, res) {
        try {
            const organizerId = req.user.id;
            const {
                title,
                description,
                date,
                price,
                maxCapacity,
                venueId,
                categories,
                imageUrl
            } = req.body;

            // Vérifier qu'un lieu soit disponible 
            const existingEvents = await Event.count({
                where: {
                    venueId,
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

            if (existingEvent > 0) {
                return res.status(400).json({
                    message: 'Venue is already booked for this date'
                });
            }

            const event = await Event.create({
                title,
                description,
                date,
                price,
                maxCapacity,
                venueId,
                organizerId,
                categories,
                imageUrl,
                status: 'draft' 
            });

            res.status(201).json(event);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    //Obtenir tous les éléments grâce aux filtres avancés
    async getAll(req, res) {
        try {
            const {
                date,
                price,
                category,
                venue,
                search,
                page = 1,
                limit = 10,
                sortBy = 'date',
                order = 'ASC'
            } = req.query;

            let whereClause = {
                status: 'published',
                date: {
                    [Op.gte]: new Date()
                }
            };

            //Application des filtres
            if (date) {
                whereClause.date = {
                    [Op.between]: [
                        new Date(date).setHours(0, 0, 0, 0),
                        new Date(date).setHours(23, 59, 59, 999)
                    ]
                };
            }

            if (price) {
                whereClause.price = {
                    [Op.lte]: parseFloat(price)
                };
            }

            if (category) {
                whereClause.categories = {
                    [Op.contains]: [category]
                };
            }

            if (search) {
                whereClause = {
                    ...whereClause,
                    [Op.or]: [
                        { title: { [Op.iLike]: `%${search}%` } },
                        { description: { [Op.iLike]: `%${search}%` } },
                    ]
                };
            }

            //Pagination
            const offset = (page - 1) * limit;

            const events = await Event.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: User,
                        as: 'organizer',
                        attributes: ['id', 'username', 'email']
                    },
                    {
                        model: Venue,
                        where: venue ? { id: venue } : {}
                    }
                ],
                limit: parseInt(limit),
                offset: offset,
                order: [[sortBy, order.toUpperCase()]]
            });

            const totalPages = Math.ceil(events.count / limit);

            res.json({
                events: events.rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: events.count,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    //Obtenir un événement grâce à l'ID
    async getById(req, res) {
        try {
            const event = await Event.findByPk(req.params.id, {
                include: [
                    {
                        model: User,
                        as: 'organizer',
                        attributes: ['id', 'username', 'email']
                    },
                    {
                        model: Venue,
                        attributes: { exclude: ['createdAt', 'updatedAt'] }
                    }
                ]
            });

            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }

            res.json(event);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    //Mettre à jour un événement déjà créer
    async update(req, res) {
        try {
            const event = await Event.findByPk(req.params.id);

            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }

            if (event.organizerId !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized' });
            }

            await event.update(req.body);
            res.json(event);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    //Supprimer un événement
    async delete(req, res) {
        try {
            const event = await Event.findByPk(req.params.id);

            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }

            if (event.organizerId !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized' });
            }

            // Vérifier le nombres de ventes
            const ticketSold = await Ticket.count({
                where: { eventId: event.id }
            });

            if (ticketSold > 0) {
                //Si des tickets ont été vendus, marquer comme annulé
                await event.update({ status: 'cancelled' });
                res.json({ message: 'Event cancelled successfully' });
            } else {
                //Si aucun ticket n'a été vendu, supprimer l'événement
                await event.destroy();
                res.json({ message: 'Event deleted successfully'});
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    //Publier un événement
    async publish(req, res) {
        try {
            const event = await Event.findByPk(req.params.id);

            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }

            if (event.organizerId !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized' });
            }

            await event.update({ status: 'published' });
            res.json({ message: 'Event published successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = eventController;