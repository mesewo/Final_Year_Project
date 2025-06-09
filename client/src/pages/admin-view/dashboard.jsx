import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAdminDashboardStats } from "@/store/admin/dashbard-slice";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, recentOrders, loading } = useSelector(state => state.adminDashboard);
  console.log(recentOrders);
  useEffect(() => {
    dispatch(fetchAdminDashboardStats());
  }, [dispatch]);

  const statCards = [
    { title: "Total Products", value: stats?.totalProducts, change: "+12%" },
    { title: "Active Users", value: stats?.activeUsers, change: "+5%" },
    { title: "Pending Orders", value: stats?.pendingOrders, change: "-3%" },
    { title: "Monthly Revenue", value: `Br${stats?.monthlyRevenue}`, change: "+18%" },
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
      {/* <h1 className="text-2xl font-bold">Admin Dashboard</h1> */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="text-sm text-muted-foreground">{card.change}</div>
            </CardContent>
          </Card>
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
