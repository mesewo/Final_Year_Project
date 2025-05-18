import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['customer', 'support'] }
  }],
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    timestamp: { type: Date, default: Date.now }
  }],
  status: { type: String, enum: ['active', 'resolved'], default: 'active' }
});

export default mongoose.model("Chat", chatSchema);