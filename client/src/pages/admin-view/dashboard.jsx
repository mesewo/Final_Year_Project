import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAdminDashboardStats } from "@/store/admin/dashbard-slice";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, recentOrders, loading } = useSelector(state => state.adminDashboard);

  useEffect(() => {
    dispatch(fetchAdminDashboardStats());
  }, [dispatch]);

  const statCards = [
    {
      title: "Total Products",
      value: stats?.totalProducts,
      change: stats?.productChange
        ? `${stats.productChange > 0 ? "+" : ""}${stats.productChange.toFixed(2)}%`
        : "0%",
      path: "/admin/products"
    },
    {
      title: "Active Users",
      value: stats?.activeUsers,
      change: stats?.userChange
        ? `${stats.userChange > 0 ? "+" : ""}${stats.userChange.toFixed(2)}%`
        : "0%",
      path: "/admin/users"
    },
    {
      title: "Pending Orders",
      value: stats?.pendingOrders,
      change: stats?.pendingOrdersChange
        ? `${stats.pendingOrdersChange > 0 ? "+" : ""}${stats.pendingOrdersChange.toFixed(2)}%`
        : "0%",
      path: "/admin/orders"
    },
    {
      title: "Monthly Revenue",
      value: `Br${stats?.monthlyRevenue}`,
      change: stats?.revenueChange
        ? `${stats.revenueChange > 0 ? "+" : ""}${stats.revenueChange.toFixed(2)}%`
        : "0%",
      path: "/admin/reports"
    },
  ];

  const recentOrdersColumns = [
    { header: "Order ID", accessor: "_id", cell: ({ row }) => row._id.slice(-8) },
    { header: "Date", accessor: "createdAt", cell: ({ row }) => new Date(row.createdAt).toLocaleDateString() },
    { header: "Payment Method", accessor: "paymentMethod", cell: ({ row }) => row.paymentMethod },
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

  return (
    <div className="space-y-6">
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
          <DataTable
            columns={recentOrdersColumns}
            data={recentOrders}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
