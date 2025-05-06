import Feedback from "../../models/Feedback.js";
import User from "../../models/User.js";

export const getSupportTickets = async (req, res) => {
  try {
    const tickets = await Feedback.find({ type: "service" })
      .populate("user", "userName email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const respondToTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { response } = req.body;

    const ticket = await Feedback.findByIdAndUpdate(
      ticketId,
      {
        status: "resolved",
        response: {
          text: response,
          respondedBy: req.user.id,
          respondedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default {
  getSupportTickets,
  respondToTicket,
};