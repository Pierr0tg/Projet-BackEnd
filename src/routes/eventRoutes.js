
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

// Routes publiques
router.get('/event', eventController.getAll);
router.get('event/:id', eventController.getById);

// Routes protégées (nécessitent authentification)
router.use(auth);

// Routes pour les organisateurs
router.post('event/create', roleCheck('organizer', 'admin'), eventController.create);
router.put('event/update/:id', roleCheck('organizer', 'admin'), eventController.update);
router.delete('event/delete/:id', roleCheck('organizer', 'admin'), eventController.delete);
router.post('event/:id/publish', roleCheck('organizer', 'admin'), eventController.publish);

module.exports = router;