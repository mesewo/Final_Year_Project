import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { useDispatch, useSelector } from "react-redux";
import { getFinancialSummary } from "@/store/accountant/finance-slice";
import { useEffect, useState } from "react";
import { BarChart } from "@/components/ui/charts";

export default function AccountantFinances() {
  const dispatch = useDispatch();
  const { summary, loading } = useSelector(state => state.accountantFinance);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date()
  });

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      dispatch(getFinancialSummary({
        startDate: dateRange.start.toISOString(),
        endDate: dateRange.end.toISOString()
      }));
    }
  }, [dateRange, dispatch]);

  const chartData = [
    { name: 'Sales', value: summary?.totalSales || 0 },
    { name: 'Expenses', value: summary?.totalExpenses || 0 },
    { name: 'Profit', value: (summary?.totalSales || 0) - (summary?.totalExpenses || 0) }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Financial Overview</h1>
        <CalendarDateRangePicker 
          dateRange={dateRange}
          onDateChange={setDateRange}
        />
      </div>

      {loading ? (
        <div>Loading financial data...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Br{summary?.totalSales?.toFixed(2) || '0.00'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Br{summary?.totalExpenses?.toFixed(2) || '0.00'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                Br{((summary?.totalSales || 0) - (summary?.totalExpenses || 0)).toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Br{summary?.inventoryValue?.toFixed(2) || '0.00'}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Financial Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <BarChart 
            data={chartData}
            xKey="name"
            yKey="value"
            colors={['#4CAF50', '#F44336', '#2196F3']}
          />
        </CardContent>
      </Card>
    </div>
  );
}