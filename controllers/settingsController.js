const User = require('../models/User');

exports.updateSettings = async (req, res) => {
    try {
        const { username, avatar } = req.body;

        const user = await User.findById(req.user.id);
        if(!user) return res.status(404).json({ msg: 'User not found' });
        
        if(username !== undefined) user.username = username;
        if(avatar !== undefined) {
            user.avatar = avatar === '' ? '' : avatar;
        } 
        
        await user.save();

        res.json({ msg: 'Settings updated', user: { username: user.username, avatar: user.avatar } });

    } catch (err) {
        console.error('Error updating settings', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if(!user) return res.status(404).json({ msg: 'User not found' });

        res.json({ username: user.username, avatar: user.avatar || '' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    } 
};