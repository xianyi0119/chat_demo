const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
    senderName: {
      type: String,
    },
    receiverInfo: {
      type: Map,
      of: Boolean
    },
    quote: {
      type: String,
    },  
    mentions: {
      type: Array,
    },  
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
