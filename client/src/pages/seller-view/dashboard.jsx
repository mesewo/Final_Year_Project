import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/status-badge";
import { useEffect } from "react";
import { DataTable } from "@/components/common/data-table";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerDashboardStats } from "@/store/seller/dashboard-slice";

export default function SellerDashboard() {
  const dispatch = useDispatch();
  const { stats, recentOrders, loading } = useSelector(state => state.sellerDashboard);

  useEffect(() => {
    dispatch(fetchSellerDashboardStats());
  }, [dispatch]);

  const statCards = [
    { title: "Total Products", value: stats?.totalProducts },
    { title: "Pending Orders", value: stats?.pendingOrders },
    { title: "Monthly Sales", value: `Br${stats?.monthlySales}` },
    { title: "Conversion Rate", value: `${stats?.conversionRate}%` },
  ];

  const recentOrdersColumns = [
    { header: "Order ID", accessor: "_id", cell: ({ row }) => row._id.slice(-8) },
    { header: "Customer", accessor: "customerName" },
    { header: "Items", accessor: "itemCount" },
    { header: "Amount", accessor: "totalAmount", cell: ({ row }) => `Br${row.totalAmount}` },
    { header: "Status", accessor: "status", cell: ({ row }) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Seller Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
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