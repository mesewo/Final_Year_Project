import { useSelector } from "react-redux";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";

function FactmanOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

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

  return (
    <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-0">
      <div className="p-6">
        <DialogTitle>Order Details</DialogTitle>
        <Separator className="my-4" />
        {/* Order Info Table */}
        <table className="min-w-full mb-6">
          <tbody>
            <tr>
              <td className="font-medium pr-4 py-2">Order ID</td>
              <td>{orderDetails?._id}</td>
            </tr>
            <tr>
              <td className="font-medium pr-4 py-2">Order Date</td>
              <td>{orderDetails?.orderDate?.split("T")[0]}</td>
            </tr>
            <tr>
              <td className="font-medium pr-4 py-2">Order Price</td>
              <td>Br{orderDetails?.totalAmount}</td>
            </tr>
            <tr>
              <td className="font-medium pr-4 py-2">Payment Method</td>
              <td>{orderDetails?.paymentMethod}</td>
            </tr>
            <tr>
              <td className="font-medium pr-4 py-2">Payment Status</td>
              <td>{orderDetails?.paymentStatus}</td>
            </tr>
            <tr>
              <td className="font-medium pr-4 py-2">Order Status</td>
              <td>
                <Badge
                  className={`py-1 px-3 capitalize ${getStatusBadgeColor(
                    orderDetails?.orderStatus
                  )}`}
                >
                  {orderDetails?.orderStatus}
                </Badge>
              </td>
            </tr>
          </tbody>
        </table>
        <Separator className="my-4" />
        {/* Order Items Table */}
        <div className="font-medium mb-2">Order Items</div>
        {orderDetails?.orderItems && orderDetails?.orderItems.length > 0 ? (
          <table className="min-w-full border mb-6">
            <thead>
              <tr>
                <th className="text-left px-2 py-1 border">Title</th>
                <th className="text-left px-2 py-1 border">Quantity</th>
                <th className="text-left px-2 py-1 border">Price</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.orderItems.map((item, idx) => (
                <tr key={item._id || idx}>
                  <td className="border px-2 py-1">{item.title}</td>
                  <td className="border px-2 py-1">{item.quantity}</td>
                  <td className="border px-2 py-1">Br{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-500 text-sm mb-6">
            No items in this order.
          </div>
        )}
        <Separator className="my-4" />
        {/* Shipping Info Table */}
        <div className="font-medium mb-2">Shipping Info</div>
        <table className="min-w-full">
          <tbody>
            <tr>
              <td className="font-medium pr-4 py-2">Name</td>
              <td>{user.userName}</td>
            </tr>
            <tr>
              <td className="font-medium pr-4 py-2">Address</td>
              <td>{orderDetails?.addressInfo?.address}</td>
            </tr>
            <tr>
              <td className="font-medium pr-4 py-2">City</td>
              <td>{orderDetails?.addressInfo?.city}</td>
            </tr>
            <tr>
              <td className="font-medium pr-4 py-2">Pincode</td>
              <td>{orderDetails?.addressInfo?.pincode}</td>
            </tr>
            <tr>
              <td className="font-medium pr-4 py-2">Phone</td>
              <td>{orderDetails?.addressInfo?.phone}</td>
            </tr>
            <tr>
              <td className="font-medium pr-4 py-2">Notes</td>
              <td>{orderDetails?.addressInfo?.notes}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </DialogContent>
  );
}

export default FactmanOrderDetailsView;
