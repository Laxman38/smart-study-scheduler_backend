const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getTasks, saveTask } = require('../controllers/taskController');

router.post('/save', auth, saveTask);
router.get('/all', auth, getTasks);

module.exports = router;