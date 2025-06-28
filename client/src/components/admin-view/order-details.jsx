import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/orders-slice";
import { useToast } from "../ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message,
        });
      }
    });
  }

  // Badge color logic
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "confirmed":
      case "delivered":
        return "bg-green-500";
      case "rejected":
        return "bg-red-600";
      case "pending":
        return "bg-yellow-500";
      case "inProcess":
        return "bg-blue-500";
      case "inShipping":
        return "bg-purple-500";
      default:
        return "bg-black";
    }
  };

  // Use the correct field for order items
  const items = orderDetails?.orderItems || [];

  return (
    <DialogContent className="w-full max-w-2xl max-h-[90vh] p-0 flex flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        <DialogTitle>Order Details</DialogTitle>
        <Separator className="my-4" />
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Order ID</TableCell>
              <TableCell>{orderDetails?._id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Order Date</TableCell>
              <TableCell>{orderDetails?.orderDate?.split("T")[0]}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Order Price</TableCell>
              <TableCell>Br{orderDetails?.totalAmount}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Payment method</TableCell>
              <TableCell>{orderDetails?.paymentMethod}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Payment Status</TableCell>
              <TableCell>{orderDetails?.paymentStatus}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Order Status</TableCell>
              <TableCell>
                <Badge
                  className={`py-1 px-3 capitalize ${getStatusBadgeColor(
                    orderDetails?.orderStatus
                  )}`}
                >
                  {orderDetails?.orderStatus}
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Separator className="my-4" />
        <div className="font-medium mb-2">Order Items</div>
        {items && items.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, idx) => (
                <TableRow key={item._id || idx}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>Br{item.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-gray-500 text-sm">No items in this order.</div>
        )}
        <Separator className="my-4" />
        <div className="font-medium mb-2">Shipping Info</div>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Name</TableCell>
              <TableCell>{user.userName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Address</TableCell>
              <TableCell>{orderDetails?.addressInfo?.address}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">City</TableCell>
              <TableCell>{orderDetails?.addressInfo?.city}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Pincode</TableCell>
              <TableCell>{orderDetails?.addressInfo?.pincode}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Phone</TableCell>
              <TableCell>{orderDetails?.addressInfo?.phone}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Notes</TableCell>
              <TableCell>{orderDetails?.addressInfo?.notes}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
