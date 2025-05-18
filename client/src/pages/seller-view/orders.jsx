import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerOrders, updateOrderStatus } from "@/store/seller/orders-slice";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SellerOrderDetailsView from "./order-details"; // Adjust path if needed

export default function SellerOrders() {
  const dispatch = useDispatch();
  const { orders, status, error } = useSelector((state) => state.sellerOrders);
  const { user } = useSelector((state) => state.auth);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  // Always use an array for mapping
  const ordersArray = Array.isArray(orders) ? orders : [];

  if (status === "loading") return <div>Loading orders...</div>;
  if (status === "failed") return <div>Error: {error || "Failed to load orders."}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Orders</h1>
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
            {ordersArray.map((order) => (
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
    </div>
  );
}