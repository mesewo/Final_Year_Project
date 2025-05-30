import React from "react";

export default function SellerOrderDetailsView({ orderDetails }) {
  if (!orderDetails) return <div className="text-gray-500 p-4">No order details available.</div>;

  const { addressInfo, orderItems = [] } = orderDetails;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
        Order Details
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <DetailItem label="Order ID" value={orderDetails._id} />
          <DetailItem label="Status">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              orderDetails.orderStatus === 'completed' ? 'bg-green-100 text-green-800' :
              orderDetails.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {orderDetails.orderStatus}
            </span>
          </DetailItem>
          <DetailItem label="Payment Method" value={orderDetails.paymentMethod} />
          <DetailItem label="Payment Status">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              orderDetails.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {orderDetails.paymentStatus}
            </span>
          </DetailItem>
        </div>
        
        <div className="space-y-4">
          <DetailItem label="Total Amount" value={`Br ${orderDetails.totalAmount.toFixed(2)}`} />
          <DetailItem label="Order Date" value={new Date(orderDetails.orderDate).toLocaleString()} />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Shipping Address</h3>
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          {addressInfo ? (
            <>
              <p className="font-medium">{addressInfo.address}</p>
              <p className="text-gray-600">{addressInfo.city}</p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <DetailItem label="Pincode" value={addressInfo.pincode} />
                <DetailItem label="Phone" value={addressInfo.phone} />
              </div>
              {addressInfo.notes && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-600">Notes:</p>
                  <p className="text-sm text-gray-500 italic">{addressInfo.notes}</p>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500">No address information available</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Order Items</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orderItems.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{item.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">Br {item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    Br {(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="px-6 py-4 text-right font-medium text-gray-500">Total</td>
                <td className="px-6 py-4 font-bold text-gray-900">Br {orderDetails.totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value, children }) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">
        {value || children}
      </dd>
    </div>
  );
}