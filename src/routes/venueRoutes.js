const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venueController');
const auth = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

// Routes publiques
router.get('/venue',auth, venueController.getAll);
router.get('/venue/:id',auth, venueController.getById);


// Routes pour les organisateurs et admins
router.post('/venue/create',auth, roleCheck('organizer', 'admin'), venueController.create);
router.put('/venue/update/:id',auth, roleCheck('organizer', 'admin'), venueController.update);
router.delete('/venue/delete/:id',auth, roleCheck('admin'), venueController.delete);
router.get('/venue/:id/availability',auth, roleCheck('organizer', 'admin'), venueController.checkAvailability);

module.exports = router;