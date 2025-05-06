import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const stats = [
    { title: "Total Products", value: "1,234", link: "/admin-view/products" },
    { title: "Pending Orders", value: "56", link: "/admin-view/orders" },
    { title: "New Feedback", value: "23", link: "/admin-view/feedback" },
    { title: "System Alerts", value: "3", link: "/admin-view/settings" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Link to={stat.link} key={index}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="mt-4 w-full">
              View All Orders
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="mt-4 w-full">
              View All Feedback
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}