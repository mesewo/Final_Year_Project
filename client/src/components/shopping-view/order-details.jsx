import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);
  const isSeller = user?.role === "seller";

  const statusVariant = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const paymentVariant = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
      <div className="space-y-4">
        <DialogTitle className="text-2xl font-bold text-gray-800">
          Order Details
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-500">
          Order ID: {orderDetails?._id}
        </DialogDescription>

        {/* Order Summary Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Order Date</p>
              <p className="font-medium">
                {new Date(orderDetails?.orderDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Amount</p>
              <p className="font-medium">Br{orderDetails?.totalAmount?.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Payment Status</p>
              <Badge className={`${paymentVariant(orderDetails?.paymentStatus)} text-xs py-1 px-2`}>
                {orderDetails?.paymentStatus}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Order Status</p>
              <Badge className={`${statusVariant(orderDetails?.orderStatus)} text-xs py-1 px-2`}>
                {orderDetails?.orderStatus}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Order Items Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Order Items</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orderDetails?.cartItems?.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      Br{item.price?.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      Br{(item.price * item.quantity)?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan="3" className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                    Subtotal
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    Br{orderDetails?.totalAmount?.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <Separator />

        {/* Shipping Information */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Shipping Information</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Customer</h4>
                <p className="font-medium">{user.userName}</p>
                <p className="text-sm text-gray-500">{orderDetails?.addressInfo?.phone}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Shipping Address</h4>
                <p className="text-sm">
                  {orderDetails?.addressInfo?.address}, {orderDetails?.addressInfo?.city}
                </p>
                <p className="text-sm">Pincode: {orderDetails?.addressInfo?.pincode}</p>
                {orderDetails?.addressInfo?.notes && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-500">Delivery Notes:</p>
                    <p className="text-xs italic">{orderDetails?.addressInfo?.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Seller Actions */}
        {isSeller && (
          <>
            <Separator />
            <div className="flex justify-end space-x-3">
              {orderDetails?.orderStatus === "confirmed" && (
                <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                  Mark as Shipped
                </Button>
              )}
              {orderDetails?.orderStatus === "shipped" && (
                <Button variant="default" className="bg-green-600 hover:bg-green-700">
                  Mark as Delivered
                </Button>
              )}
              <Button variant="outline">Print Invoice</Button>
            </div>
          </>
        )}
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;