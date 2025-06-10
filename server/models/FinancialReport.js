import mongoose from "mongoose";

const financialReportSchema = new mongoose.Schema({
  reportType: { type: String, required: true }, // e.g., "sales", "expenses", "profitLoss"
  filters: { type: Object }, // e.g., { dateRange: {...}, category: "..." }
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  generatedAt: { type: Date, default: Date.now },
  data: { type: Object }, // The actual report data (summary, totals, etc.)
});

const FinancialReport = mongoose.model("FinancialReport", financialReportSchema);
export default FinancialReport;