const Event = require('../models/event');

const eventController = {
  // Créer un événement
  async createEvent(req, res) {
    try {
      const { name, maxCapacity, price } = req.body;

      const event = await Event.create({
        name,
        maxCapacity,
        price,
        currentCapacity: 0, // Initialisé à zéro
      });

      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = eventController;
