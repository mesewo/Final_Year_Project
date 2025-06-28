import { useRef } from "react";
import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import QRCode from "react-qr-code";

function getDayDifference(start, end) {
  if (!start || !end) return "-";
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = endDate - startDate;
  return Math.max(0, Math.round(diffTime / (1000 * 60 * 60 * 24)));
}

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);
  const isSeller = user?.role === "seller";
  const printRef = useRef();

  const statusVariant = (status) => {
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

  const paymentVariant = (status) => {
    switch (status) {
      case "paid":
        return "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400";
      case "failed":
        return "bg-rose-50 text-rose-800 dark:bg-rose-900/20 dark:text-rose-400";
      case "pending":
        return "bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
      default:
        return "bg-gray-50 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300";
    }
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Order Detail</title>');
    printWindow.document.write('<style>body{font-family:sans-serif;padding:20px;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #ddd;padding:8px;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-0">
      <div ref={printRef} className="space-y-6 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Order Details
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
              Order ID: {orderDetails?._id}
            </DialogDescription>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <QRCode
              value={`${window.location.origin}/verify-qr?orderId=${orderDetails?._id}`}
              size={96}
              className="p-2 bg-white rounded-lg border"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">Scan to verify</span>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Date</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(orderDetails?.orderDate).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Amount</p>
              <p className="font-medium text-gray-900 dark:text-white">
                Br{orderDetails?.totalAmount?.toFixed(2)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Status</p>
              <Badge className={`${paymentVariant(orderDetails?.paymentStatus)} text-xs py-1 px-2 rounded-full`}>
                {orderDetails?.paymentStatus}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Status</p>
              <Badge className={`${statusVariant(orderDetails?.orderStatus)} text-xs py-1 px-2 rounded-full`}>
                {orderDetails?.orderStatus}
              </Badge>
            </div>
          </div>
        </div>

        <Separator className="dark:bg-gray-700" />

        {/* Order Items Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Items</h3>
          <div className="border rounded-xl overflow-hidden dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Qty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                {orderDetails?.orderItems?.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      Br{item.price?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Br{(item.price * item.quantity)?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                    Subtotal
                  </td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    Br{orderDetails?.totalAmount?.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <Separator className="dark:bg-gray-700" />

        {/* Shipping Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Shipping Information</h3>
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer</h4>
                <p className="font-medium text-gray-900 dark:text-white">{user.userName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{orderDetails?.addressInfo?.phone}</p>
                
                <div className="pt-2 space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Order Date:</span>{" "}
                    {orderDetails?.createdAt
                      ? new Date(orderDetails.createdAt).toLocaleDateString()
                      : ""}
                    {" "}
                    {orderDetails?.createdAt
                      ? new Date(orderDetails.createdAt).toLocaleTimeString()
                      : ""}
                  </p>
                  
                  {orderDetails?.updatedAt &&
                    orderDetails?.updatedAt !== orderDetails?.createdAt && (
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        <span className="font-medium">Status Updated At:</span>{" "}
                        {new Date(orderDetails.updatedAt).toLocaleDateString()}{" "}
                        {new Date(orderDetails.updatedAt).toLocaleTimeString()}
                      </p>
                  )}
                  
                  {orderDetails?.rejectedAt && (
                    <div className="text-sm text-rose-600 dark:text-rose-400">
                      <p>
                        <span className="font-medium">Rejected At:</span>{" "}
                        {new Date(orderDetails.rejectedAt).toLocaleDateString()}{" "}
                        {new Date(orderDetails.rejectedAt).toLocaleTimeString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ({getDayDifference(orderDetails.createdAt, orderDetails.rejectedAt)} days after order)
                      </p>
                    </div>
                  )}
                  
                  {orderDetails?.approvedAt && (
                    <div className="text-sm text-emerald-600 dark:text-emerald-400">
                      <p>
                        <span className="font-medium">Approved At:</span>{" "}
                        {new Date(orderDetails.approvedAt).toLocaleDateString()}{" "}
                        {new Date(orderDetails.approvedAt).toLocaleTimeString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ({getDayDifference(orderDetails.createdAt, orderDetails.approvedAt)} days after order)
                      </p>
                    </div>
                  )}
                  
                  {orderDetails?.deliveredAt && (
                    <div className="text-sm text-violet-600 dark:text-violet-400">
                      <p>
                        <span className="font-medium">Delivered At:</span>{" "}
                        {new Date(orderDetails.deliveredAt).toLocaleDateString()}{" "}
                        {new Date(orderDetails.deliveredAt).toLocaleTimeString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ({getDayDifference(orderDetails.createdAt, orderDetails.deliveredAt)} days after order)
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Shipping Address</h4>
                <p className="text-sm text-gray-900 dark:text-white">
                  {orderDetails?.addressInfo?.address}, {orderDetails?.addressInfo?.city}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pincode: {orderDetails?.addressInfo?.pincode}</p>
                {orderDetails?.addressInfo?.notes && (
                  <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Delivery Notes:</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 italic">{orderDetails?.addressInfo?.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Seller Actions */}
        {isSeller && (
          <>
            <Separator className="dark:bg-gray-700" />
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              {orderDetails?.orderStatus === "confirmed" && (
                <Button variant="default" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                  Mark as Shipped
                </Button>
              )}
              {orderDetails?.orderStatus === "shipped" && (
                <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800">
                  Mark as Delivered
                </Button>
              )}
              <Button variant="outline" className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800">
                Print Invoice
              </Button>
            </div>
          </>
        )}
      </div>
      
      <div className="sticky bottom-0 bg-background border-t p-4 flex justify-end dark:border-gray-700">
        <Button 
          onClick={handlePrint} 
          className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90"
        >
          Print This Order
        </Button>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;