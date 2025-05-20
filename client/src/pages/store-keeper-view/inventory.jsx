import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchInventory, updateStock, requestStockReplenishment } from "@/store/store-keeper/inventory-slice";

// Helper for time filtering
const isInTimeRange = (date, range) => {
  const now = new Date();
  const d = new Date(date);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfLastWeek = new Date(startOfWeek);
  startOfLastWeek.setDate(startOfWeek.getDate() - 7);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  switch (range) {
    case "today":
      return d >= startOfDay;
    case "yesterday":
      const yesterday = new Date(startOfDay);
      yesterday.setDate(yesterday.getDate() - 1);
      return d >= yesterday && d < startOfDay;
    case "thisWeek":
      return d >= startOfWeek;
    case "lastWeek":
      return d >= startOfLastWeek && d < startOfWeek;
    case "thisMonth":
      return d >= startOfMonth;
    case "lastMonth":
      return d >= startOfLastMonth && d < startOfMonth;
    case "thisYear":
      return d >= startOfYear;
    default:
      return true;
  }
};

export default function InventoryManagement() {
  const dispatch = useDispatch();
  const inventory = useSelector(state => state.inventory.inventory || []);
  const loading = useSelector(state => state.inventory.loading);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const filter = params.get("filter");
  const [quantities, setQuantities] = useState({});
  const [category, setCategory] = useState("all");
  const [timeRange, setTimeRange] = useState("all");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    dispatch(fetchInventory(filter === "low-stock" ? "low-stock" : ""));
  }, [dispatch, filter]);

  // Category counts
  const categories = ["women", "men", "kids"];
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = inventory.filter(p =>
      (Array.isArray(p.categories)
        ? p.categories.map(c => c.toLowerCase()).includes(cat)
        : (p.category || "").toLowerCase() === cat)
    ).length;
    return acc;
  }, {});

  // Time filter options
  const timeOptions = [
    { label: "All Time", value: "all" },
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "This Week", value: "thisWeek" },
    { label: "Last Week", value: "lastWeek" },
    { label: "This Month", value: "thisMonth" },
    { label: "Last Month", value: "lastMonth" },
    { label: "This Year", value: "thisYear" },
  ];

  // Filtered inventory
  const filteredInventory = inventory.filter(product => {
    // Category filter
    if (category !== "all") {
      const cats = Array.isArray(product.categories)
        ? product.categories.map(c => c.toLowerCase())
        : [(product.category || "").toLowerCase()];
      if (!cats.includes(category)) return false;
    }
    // Time filter (createdAt)
    if (timeRange !== "all" && product.createdAt) {
      if (!isInTimeRange(product.createdAt, timeRange)) return false;
    }
    // Status filter
    if (status !== "all") {
      if (status === "inStock" && !(product.totalStock > product.lowStockThreshold)) return false;
      if (status === "lowStock" && !(product.totalStock > 0 && product.totalStock <= product.lowStockThreshold)) return false;
      if (status === "outOfStock" && product.totalStock !== 0) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Inventory Gallery</h1>

      {/* Category Buttons */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={category === "all" ? "default" : "outline"}
          onClick={() => setCategory("all")}
        >
          All <span className="ml-1 text-xs text-gray-500">({inventory.length})</span>
        </Button>
        {categories.map(cat => (
          <Button
            key={cat}
            variant={category === cat ? "default" : "outline"}
            onClick={() => setCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
            <span className="ml-1 text-xs text-gray-500">({categoryCounts[cat]})</span>
          </Button>
        ))}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        {/* Time Filter Dropdown */}
        <div>
          <label className="mr-2 font-medium">Filter by Time:</label>
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {timeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {/* Status Filter Dropdown */}
        <div>
          <label className="mr-2 font-medium">Status:</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="inStock">In Stock</option>
            <option value="lowStock">Low Stock</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
        </div>
        {/* Reset Button */}
        <Button
          variant="outline"
          onClick={() => {
            setCategory("all");
            setTimeRange("all");
            setStatus("all");
          }}
        >
          Reset Filters
        </Button>
      </div>

      <Card>
        {loading ? (
          <div className="p-6 text-center">Loading inventory...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map(product => (
                <TableRow key={product._id}>
                  <TableCell className="flex items-center gap-3 font-medium">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-10 h-10 object-cover rounded border"
                    />
                    {product.title}
                  </TableCell>
                  <TableCell>{product.totalStock}</TableCell>
                  <TableCell>
                    <Badge variant={
                      product.totalStock === 0 ? 'destructive' :
                        product.totalStock <= product.lowStockThreshold ? 'warning' : 'success'
                    }>
                      {product.totalStock === 0 ? 'Out of Stock' :
                        product.totalStock <= product.lowStockThreshold ? 'Low Stock' : 'In Stock'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}