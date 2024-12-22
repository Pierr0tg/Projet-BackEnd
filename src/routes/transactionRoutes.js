const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');

router.post('/transactions', auth, transactionController.create);
router.get('/transactions/user', auth, transactionController.getUserTransactions);
router.post('/transactions/:transactionId/refund', auth, transactionController.refund);

module.exports = router;