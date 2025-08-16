const User = require('../models/User');

exports.getGoals = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if(!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user.goals || []);

    } catch (err) {
        console.error('Get goals error:', err);
        res.status(500).json({ msg: 'Failed to fetch goals'});
    }
};

exports.addGoal = async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: 'Goal text is required' });

    try {
        const user = await User.findById(req.user.id);
        if(!user) return res.status(404).json({ msg: 'User not found' });

        const newGoal = {
            id: Date.now(),
            text,
            completed: false,
        };
        user.goals.push(newGoal);
        await user.save();

        res.json(newGoal);

    } catch (err) {
        res.status(500).json({ msg: 'Failed to add goal' });
    }
};

exports.completeGoal = async (req, res) => {
    const { id } = req.params;
    const numericId = Number(id);

    try {
        const user = await User.findById(req.user.id);
        if(!user) return res.status(404).json({ msg: 'User not found' });

        const goal = user.goals.find(g => g.id === numericId);
        if(!goal) return res.status(404).json({ msg: 'Goal not found' });

        goal.completed = true;

        user.progress.main.goals += 1;
        await user.save();

        res.json({ msg: 'Goal completed successfully' });

    } catch (err) {
        console.error('Complete goal error:', err);
        res.status(500).json({ msg: 'Failed to complete goal' });
    }
};

exports.deleteGoal = async (req, res) => {
    const { id } = req.params;
    const numericId = Number(id);

    try {
        const user = await User.findById(req.user.id);
        if(!user) return res.status(404).json({ msg: 'User not found' });

        user.goals = (user.goals || []).filter(g => g && g.id !== numericId);

        await user.save();
        res.json({ msg: 'Goal deleted successfully' });

    } catch (err) {
        console.error('Delete goal error:', err);
        res.status(500).json({ msg: 'Failed to delete goal' });
    }
};