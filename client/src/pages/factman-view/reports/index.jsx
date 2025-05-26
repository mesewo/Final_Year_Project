import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchInventory } from "@/store/store-keeper/inventory-slice";
import { 
  generateUserActivityReport,
  generateSalesTrendReport
} from "@/store/factman/reports-slice";
import { LineChart } from "@/components/ui/charts";
import NotificationsTab from "./NotificationsTab";

export default function FactmanReports() {
  const dispatch = useDispatch();
  const { 
    userActivity, 
    salesTrend, 
    loading
  } = useSelector(state => state.factmanReports);

  // Use the same inventory as store-keeper
  const inventory = useSelector(state => state.inventory.inventory || []);

  // Filter low/out-of-stock
  const lowOrOutProducts = inventory.filter(
    p =>
      p.totalStock === 0 ||
      (p.totalStock > 0 && p.totalStock <= (p.lowStockThreshold ?? 5))
  );

  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date()
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Filtered user activity
  const filteredUserActivity = (userActivity || [])
    .filter(user =>
      (!roleFilter || user.role === roleFilter) &&
      (
        !searchQuery ||
        user.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

  useEffect(() => {
    dispatch(fetchInventory());
    dispatch(generateUserActivityReport({ days: 30 }));
    dispatch(generateSalesTrendReport({ days: 30 }));
    // Optionally: dispatch(fetchInventory()); // If you need to fetch inventory here
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
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="userActivity">
          <Card>
            <CardHeader>
              <CardTitle>User Activity Report</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filter and Search Controls */}
              <div className="flex flex-wrap gap-2 mb-4 items-center">
                <input
                  type="text"
                  placeholder="Search by user or role..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="border rounded px-2 py-1"
                />
                <select
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="Factman">Factory Manager</option>
                  <option value="store_keeper">Store keeper</option>
                  <option value="seller">Seller</option>
                  <option value="buyer">Buyer</option>
                  <option value="accountant">Accountant</option>
                </select>
              </div>
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
                  {filteredUserActivity.map(user => (
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

        <TabsContent value="notifications">
          <NotificationsTab products={lowOrOutProducts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}