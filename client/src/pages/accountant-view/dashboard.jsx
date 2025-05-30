import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart } from "@/components/ui/charts"; // You'll need to create this
import { Button } from "@/components/ui/button";
export default function AccountantDashboard() {
  const financialData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    revenues: [5000, 7000, 6500, 8000, 7500],
    expenses: [3000, 4000, 3500, 4500, 4000]
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Financial Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Br 7,500</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Br 4,000</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$3,500</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={financialData}
              revenueColor="#4CAF50"
              expenseColor="#F44336"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full">
              Generate Sales Report
            </Button>
            <Button variant="outline" className="w-full">
              Export Financial Statement
            </Button>
            <Button variant="outline" className="w-full">
              View Tax Records
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}