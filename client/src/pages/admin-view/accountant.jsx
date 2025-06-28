import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAccountantTransactions,
  fetchAccountantRequests,
  fetchAccountantStats,
} from "@/store/admin/accountant-slice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AccountantDashboard() {
  const dispatch = useDispatch();
  const { transactions, requests, stats, loading } = useSelector((state) => state.accountant);

  useEffect(() => {
    dispatch(fetchAccountantTransactions());
    dispatch(fetchAccountantRequests());
    dispatch(fetchAccountantStats());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Accountant Overview</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequests || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Br{stats.totalRevenue || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id.slice(-8)}</TableCell>
                  <TableCell>{order.userId?.userName || "N/A"}</TableCell>
                  <TableCell>{order.type}</TableCell>
                  <TableCell>
                    <Badge>{order.orderStatus}</Badge>
                  </TableCell>
                  <TableCell>Br{order.totalAmount}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id.slice(-8)}</TableCell>
                  <TableCell>{order.userId?.userName || "N/A"}</TableCell>
                  <TableCell>{order.type}</TableCell>
                  <TableCell>
                    <Badge>{order.orderStatus}</Badge>
                  </TableCell>
                  <TableCell>Br{order.totalAmount}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}