const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const auth = require('../middleware/auth');
const {roleCheck, isAdmin} = require('../middleware/roleCheck');
const eventController = require('../controllers/eventController');

router.post('/events/:eventId/tickets', auth, ticketController.purchase);
router.get('/tickets/user', auth, ticketController.getUserTickets);

module.exports = router;
/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Récupérer tous les tickets
 *     responses:
 *       200:
 *         description: Une liste de tickets
 */
router.get("/tickets", ticketController.getAllTickets);

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Récupérer un ticket par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du ticket
 *     responses:
 *       200:
 *         description: Détails du ticket
 */
router.get("/tickets/:id", ticketController.getTicketById);
