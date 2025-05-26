import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function NotificationsTab() {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = () => {
    fetch("/api/notifications?forRole=factman&type=low_stock")
      .then(res => res.json())
      .then(data => {
        console.log("All Factman notifications:");
        if (Array.isArray(data.notifications)) {
          data.notifications.forEach((notif, idx) => {
            console.log(
              `${idx + 1}. ${notif.product?.title || notif.product} - ${notif.message}`
            );
          });
        }
        setNotifications(data.notifications || []);
      });
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (!notifications.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Low/Out of Stock Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">No low or out-of-stock products.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Low/Out of Stock Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map(n => (
              <TableRow key={n._id}>
                <TableCell>
                  {n.product && typeof n.product === "object" ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {n.product.image && (
                        <img
                          src={n.product.image}
                          alt={n.product.title}
                          style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 4, marginRight: 8 }}
                          onError={e => (e.target.style.display = "none")}
                        />
                      )}
                      {n.product.title}
                    </div>
                  ) : (
                    n.product
                  )}
                </TableCell>
                <TableCell>{n.message}</TableCell>
                <TableCell>{new Date(n.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// After successful restock API call:
