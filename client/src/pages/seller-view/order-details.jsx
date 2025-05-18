import React from "react";

export default function SellerOrderDetailsView({ orderDetails }) {
  if (!orderDetails) return <div>No order details available.</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Order Details</h2>
      <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(orderDetails, null, 2)}</pre>
    </div>
  );
}