const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try{
        const userExists = await User.findOne({ email });
        if(userExists) return res.status(400).json({ msg: 'User already exists'});

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User ({
            username,
            email,
            password: hashedPassword,
            progress: {
                main: {
                    level: 1,
                    streak: 0,
                    lastLoginDate: null,
                    pomodoro: 0,
                    goals: 0
                }
            } 
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            msg: 'User registered successfully',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                xp: newUser.xp,
                badges: newUser.badges
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error during registration' });
    }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid password' });

    if (!user.progress || !user.progress.main) {
      user.progress = {
        main: {
          level: 1,
          streak: 0,
          lastLoginDate: null,
          pomodoro: 0,
          goals: 0
        }
      };
    }

    const userProgress = user.progress.main;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let bonusXP = 0;
    const lastLogin = userProgress.lastLoginDate
      ? new Date(userProgress.lastLoginDate)
      : null;

    const lastLoginTime = lastLogin ? new Date(lastLogin).setHours(0, 0, 0, 0) : null;

    if (!lastLoginTime || today.getTime() !== lastLoginTime) {
      if (lastLoginTime && today.getTime() - lastLoginTime === 86400000) {
        userProgress.streak += 1;
      } else {
        userProgress.streak = 1;
      }

      userProgress.lastLoginDate = new Date();
      bonusXP = 10 * userProgress.streak;
      user.xp += bonusXP;

      if (
        userProgress.streak >= 5 &&
        !user.badges.includes('🔥 Streak Master')
      ) {
        user.badges.push('🔥 Streak Master');
      }

      user.progress.main = userProgress;
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        xp: user.xp,
        badges: user.badges,
        streak: userProgress.streak,
        bonusXP
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error during login' });
  }
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user?.id || req.body.userId;
        if(!userId)  return res.status(400).json({ msg: 'User ID required' });

        const user = await User.findById(userId).select('-password');
        if(!user) return res.status(404).json({ msg: 'User not found' });

        const userProgress = user.progress?.main || {};

        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            xp: user.xp,
            badges: user.badges,
            streak: userProgress.streak || 0,
            level: userProgress.level || 1,
            progress: {
              main: {
                goals: userProgress.goals || 0,
              }
            }
        });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Server error while fetching profile', error: err.message });
    }
};

