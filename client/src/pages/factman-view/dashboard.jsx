import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { DataTable } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchFactmanDashboardStats } from "@/store/factman/dashboard-slice";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

// Simple Modal Component (replace with your own if you have one)
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
}

export default function FactmanDashboard() {
  const dispatch = useDispatch();
  const { stats, recentOrders, loading } = useSelector(state => state.factmanDashboard);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchFactmanDashboardStats());
  }, [dispatch]);

  const statCards = [
    { title: "Total Products", value: stats?.totalProducts, change: stats?.productChange
      ? `${stats.productChange > 0 ? "+" : ""}${stats.productChange.toFixed(2)}%`
      : "0%",  path: "/factman/products"},
    { title: "Active Users", value: stats?.activeUsers, change: stats?.userChange
      ? `${stats.userChange > 0 ? "+" : ""}${stats.userChange.toFixed(2)}%`
      : "0%", path: "/factman/users"  },
    { title: "Pending Orders", value: stats?.pendingOrders, change: stats?.pendingOrdersChange
      ? `${stats.pendingOrdersChange > 0 ? "+" : ""}${stats.pendingOrdersChange.toFixed(2)}%`
      : "0%", path: "/factman/orders"  },
    { title: "Monthly Revenue", value: `Br${stats?.monthlyRevenue}`, change: stats?.revenueChange
      ? `${stats.revenueChange > 0 ? "+" : ""}${stats.revenueChange.toFixed(2)}%`
      : "0%", path: "/factman/reports"  },
  ];

  // Columns for the mini table
  const recentOrdersColumns = [
    { header: "Order ID", accessor: "_id", cell: ({ row }) => row._id.slice(-8) },
    { header: "Date", accessor: "createdAt", cell: ({ row }) => new Date(row.createdAt).toLocaleDateString() },
    { header: "Amount", accessor: "totalAmount", cell: ({ row }) => `Br${row.totalAmount}` },
    {
      header: "Status",
      accessor: "orderStatus",
      cell: ({ row }) => {
        const status = row.orderStatus === "confirmed"
          ? "delivered"
          : row.orderStatus === "rejected"
          ? "cancelled"
          : row.orderStatus;
        return <StatusBadge status={status} />;
      },
    },
  ];

  // Handler for row click
  const handleRowClick = (order) => setSelectedOrder(order);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard overview</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <Link to={card.path} key={index} className="hover:opacity-80 transition">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <div className="text-sm text-muted-foreground">{card.change}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  {recentOrdersColumns.map((col, idx) => (
                    <th key={idx} className="px-2 py-1 text-left font-semibold">{col.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(recentOrders || []).slice(0, 3).map((order, idx) => (
                  <tr
                    key={order._id}
                    className="hover:bg-muted cursor-pointer"
                    onClick={() => handleRowClick(order)}
                  >
                    {recentOrdersColumns.map((col, cidx) => (
                      <td key={cidx} className="px-2 py-1">
                        {col.cell ? col.cell({ row: order }) : order[col.accessor]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-2">
              <Link to="/factman/orders">
                <Button variant="outline" size="sm">View All Orders</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Modal open={!!selectedOrder} onClose={() => setSelectedOrder(null)}>
        {selectedOrder && (
          <div>
            <h2 className="text-lg font-bold mb-2">Order Details</h2>
            <div className="mb-2">
              <span className="font-semibold">Order ID:</span> {selectedOrder._id}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Amount:</span> Br{selectedOrder.totalAmount}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Status:</span>{" "}
              <StatusBadge status={selectedOrder.orderStatus} />
            </div>
            {/* Add more fields/actions as needed */}
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
              {/* Example quick action */}
              {/* <Button size="sm" variant="default">Mark as Delivered</Button> */}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}