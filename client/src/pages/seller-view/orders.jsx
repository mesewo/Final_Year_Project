import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerOrders, updateOrderStatus } from "@/store/seller/orders-slice";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SellerOrderDetailsView from "./order-details"; // Adjust path if needed
import { Input } from "@/components/ui/input";
import Html5QrScanner from "@/components/common/Html5QrScanner";
import { getOrderDetailsForSeller } from "@/store/seller/orders-slice";
import { useToast } from "@/components/ui/use-toast"; // Adjust path if needed 

export default function SellerOrders() {
  const dispatch = useDispatch();
  const { orders, status, error } = useSelector((state) => state.sellerOrders);
  const { user } = useSelector((state) => state.auth);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedOrder, setScannedOrder] = useState(null);

  const { toast } = useToast();

  const handleScanOrderId = async (orderId) => {
    setScannerOpen(false);
    if (orderId) {
      const res = await dispatch(getOrderDetailsForSeller(orderId));
      if (res.payload) {
        setSelectedOrder(res.payload);
        setOpenDetailsDialog(true); // Open the details modal just like "View Details"
      } else {
        toast({
          title: "Order Not Found",
          description: "No order was found for this QR code. Please check and try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Invalid QR Code",
        description: "The scanned QR code is not valid for an order.",
        variant: "destructive",
      });
    }
  };


  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchSellerOrders(user.id));
    }
  }, [dispatch, user?.id]);

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const statusVariant = {
    pending: "secondary",
    processing: "info",
    shipped: "warning",
    delivered: "success",
    cancelled: "destructive"
  };

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  // Always use an array for mapping, and sort by newest first
  const ordersArray = Array.isArray(orders)
    ? [...orders].sort((a, b) => new Date(b.createdAt || b.orderDate) - new Date(a.createdAt || a.orderDate))
    : [];

  // Time filter helpers
  function isWithinTime(date, filter) {
    const d = new Date(date);
    const now = new Date();

    if (filter === "all") return true;
    if (filter === "today") return d.toDateString() === now.toDateString();

    if (filter === "yesterday") {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      return d.toDateString() === yesterday.toDateString();
    }

    if (filter === "this_week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      return d >= startOfWeek && d <= endOfWeek;
    }

    if (filter === "last_week") {
      const startOfThisWeek = new Date(now);
      startOfThisWeek.setDate(now.getDate() - now.getDay());
      startOfThisWeek.setHours(0, 0, 0, 0);
      const startOfLastWeek = new Date(startOfThisWeek);
      startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);
      const endOfLastWeek = new Date(startOfThisWeek);
      endOfLastWeek.setDate(startOfThisWeek.getDate() - 1);
      endOfLastWeek.setHours(23, 59, 59, 999);
      return d >= startOfLastWeek && d <= endOfLastWeek;
    }

    if (filter === "this_month") {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }

    if (filter === "last_month") {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return (
        d.getMonth() === lastMonth.getMonth() &&
        d.getFullYear() === lastMonth.getFullYear()
      );
    }

    if (filter === "this_year") {
      return d.getFullYear() === now.getFullYear();
    }

    return true;
  }

  // First, filter by search and status
  const baseFilteredOrders = ordersArray.filter(order => {
    const statusMatch = statusFilter === "all" || (order.status || order.orderStatus) === statusFilter;
    const searchMatch =
      search === "" ||
      (order._id && order._id.includes(search)) ||
      (order.customerName && order.customerName.toLowerCase().includes(search.toLowerCase())) ||
      (order.userId && order.userId.toLowerCase().includes(search.toLowerCase()));
    return statusMatch && searchMatch;
  });

  // Then, count for each time filter using baseFilteredOrders
  const timeCounts = Object.fromEntries(
    timeOptions.map(opt => [
      opt.value,
      baseFilteredOrders.filter(order => isWithinTime(order.createdAt || order.orderDate, opt.value)).length
    ])
  );

  // Finally, apply the time filter for display
  const filteredOrders = baseFilteredOrders.filter(order =>
    isWithinTime(order.createdAt || order.orderDate, timeFilter)
  );

  if (status === "loading") return <div>Loading orders...</div>;
  if (status === "failed") return <div>Error: {error || "Failed to load orders."}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Button variant="outline" onClick={() => setScannerOpen(true)}>
          Scan Order QR
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <Input
          placeholder="Search by Order ID or Customer"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-64"
        />
        <select
          className="border rounded px-2 py-1"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Time Filter as Row of Buttons */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="font-medium">Time:</span>
        {timeOptions.map(opt => (
          <button
            key={opt.value}
            className={`px-3 py-1 rounded border ${
              timeFilter === opt.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 text-gray-700 border-gray-300"
            }`}
            onClick={() => setTimeFilter(opt.value)}
            type="button"
          >
            {opt.label} <span className="ml-1 text-xs text-gray-500">({timeCounts[opt.value]})</span>
          </button>
        ))}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium">#{order._id?.slice(-6)}</TableCell>
                <TableCell>
                  {order.customerName || order.userId || "N/A"}
                </TableCell>
                <TableCell>
                  {order.items?.length ?? order.orderItems?.length ?? 0}
                </TableCell>
                <TableCell>Br{order.totalAmount}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[order.status || order.orderStatus] || "secondary"}>
                    {order.status || order.orderStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Update Status
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {statusOptions.map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() => handleStatusChange(order._id, option.value)}
                          >
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Dialog
                      open={openDetailsDialog && selectedOrder?._id === order._id}
                      onOpenChange={(open) => {
                        setOpenDetailsDialog(open);
                        if (!open) setSelectedOrder(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setOpenDetailsDialog(true);
                          }}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-4">
                          <SellerOrderDetailsView orderDetails={selectedOrder} />
                          <div className="mt-4 flex justify-end">
                            <Button onClick={() => setOpenDetailsDialog(false)}>
                              Close
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* QR Scanner Modal */}
      <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
        <DialogContent className="w-full max-w-md">
          <Html5QrScanner
            onScanOrderId={handleScanOrderId}
            onClose={() => setScannerOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Scanned Order Details Modal */}
      <Dialog open={!!scannedOrder} onOpenChange={(open) => !open && setScannedOrder(null)}>
        <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {scannedOrder && (
            <div className="p-4">
              <SellerOrderDetailsView orderDetails={scannedOrder} />
              <div className="mt-4 flex justify-end">
                <Button onClick={() => setScannedOrder(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

const timeOptions = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "this_week", label: "This Week" },
  { value: "last_week", label: "Last Week" },
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "this_year", label: "This Year" },
];