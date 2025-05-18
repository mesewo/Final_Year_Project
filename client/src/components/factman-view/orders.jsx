import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/orders-slice";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Search } from "lucide-react";

function factmanorderView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails, loading } = useSelector((state) => state.adminOrder || {});
  const dispatch = useDispatch();

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(getAllOrdersForAdmin());
  };

  // Calculate counts for status and time filters
  const statusCounts = orderList?.reduce((acc, order) => {
    acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
    return acc;
  }, {});

  const timeCounts = {
    today: 0,
    thisWeek: 0,
    lastWeek: 0,
    thisMonth: 0,
    lastMonth: 0,
    thisYear: 0,
    lastYear: 0,
  };

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentWeek = getWeekNumber(now);
  
  orderList?.forEach(order => {
    const orderDate = new Date(order.orderDate);
    const orderYear = orderDate.getFullYear();
    const orderMonth = orderDate.getMonth();
    const orderWeek = getWeekNumber(orderDate);
    
    if (isSameDay(orderDate, now)) timeCounts.today++;
    if (orderYear === currentYear && orderWeek === currentWeek) timeCounts.thisWeek++;
    if (orderYear === currentYear && orderWeek === currentWeek - 1) timeCounts.lastWeek++;
    if (orderYear === currentYear && orderMonth === currentMonth) timeCounts.thisMonth++;
    if ((orderYear === currentYear && orderMonth === currentMonth - 1) || 
        (orderMonth === 11 && currentMonth === 0 && orderYear === currentYear - 1)) timeCounts.lastMonth++;
    if (orderYear === currentYear) timeCounts.thisYear++;
    if (orderYear === currentYear - 1) timeCounts.lastYear++;
  });

  // Filter orders based on selected filters and search term
  const filteredOrders = orderList?.filter(order => {
    // Status filter
    const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;
    
    // Time filter
    const orderDate = new Date(order.orderDate);
    let matchesTime = true;
    
    if (timeFilter !== "all") {
      const orderYear = orderDate.getFullYear();
      const orderMonth = orderDate.getMonth();
      const orderWeek = getWeekNumber(orderDate);
      
      switch(timeFilter) {
        case "today":
          matchesTime = isSameDay(orderDate, now);
          break;
        case "thisWeek":
          matchesTime = orderYear === currentYear && orderWeek === currentWeek;
          break;
        case "lastWeek":
          matchesTime = orderYear === currentYear && orderWeek === currentWeek - 1;
          break;
        case "thisMonth":
          matchesTime = orderYear === currentYear && orderMonth === currentMonth;
          break;
        case "lastMonth":
          matchesTime = (orderYear === currentYear && orderMonth === currentMonth - 1) || 
                       (orderMonth === 11 && currentMonth === 0 && orderYear === currentYear - 1);
          break;
        case "thisYear":
          matchesTime = orderYear === currentYear;
          break;
        case "lastYear":
          matchesTime = orderYear === currentYear - 1;
          break;
      }
    }
    
    // Search term
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.totalAmount.toString().includes(searchTerm);
    
    return matchesStatus && matchesTime && matchesSearch;
  });

  // Helper functions for date calculations
  function getWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d - week1) / 86400000 + (week1.getDay() + 6) % 7 - 3) / 7);
  }

  function isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <CardTitle>All Orders</CardTitle>
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative col-span-1 md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, date, or price..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
          </div>
          
          {/* Status Filter */}
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses ({orderList?.length || 0})</SelectItem>
              <SelectItem value="confirmed">Confirmed ({statusCounts?.confirmed || 0})</SelectItem>
              <SelectItem value="pending">Pending ({statusCounts?.pending || 0})</SelectItem>
              <SelectItem value="rejected">Rejected ({statusCounts?.rejected || 0})</SelectItem>
              <SelectItem value="shipped">Shipped ({statusCounts?.shipped || 0})</SelectItem>
              <SelectItem value="delivered">Delivered ({statusCounts?.delivered || 0})</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Time Filter */}
          <Select 
            value={timeFilter} 
            onValueChange={setTimeFilter}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time ({orderList?.length || 0})</SelectItem>
              <SelectItem value="today">Today ({timeCounts.today})</SelectItem>
              <SelectItem value="thisWeek">This Week ({timeCounts.thisWeek})</SelectItem>
              <SelectItem value="lastWeek">Last Week ({timeCounts.lastWeek})</SelectItem>
              <SelectItem value="thisMonth">This Month ({timeCounts.thisMonth})</SelectItem>
              <SelectItem value="lastMonth">Last Month ({timeCounts.lastMonth})</SelectItem>
              <SelectItem value="thisYear">This Year ({timeCounts.thisYear})</SelectItem>
              <SelectItem value="lastYear">Last Year ({timeCounts.lastYear})</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : filteredOrders && filteredOrders.length > 0 ? (
              filteredOrders.map((orderItem) => (
                <TableRow key={orderItem._id}>
                  <TableCell className="font-medium">{orderItem._id}</TableCell>
                  <TableCell>{new Date(orderItem.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`capitalize ${
                        orderItem.orderStatus === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : orderItem.orderStatus === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {orderItem.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>Br {orderItem.totalAmount.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFetchOrderDetails(orderItem._id)}
                          disabled={loading}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent size="xl">
                        <div className="p-4 max-h-[75vh] overflow-y-auto">
                          <AdminOrderDetailsView orderDetails={orderDetails} />
                          <div className="mt-4 flex justify-end">
                            <Button 
                              onClick={() => {
                                setOpenDetailsDialog(false);
                                dispatch(resetOrderDetails());
                              }}
                            >
                              Close
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No orders found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default factmanorderView;