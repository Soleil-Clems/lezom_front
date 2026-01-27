const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

messageSchema.index({ channel_id: 1, created_at: -1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
