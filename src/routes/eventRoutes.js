
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

// Routes publiques
router.get('/', eventController.getAll);
router.get('/:id', eventController.getById);

// Routes protégées (nécessitent authentification)
router.use(auth);

// Routes pour les organisateurs
router.post('/', roleCheck('organizer', 'admin'), eventController.create);
router.put('/:id', roleCheck('organizer', 'admin'), eventController.update);
router.delete('/:id', roleCheck('organizer', 'admin'), eventController.delete);
router.post('/:id/publish', roleCheck('organizer', 'admin'), eventController.publish);

module.exports = router;