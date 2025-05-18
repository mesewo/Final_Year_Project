import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true }, // 'customer' or 'agent'
  text: { type: String, required: true },
  customerId: { type: String }, // For anonymous customers
  agentId: { type: String }, // For support agents
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Message', messageSchema);