const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
    getGoals,
    addGoal,
    completeGoal,
    deleteGoal
} = require('../controllers/goalController');

router.get('/', auth, getGoals);
router.post('/', auth, addGoal);
router.patch('/:id/complete', auth, completeGoal);
router.delete('/:id', auth, deleteGoal);

module.exports = router;