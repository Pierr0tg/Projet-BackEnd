const Transaction = require('../models/transaction');
const Ticket = require('../models/ticket');

const transactionController = {
  // Ajouter une transaction
  async create(req, res) {
    try {
      const { ticketId, amount } = req.body;
      const userId = req.user.id;

      const ticket = await Ticket.findByPk(ticketId);

      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }

      const transaction = await Transaction.create({
        userId,
        ticketId,
        amount,
      });

      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Lister les transactions d'un utilisateur
  async getUserTransactions(req, res) {
    try {
      const userId = req.user.id;

      const transactions = await Transaction.findAll({
        where: { userId },
        include: [Ticket],
      });

      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Rembourser une transaction
  async refund(req, res) {
    try {
      const { transactionId } = req.params;

      const transaction = await Transaction.findByPk(transactionId);

      if (!transaction || transaction.status !== 'success') {
        return res.status(400).json({ message: 'Invalid transaction' });
      }

      transaction.status = 'refunded';
      await transaction.save();

      res.status(200).json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = transactionController;
