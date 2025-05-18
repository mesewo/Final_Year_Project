import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerOrders } from "@/store/seller/orders-slice";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SellerOrderDetailsView from "./order-details"; // Create or import your details component
import { Search } from "lucide-react";

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, status, error } = useSelector((state) => state.sellerOrders);
  const { user } = useSelector((state) => state.auth);

  // For search and dialog
  const [searchTerm, setSearchTerm] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchSellerOrders(user.id));
    }
  }, [dispatch, user?.id]);

  if (status === "loading") return <div>Loading orders...</div>;
  if (status === "failed") return <div>Error: {error}</div>;

  const ordersArray = Array.isArray(orders) ? orders : [];

  // Filter by search term
  const filteredOrders = ordersArray.filter(order =>
    order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.totalAmount && order.totalAmount.toString().includes(searchTerm))
  );

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <CardTitle>My Orders</CardTitle>
        </div>
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Order ID or Price..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={status === "loading"}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>#{order._id?.slice(-6)}</TableCell>
                  <TableCell>
                    <Badge>{order.orderStatus}</Badge>
                  </TableCell>
                  <TableCell>Br{order.totalAmount}</TableCell>
                  <TableCell>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Orders;