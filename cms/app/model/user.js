'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true }, // unique唯一索引
    password: { type: String, required: true },
    nickname: { type: String, required: true },
    avatar: { type: String, required: false, default: '/user.png' },
    following: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    likeArticle: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
    },
    disLikeArticle: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
    },
  }, { timestamps: true });
  return mongoose.model('User', UserSchema);
};
