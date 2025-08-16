const User = require('../models/User');

exports.saveTask = async (req, res) => {
    try {
        const { subject, priority, datetime, notes } = req.body;
        const user = await User.findById(req.user.id);
        if(!user) return res.status(404).json({ msg: 'User not found' });

        const task = { subject, priority, datetime, notes };
        user.tasks.push(task);
        await user.save();

        res.json({ msg: 'Task saved', task});

    } catch (err) {
        console.error('Save task error:', err);
        res.status(500).json({ msg: 'Error saving task' });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if(!user) return res.status(404).json({ msg: 'User not found' });

        res.json(user.tasks);

    } catch (err) {
        console.error('Error fetching tasks', err);
        res.status(500).json({ msg: 'Error fetching tasks' });
    }
};