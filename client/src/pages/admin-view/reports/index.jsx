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

// Helper function for "time ago"
function timeAgo(date) {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(months / 12);
  return `${years} years ago`;
}

export default function AdminReports() {
  const dispatch = useDispatch();
  const { 
    userActivity, 
    salesTrend, 
    loading 
  } = useSelector(state => state.adminReports);

  // Get current logged-in user (admin)
  const currentUser = useSelector(state => state.auth?.user);

  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date()
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [onlineFilter, setOnlineFilter] = useState("");

  // Filtered user activity (exclude self, filter by role and online/offline)
  const filteredUserActivity = (userActivity || [])
    .filter(user => {
      // Exclude current logged-in user (robust: check both _id and email)
      if (
        (currentUser && user._id && user._id === currentUser._id) ||
        (currentUser && user.email && user.email === currentUser.email)
      ) {
        return false;
      }

      // Calculate online status
      const lastLoginDate = new Date(user.lastLogin);
      const now = new Date();
      const isOnline = (now - lastLoginDate) < 5 * 60 * 1000; // 5 minutes

      // Role filter
      if (roleFilter && user.role !== roleFilter) return false;

      // Online filter
      if (onlineFilter === "online" && !isOnline) return false;
      if (onlineFilter === "offline" && isOnline) return false;

      // Search filter (userName, role, email)
      if (
        searchQuery &&
        !(
          (user.userName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.role?.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.email?.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin)); // Sort by latest

  useEffect(() => {
    dispatch(generateUserActivityReport({ days: 30 }));
    dispatch(generateSalesTrendReport({ days: 30 }));
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 items-center justify-between">
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
              <div className="flex flex-wrap gap-2 items-center mt-4">
                <input
                  type="text"
                  placeholder="Search by user, role, or email..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="border rounded px-2 py-1 text-lg"
                />
                <select
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value)}
                  className="border rounded px-2 py-1 text-lg"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="Factman">Factory Manager</option>
                  <option value="store_keeper">Store keeper</option>
                  <option value="seller">Seller</option>
                  <option value="buyer">Buyer</option>
                  <option value="accountant">Accountant</option>
                </select>
                <select
                  value={onlineFilter}
                  onChange={e => setOnlineFilter(e.target.value)}
                  className="border rounded px-2 py-1 text-lg"
                >
                  <option value="">All Status</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <Table className="text-lg">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-lg">User</TableHead>
                    <TableHead className="text-lg">Email</TableHead>
                    <TableHead className="text-lg">Role</TableHead>
                    <TableHead className="text-lg">Last Login</TableHead>
                    <TableHead className="text-lg">Orders</TableHead>
                    <TableHead className="text-lg">Total Spent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUserActivity.map(user => {
                    const lastLoginDate = new Date(user.lastLogin);
                    const now = new Date();
                    const isOnline = (now - lastLoginDate) < 5 * 60 * 1000; // 5 minutes
                    return (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium text-lg flex flex-col gap-1">
                          <span>{user.userName}</span>
                          {isOnline ? (
                            <span className="ml-2 text-green-600 text-base font-semibold">(Online)</span>
                          ) : (
                            <span className="ml-2 text-gray-400 text-base">(Offline)</span>
                          )}
                        </TableCell>
                        <TableCell className="text-lg">{user.email}</TableCell>
                        <TableCell className="text-lg">{user.role}</TableCell>
                        <TableCell className="text-lg">
                          {lastLoginDate.toLocaleDateString()}{" "}
                          <span className="text-gray-500 text-base">
                            {lastLoginDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <div className="text-xs text-gray-500">{timeAgo(lastLoginDate)}</div>
                        </TableCell>
                        <TableCell className="text-lg">{user.orderCount}</TableCell>
                        <TableCell className="text-lg">Br{user.totalSpent?.toFixed(2) || '0.00'}</TableCell>
                      </TableRow>
                    );
                  })}
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