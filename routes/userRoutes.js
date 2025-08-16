const express = require('express');
const { updateXP } = require('../controllers/UserController');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

router.post('/update-xp', auth, updateXP);

module.exports = router;