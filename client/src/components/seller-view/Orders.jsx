import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerOrders } from "@/store/seller/orders-slice";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SellerOrderDetailsView from "./order-details";
import { Search } from "lucide-react";
import { format } from "date-fns";

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, status, error } = useSelector((state) => state.sellerOrders);
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState(null); // {orderId, newStatus}

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchSellerOrders(user.id));
    }
  }, [dispatch, user?.id]);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400";
      case "rejected":
        return "bg-rose-50 text-rose-800 dark:bg-rose-900/20 dark:text-rose-400";
      case "pending":
        return "bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
      case "shipped":
        return "bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "delivered":
        return "bg-violet-50 text-violet-800 dark:bg-violet-900/20 dark:text-violet-400";
      default:
        return "bg-gray-50 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300";
    }
  };

  const getLatestStatusUpdate = (order) => {
    if (order.deliveredAt) return { time: order.deliveredAt, status: "delivered" };
    if (order.shippedAt) return { time: order.shippedAt, status: "shipped" };
    if (order.rejectedAt) return { time: order.rejectedAt, status: "rejected" };
    if (order.approvedAt) return { time: order.approvedAt, status: "confirmed" };
    return { time: order.createdAt, status: "pending" };
  };

  if (status === "loading") return <div className="p-4 text-center">Loading orders...</div>;
  if (status === "failed") return <div className="p-4 text-center text-rose-600">Error: {error}</div>;

  const ordersArray = Array.isArray(orders) ? orders : [];

  const filteredOrders = ordersArray.filter(order =>
    order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.totalAmount && order.totalAmount.toString().includes(searchTerm)) ||
    (order.buyer?.userName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (order.buyer?.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-col gap-4 bg-gray-50 dark:bg-gray-800/30 rounded-t-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-xl font-semibold">Order Management</CardTitle>
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="pl-9 bg-white dark:bg-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={status === "loading"}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-800/30">
            <TableRow>
              <TableHead className="w-[120px]">Order ID</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Update</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No matching orders found" : "No orders available"}
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => {
                const lastUpdate = getLatestStatusUpdate(order);
                return (
                  <TableRow key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20">
                    <TableCell className="font-medium">#{order._id?.slice(-6)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{order.buyer?.userName || "N/A"}</span>
                        <span className="text-sm text-muted-foreground">{order.buyer?.email || ""}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusBadgeVariant(order.orderStatus)} rounded-full px-2.5 py-1 text-xs`}>
                        {order.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {lastUpdate.time ? format(new Date(lastUpdate.time), "MMM dd, yyyy") : "N/A"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {lastUpdate.time ? format(new Date(lastUpdate.time), "h:mm a") : ""}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      Br{order.totalAmount?.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {order.createdAt ? format(new Date(order.createdAt), "MMM dd, yyyy") : "N/A"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {order.createdAt ? format(new Date(order.createdAt), "h:mm a") : ""}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
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
                            className="hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => {
                              setSelectedOrder(order);
                              setOpenDetailsDialog(true);
                            }}
                          >
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                          <div className="p-6">
                            <SellerOrderDetailsView orderDetails={selectedOrder} />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Orders;