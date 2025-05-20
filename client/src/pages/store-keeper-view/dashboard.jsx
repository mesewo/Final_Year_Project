import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStorekeeperDashboardStats, fetchRecentProductRequests } from "@/store/store-keeper/dashboard-slice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/status-badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function StorekeeperDashboard() {
  const dispatch = useDispatch();
  const { stats, loading, recentRequests = [] } = useSelector((state) => state.storeKeeperDashboard || {});
  console.log("Dashboard stats:", stats);
  // const recentOrders = Array.isArray(stats?.recentOrders) ? stats.recentOrders : [];
  // console.log("Storekeeper Dashboard Stats:", stats);
  // console.log("Recent Orders:", recentOrders);
  useEffect(() => {
    dispatch(fetchStorekeeperDashboardStats());
    dispatch(fetchRecentProductRequests());
  }, [dispatch]);

  const cards = [
    { title: "Total Products", value: stats?.totalProducts, path: "/storekeeper/inventory" },
    { title: "Total Sellers", value: stats?.totalSellers/*, path: "/storekeeper/sellers"*/ },
    { title: "Pending Requests", value: stats?.pendingOrders, path: "/storekeeper/requests" },
    { title: "Low Stock Products", value: stats?.lowStockProducts /*, path: "/storekeeper/inventory?filter=low-stock" */},
    { title: "Total Stores", value: stats?.totalStores, path: "/storekeeper/stores" },
    { title: "Inventory Value", value: stats?.inventoryValue ? `Br${stats.inventoryValue}` : "...", path: "/storekeeper/inventory" },
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
          <CardTitle>Recent Product Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">ID</th>
                <th className="text-left">Date</th>
                <th className="text-left">Product</th>
                <th className="text-left">Seller</th>
                <th className="text-left">Quantity</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((req) => (
                <tr key={req._id}>
                  <td>{req._id.slice(-8)}</td>
                  <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td>{req.product?.title || "N/A"}</td>
                  <td>{req.seller?.userName || "N/A"}</td>
                  <td>{req.quantity}</td>
                  <td>
                    <StatusBadge status={req.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-4">
            <Link to="/storekeeper/requests">
              <Button size="sm" variant="outline">View All</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
