const mongoose = require('mongoose');
const crypto = require('crypto');

const messageSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => crypto.randomUUID(),
    },
    channel_id: {
      type: String,
      required: true,
      index: true,
    },
    author_id: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['text', 'voice', 'img', 'file', 'system', 'gif'],
      default: 'text',
    },
  },
  {
    _id: false,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

messageSchema.index({ channel_id: 1, created_at: -1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
