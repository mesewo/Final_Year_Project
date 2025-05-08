import { BarChart, LineChart } from "@/components/ui/charts";

export function FinanceCharts({ salesData, expensesData }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-4">Monthly Sales</h3>
        <div className="h-64">
          <BarChart
            data={salesData}
            xKey="month"
            yKey="amount"
            color="#4CAF50"
          />
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-4">Expense Breakdown</h3>
        <div className="h-64">
          <LineChart
            data={expensesData}
            xKey="category"
            yKey="amount"
            color="#F44336"
          />
        </div>
      </div>
    </div>
  );
}