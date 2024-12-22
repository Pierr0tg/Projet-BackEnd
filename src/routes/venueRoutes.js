const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venueController');
const auth = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

// Routes publiques
router.get('/venue', venueController.getAll);
router.get('/venue/:id', venueController.getById);

// Routes protégées (nécessitent authentification)
router.use(auth);

// Routes pour les organisateurs et admins
router.post('/venue/create', roleCheck('organizer', 'admin'), venueController.create);
router.put('/venue/update/:id', roleCheck('organizer', 'admin'), venueController.update);
router.delete('/venue/delete/:id', roleCheck('admin'), venueController.delete);
router.get('/venue/:id/availability', roleCheck('organizer', 'admin'), venueController.checkAvailability);

module.exports = router;