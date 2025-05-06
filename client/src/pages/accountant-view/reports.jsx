import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, PieChart } from "@/components/ui/charts";
import { useMemo, useState } from "react";

export default function FinancialReports() {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date()
  });

  // Mock data - replace with real data from your API
  const reportData = useMemo(() => ({
    sales: [
      { month: 'Jan', value: 5000 },
      { month: 'Feb', value: 7000 },
      { month: 'Mar', value: 6500 },
      { month: 'Apr', value: 8000 },
      { month: 'May', value: 7500 },
    ],
    expenses: [
      { category: 'Inventory', value: 3000 },
      { category: 'Shipping', value: 1500 },
      { category: 'Marketing', value: 2000 },
      { category: 'Salaries', value: 5000 },
    ],
    profit: 12000
  }), [dateRange]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Financial Reports</h1>
        <div className="flex items-center gap-4">
          <CalendarDateRangePicker 
            dateRange={dateRange}
            onDateChange={setDateRange}
          />
          <Button>Export Report</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Sales</h3>
            <p className="text-2xl font-bold">Br{reportData.sales.reduce((sum, item) => sum + item.value, 0)}</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Expenses</h3>
            <p className="text-2xl font-bold">Br{reportData.expenses.reduce((sum, item) => sum + item.value, 0)}</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Net Profit</h3>
            <p className="text-2xl font-bold">Br{reportData.profit}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Report</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart 
                data={reportData.sales}
                xKey="month"
                yKey="value"
                color="#4CAF50"
                height={400}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Expenses Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart 
                data={reportData.expenses}
                nameKey="category"
                valueKey="value"
                height={400}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Report</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Inventory data visualization would go here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}