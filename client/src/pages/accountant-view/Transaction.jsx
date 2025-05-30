import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import your thunk/action to fetch transactions
import { fetchTransactions } from "@/store/accountant/transaction-slice"; // adjust path as needed

function formatDate(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function isWithinRange(date, range) {
  const d = new Date(date);
  const now = new Date();
  if (range === "all") return true;
  if (range === "today") return d.toDateString() === now.toDateString();
  if (range === "this_week") {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return d >= startOfWeek && d <= endOfWeek;
  }
  if (range === "this_month") {
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }
  return true;
}

export default function Transaction() {
  const dispatch = useDispatch();
  const { transactions, loading } = useSelector((state) => state.accountantTransactions); // adjust slice name as needed

  const [timeFilter, setTimeFilter] = useState("all");
  const [sellerFilter, setSellerFilter] = useState("all");
  const [storekeeperFilter, setStorekeeperFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Get unique sellers and storekeepers for dropdowns
  const uniqueSellers = Array.from(new Set((transactions || []).map((t) => t.seller)));
  const uniqueStorekeepers = Array.from(new Set((transactions || []).map((t) => t.storekeeper)));

  // Filter transactions
  const filtered = (transactions || []).filter(
    (t) =>
      isWithinRange(t.date, timeFilter) &&
      (sellerFilter === "all" || t.seller === sellerFilter) &&
      (storekeeperFilter === "all" || t.storekeeper === storekeeperFilter)
  );

  const totalBirr = filtered.reduce((sum, t) => sum + t.quantity * t.price, 0);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-4 items-center">
            <span className="font-medium mr-2">Time Filter:</span>
            <button
              className={`px-3 py-1 rounded ${timeFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
              onClick={() => setTimeFilter("all")}
            >
              All Time
            </button>
            <button
              className={`px-3 py-1 rounded ${timeFilter === "today" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
              onClick={() => setTimeFilter("today")}
            >
              Today
            </button>
            <button
              className={`px-3 py-1 rounded ${timeFilter === "this_week" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
              onClick={() => setTimeFilter("this_week")}
            >
              This Week
            </button>
            <button
              className={`px-3 py-1 rounded ${timeFilter === "this_month" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
              onClick={() => setTimeFilter("this_month")}
            >
              This Month
            </button>
            <span className="font-medium ml-6">Seller:</span>
            <select
              className="border rounded px-2 py-1"
              value={sellerFilter}
              onChange={(e) => setSellerFilter(e.target.value)}
            >
              <option value="all">All Sellers</option>
              {uniqueSellers.map((seller) => (
                <option key={seller} value={seller}>
                  {seller}
                </option>
              ))}
            </select>
            <span className="font-medium ml-6">Storekeeper:</span>
            <select
              className="border rounded px-2 py-1"
              value={storekeeperFilter}
              onChange={(e) => setStorekeeperFilter(e.target.value)}
            >
              <option value="all">All Storekeepers</option>
              {uniqueStorekeepers.map((sk) => (
                <option key={sk} value={sk}>
                  {sk}
                </option>
              ))}
            </select>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <table className="w-full border text-left text-base">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Date</th>
                  <th className="p-2">Storekeeper</th>
                  <th className="p-2">Seller</th>
                  <th className="p-2">Product</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Price (Birr)</th>
                  <th className="p-2">Total (Birr)</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((t, i) => (
                    <tr key={i}>
                      <td className="p-2">{formatDate(t.date)}</td>
                      <td className="p-2">{t.storekeeper}</td>
                      <td className="p-2">{t.seller}</td>
                      <td className="p-2">{t.product}</td>
                      <td className="p-2">{t.quantity}</td>
                      <td className="p-2">{t.price}</td>
                      <td className="p-2">{t.quantity * t.price}</td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="font-bold bg-gray-50">
                  <td colSpan={6} className="p-2 text-right">
                    Total Birr:
                  </td>
                  <td className="p-2">{totalBirr}</td>
                </tr>
              </tfoot>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}