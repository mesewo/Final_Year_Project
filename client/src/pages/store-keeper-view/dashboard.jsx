import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStorekeeperDashboardStats } from "@/store/store-keeper/dashboard-slice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/status-badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function StorekeeperDashboard() {
  const dispatch = useDispatch();
  const { stats, recentOrders, loading } = useSelector((state) => state.storekeeperDashboard || {});

  useEffect(() => {
    dispatch(fetchStorekeeperDashboardStats());
  }, [dispatch]);

  const cards = [
    { title: "Total Products", value: stats?.totalProducts, path: "/storekeeper/inventory" },
    { title: "Total Sellers", value: stats?.totalSellers, path: "/storekeeper/sellers" },
    { title: "Pending Orders", value: stats?.pendingOrders, path: "/storekeeper/orders" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, idx) => (
          <Link to={card.path} key={idx}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value ?? "..."}</div>
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
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">ID</th>
                <th className="text-left">Date</th>
                <th className="text-left">Amount</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders?.map((order) => (
                <tr key={order._id} className="hover:bg-muted cursor-pointer">
                  <td>{order._id.slice(-8)}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>Br{order.totalAmount}</td>
                  <td>
                    <StatusBadge status={order.orderStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-4">
            <Link to="/storekeeper/orders">
              <Button size="sm" variant="outline">View All</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
