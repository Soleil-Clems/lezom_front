const mongoose = require('mongoose');
const crypto = require('crypto');

const privateMessageSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => crypto.randomUUID(),
    },
    conversation_id: {
      type: String,
      required: true,
      index: true,
    },
    sender_id: {
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

privateMessageSchema.index({ conversation_id: 1, created_at: -1 });

const PrivateMessage = mongoose.model('PrivateMessage', privateMessageSchema);

module.exports = PrivateMessage;
