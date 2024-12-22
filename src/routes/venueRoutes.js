const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venueController');
const auth = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

// Routes publiques
router.get('/', venueController.getAll);
router.get('/:id', venueController.getById);

// Routes protégées (nécessitent authentification)
router.use(auth);

// Routes pour les organisateurs et admins
router.post('/', roleCheck('organizer', 'admin'), venueController.create);
router.put('/:id', roleCheck('organizer', 'admin'), venueController.update);
router.delete('/:id', roleCheck('admin'), venueController.delete);
router.get('/:id/availability', roleCheck('organizer', 'admin'), venueController.checkAvailability);

module.exports = router;