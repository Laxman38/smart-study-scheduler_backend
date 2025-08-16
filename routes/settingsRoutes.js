const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getSettings, updateSettings } = require('../controllers/settingsController');

router.get('/getSettings', auth, getSettings);
router.put('/updateSettings', auth, updateSettings);

module.exports = router;