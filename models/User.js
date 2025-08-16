const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: {type: String, default: ''},
  xp: { type: Number, default: 0 },
  badges: [String],
  goals: {
    type: [
      {
      id: Number,
      text: String,
      completed: Boolean
      }
    ],
    default: []
  },
  tasks: [
    {
      subject: String,
      priority: String,
      datetime: Date,
      notes: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }
  ],
  progress: {
    main: {
      pomodoro: { type: Number, default: 0 },
      goals: { type: Number, default: 0 },
      level: { type: Number, default: 1 },
      lastLoginDate: { type: Date, default: null },
      streak: { type: Number, default: 0 }
    },
    daily: {
      type: Map,
      of: {
        pomodoro: { type: Number, default: 0 },
        goals: { type: Number, default: 0}
      },
      default: {}
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
