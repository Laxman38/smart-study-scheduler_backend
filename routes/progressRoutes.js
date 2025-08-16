const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getDailyProgress, incrementGoal, incrementPomodoro, getWeeklyProgress } = require('../controllers/progressController');


router.post('/goal', auth, incrementGoal);
router.post('/pomodoro', auth, incrementPomodoro);
router.get('/weekly', auth, getWeeklyProgress);
router.get('/:date', auth, getDailyProgress);

module.exports = router;