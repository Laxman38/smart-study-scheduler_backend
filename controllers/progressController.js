const User = require('../models/User');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

exports.getDailyProgress = async (req, res) => {
    try {
        const { date } = req.params;
        const user = await User.findById(req.user.id);

        const dailyProgress = user.progress.daily;
        const todayProgress = dailyProgress.get(date) || { goals: 0, pomodoro: 0 };

        let streak = 0;
        let current = dayjs(date);
        while (true) {
            const d = current.format('YYYY-MM-DD');
            if(dailyProgress.has(d) && dailyProgress.get(d).goals > 0) {
                streak++;
                current = current.subtract(1, 'day');
            } else {
                break;
            }
        }

        user.progress.main.streak = streak;
        await user.save();

        return res.json({
            goals: todayProgress.goals || 0,
            pomodoro: todayProgress.pomodoro || 0,
            streak
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Error fetching daily progress' });
    }
};

exports.incrementGoal = async (req, res) => {
    try {
        const today = dayjs().tz("Asia/Kolkata").format("YYYY-MM-DD");
        const user = await User.findById(req.user.id);

        user.progress.main.goals += 1;

        const daily = user.progress.daily.get(today) || { goals: 0, pomodoro: 0 };
        daily.goals += 1;
        user.progress.daily.set(today, daily);

        await user.save();
        return res.json({ msg: 'Goal count updated', daily });

    } catch (err) {
        return res.status(500).json({ msg: 'Error updating goal count' });
    }
};

exports.incrementPomodoro = async (req, res) => {
    try {
        const today = dayjs().tz('Asia/Kolkata').format('YYYY-MM-DD');
        const user = await User.findById(req.user.id);

        user.progress.main.pomodoro = (user.progress.main.pomodoro || 0) + 1;

        user.xp = (user.xp || 0) + 50;

        const daily = user.progress.daily.get(today) || { goals: 0, pomodoro: 0 };
        daily.pomodoro += 1;
        user.progress.daily.set(today, daily);

        await user.save();

        return res.json({ msg: 'Pomodoro session recorded', xp: user.xp, daily});

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error updating pomodoro count'});
    }
};

exports.getWeeklyProgress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if(!user) return res.status(404).json({ msg: 'User not found' });

        const last7Days = Array.from({ length: 7 }, (_, i) => 
            dayjs().subtract(6 - i, 'day').format('YYYY-MM-DD')
        );

        const weekly = last7Days.map(date => {
            const entry = user.progress.daily.get(date) || { goals: 0, pomodoro: 0 };
            return {
                date,
                goals: entry.goals,
                pomodoro: entry.pomodoro,
            };
        });

        return res.json(weekly);

    } catch (err) {
        console.error('Error fetching weekly progress', err);
        res.status(500).json({ msg: 'Error fetching weekly progress' });
    }
};