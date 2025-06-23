import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { useDispatch, useSelector } from "react-redux";
import { /*fetchSalesTrend,*/ fetchInventoryReport } from "@/store/store-keeper/report-slice";
import { fetchProductRequestTrend } from "@/store/productRequest-slice";
import { LineChart } from "@/components/ui/charts";

export default function StoreKeeperReports() {
  const dispatch = useDispatch();
  const { salesTrend, inventory, loading } = useSelector(state => state.storeKeeperReports);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date()
  });

  const { productRequestTrend } = useSelector(state => state.productRequest);
  // console.log("productRequestTrend", productRequestTrend);
  // Per-seller expanded/collapsed state
  const [expandedSellers, setExpandedSellers] = useState({});
  // Per-seller status filter
  const [sellerStatus, setSellerStatus] = useState({});

  // Status options
  const statuses = [
    { key: "all", label: "All" },
    { key: "inStock", label: "In Stock" },
    { key: "lowStock", label: "Low Stock" },
    { key: "outOfStock", label: "Out of Stock" }
  ];

  useEffect(() => {
  dispatch(fetchProductRequestTrend({ start: dateRange.start, end: dateRange.end }));
  dispatch(fetchInventoryReport());
}, [dispatch, dateRange]);

  // Helper: get status counts for a seller's products
  const getStatusCounts = (products) => {
    const counts = { inStock: 0, lowStock: 0, outOfStock: 0 };
    products.forEach(product => {
      if (product.totalStock === 0) counts.outOfStock++;
      else if (product.totalStock <= product.lowStockThreshold) counts.lowStock++;
      else counts.inStock++;
    });
    return counts;
  };

  // Toggle expand/collapse, but only allow one open at a time
  const toggleSeller = (sellerId) => {
    setExpandedSellers(prev => {
      // If already open, close it
      if (prev[sellerId]) return {};
      // Open only this one, close others
      return { [sellerId]: true };
    });
  };

  return (
    <div className="space-y-8 text-base"> {/* Increased base font size */}
      <div className="flex justify-between items-center">
        <CalendarDateRangePicker 
          dateRange={dateRange}
          onDateChange={setDateRange}
        />
      </div>

      <Tabs defaultValue="inventory">
        <TabsList className="text-lg"> {/* Larger tab text */}
          <TabsTrigger value="inventory">Seller Activity</TabsTrigger>
          <TabsTrigger value="salesTrend">Sales Trend</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sellers Inventory Products</CardTitle> {/* Larger title */}
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {inventory.map(seller => {
                  const statusCounts = getStatusCounts(seller.products);
                  const statusFilter = sellerStatus[seller._id] || "all";
                  const displayProducts = statusFilter === "all"
                    ? seller.products
                    : seller.products.filter(product => {
                        if (statusFilter === "inStock") return product.totalStock > product.lowStockThreshold;
                        if (statusFilter === "lowStock") return product.totalStock > 0 && product.totalStock <= product.lowStockThreshold;
                        if (statusFilter === "outOfStock") return product.totalStock === 0;
                        return true;
                      });

                  return (
                    <div key={seller._id} className="border rounded shadow-sm bg-gray-50">
                      {/* Seller Row */}
                      <div
                        className="flex flex-col md:flex-row md:items-center justify-between px-4 py-4 cursor-pointer hover:bg-gray-100 transition-colors text-lg"
                        onClick={() => toggleSeller(seller._id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl">
                            {seller.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 text-lg">{seller.userName}</div>
                            <div className="text-base text-gray-500">{seller.email}</div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2 md:mt-0">
                          {statuses.map(status => (
                            <button
                              key={status.key}
                              className={`px-3 py-1 rounded text-base font-semibold ${statusFilter === status.key ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                              onClick={e => {
                                e.stopPropagation();
                                setSellerStatus(sc => ({ ...sc, [seller._id]: status.key }));
                              }}
                            >
                              {status.label}
                              <span className="ml-2">
                                {status.key === "all"
                                  ? seller.products.length
                                  : statusCounts[status.key]}
                              </span>
                            </button>
                          ))}
                        </div>
                        <div className="ml-4 text-base text-gray-400">
                          {expandedSellers[seller._id] ? "▲" : "▼"}
                        </div>
                      </div>
                      {/* Product List */}
                      {expandedSellers[seller._id] && (
                        <div className="divide-y">
                          {displayProducts.length === 0 ? (
                            <div className="px-8 py-4 text-gray-400 text-lg">No products in this status.</div>
                          ) : (
                            displayProducts.map((product, idx) => (
                              <div key={seller._id + '-' + product._id + '-' + idx} className="flex items-center gap-4 px-8 py-4 bg-white text-lg">
                                <div className="flex items-center gap-3 font-semibold flex-1">
                                  {product.image && (
                                    <img
                                      src={product.image}
                                      alt={product.title}
                                      className="w-10 h-10 object-cover rounded border"
                                    />
                                  )}
                                  {product.title}
                                </div>
                                <div className="w-28 text-center">{product.totalStock}</div>
                                <div className="w-40 text-center">
                                  <span className={
                                    product.totalStock === 0
                                      ? "text-red-600"
                                      : product.totalStock <= product.lowStockThreshold
                                      ? "text-yellow-600"
                                      : "text-green-600"
                                  }>
                                    {product.totalStock === 0
                                      ? "Out of Stock"
                                      : product.totalStock <= product.lowStockThreshold
                                      ? "Low Stock"
                                      : "In Stock"}
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="salesTrend">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sales Trend Report</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <LineChart 
                data={productRequestTrend}
                xKey="_id"
                yKey="totalRequests"
                color="#4CAF50"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}