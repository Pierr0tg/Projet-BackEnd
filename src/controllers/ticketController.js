const Ticket = require('../models/ticket');
// const Event = require('../models/event'); // Si nécessaire
const QRCode = require('qrcode');

const ticketController = {
  // Acheter un ticket
  async purchase(req, res) {
    try {
      const { eventId } = req.params;
      const userId = req.user.id;

      const event = await Event.findByPk(eventId);

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      if (event.currentCapacity >= event.maxCapacity) {
        return res.status(400).json({ message: 'Event is sold out' });
      }

      const qrCodeData = `ticket-${userId}-${eventId}-${Date.now()}`;
      const qrCode = await QRCode.toDataURL(qrCodeData);

      const ticket = await Ticket.create({
        eventId,
        userId,
        purchasePrice: event.price,
        qrCode,
      });

      await event.increment('currentCapacity');

      res.status(201).json(ticket);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir les tickets d'un utilisateur
  async getUserTickets(req, res) {
    try {
      const userId = req.user.id;

      const tickets = await Ticket.findAll({ where: { userId } });

      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Récupérer tous les tickets
  async getAllTickets(req, res) {
    try {
      const tickets = await Ticket.findAll(); // Récupère tous les tickets
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Récupérer un ticket par ID
  async getTicketById(req, res) {
    try {
      const { id } = req.params;

      const ticket = await Ticket.findByPk(id);

      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }

      res.status(200).json(ticket);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = ticketController;
