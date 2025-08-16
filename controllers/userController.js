const User = require('../models/User');

exports.updateXP = async (req, res) => {
    const { xp, badges } = req.body;

    try{
        const user = await User.findById(req.user.id);
        if(!user) return res.status(404).json({ msg: 'User not found' });

        user.xp = xp;
        user.badges = badges;

        const newLevel = Math.floor(user.xp/100) + 1;
        user.level = newLevel;

        await user.save();
        res.json({ xp: user.xp, badges: user.badges, level: user.level });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'XP update failed' });
    }
};