import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { useDispatch, useSelector } from "react-redux";
import { 
  generateUserActivityReport,
  generateSalesTrendReport
} from "@/store/admin/reports-slice";
import { useEffect, useState } from "react";
import { LineChart } from "@/components/ui/charts";

export default function AdminReports() {
  const dispatch = useDispatch();
  const { 
    userActivity, 
    salesTrend, 
    loading 
  } = useSelector(state => state.adminReports);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date()
  });

  useEffect(() => {
    dispatch(generateUserActivityReport({ days: 30 }));
    dispatch(generateSalesTrendReport({ days: 30 }));
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <CalendarDateRangePicker 
          dateRange={dateRange}
          onDateChange={setDateRange}
        />
      </div>

      <Tabs defaultValue="userActivity">
        <TabsList>
          <TabsTrigger value="userActivity">User Activity</TabsTrigger>
          <TabsTrigger value="salesTrend">Sales Trend</TabsTrigger>
        </TabsList>
        
        <TabsContent value="userActivity">
          <Card>
            <CardHeader>
              <CardTitle>User Activity Report</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userActivity?.map(user => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.userName}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{user.orderCount}</TableCell>
                      <TableCell>Br{user.totalSpent?.toFixed(2) || '0.00'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="salesTrend">
          <Card>
            <CardHeader>
              <CardTitle>Sales Trend Report</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <LineChart 
                data={salesTrend}
                xKey="_id"
                yKey="totalSales"
                color="#4CAF50"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}