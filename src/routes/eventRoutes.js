
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

// Routes publiques
router.get('/event',auth, eventController.getAll);
router.get('/event/:id',auth, eventController.getById);

// Routes pour les organisateurs
router.post('/event/create',auth, roleCheck('organizer', 'admin'), eventController.create);
router.put('/event/update/:id',auth, roleCheck('organizer', 'admin'), eventController.update);
router.delete('/event/delete/:id',auth, roleCheck('organizer', 'admin'), eventController.delete);
router.post('/event/:id/publish',auth, roleCheck('organizer', 'admin'), eventController.publish);

module.exports = router;