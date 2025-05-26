import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { requestProduct, fetchMyRequests } from "@/store/productRequest-slice";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCcw, ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { useToast } from '../../components/ui/use-toast';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import dayjs from "dayjs";

const fallbackImg = "https://via.placeholder.com/60x60?text=No+Image";

export default function SellerProductRequest() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState({});
  const myRequests = useSelector((state) => state.productRequest.myRequests || []);

  // For dialog
  const [open, setOpen] = useState(false);
  const [factoryProducts, setFactoryProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [requestQty, setRequestQty] = useState("");
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const { toast } = useToast();

  // Accordion state
  const [showFactory, setShowFactory] = useState(true);
  const [showRequests, setShowRequests] = useState(false);

  // Filters
  const [factoryCategory, setFactoryCategory] = useState("all");
  const [requestCategory, setRequestCategory] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [factorySearchTerm, setFactorySearchTerm] = useState(""); // New state for factory product search

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const prodRes = await axios.get("/api/factman/products/get");
        const factoryProds = (prodRes.data.data || []).filter(p => p.isActive);
        setProducts(factoryProds);
        dispatch(fetchMyRequests());
      } catch (err) {
        console.error("Failed to fetch factory products:", err);
      }
    };
    fetchInitialData();
  }, [dispatch]);

  useEffect(() => {
    axios.get("/api/seller/stores").then(res => {
      if (res.data && res.data.store) {
        setStores([res.data.store]);
        setSelectedStoreId(res.data.store._id);
      }
    });
  }, []);

  // Fetch factory products for the dialog
  const fetchFactoryProducts = async () => {
    const res = await axios.get("/api/factman/products/get");
    setFactoryProducts((res.data.data || []).filter(p => p.isActive));
  };

  const handleRequest = async (productId) => {
    const quantity = parseInt(quantities[productId]) || 0;
    const product = products.find(p => p._id === productId);
    if (!quantity || quantity < 1) return;
    if (quantity > product.totalStock) {
      toast({
        title: "Not enough stock",
        description: `Only ${product.totalStock} units available.`,
        variant: "destructive",
      });
      return;
    }
    setLoading((prev) => ({ ...prev, [productId]: true }));
    const result = await dispatch(requestProduct({ productId, quantity, storeId: selectedStoreId }));
    setLoading((prev) => ({ ...prev, [productId]: false }));

    if (result.type.endsWith("/rejected")) {
      const message =
        result?.error?.message ||
        result?.payload?.message ||
        "Failed to send request.";
      toast({
        title: "Request failed",
        description: message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Request sent",
      description: "Your request has been sent to the factory.",
    });
    setQuantities((prev) => ({ ...prev, [productId]: "" }));
    dispatch(fetchMyRequests());
  };

  // Handle dialog request
  const handleDialogRequest = async () => {
    if (!selectedProduct || !requestQty || parseInt(requestQty) < 1) return;
    const product = factoryProducts.find(p => p._id === selectedProduct);
    if (parseInt(requestQty) > product.totalStock) {
      toast({
        title: "Not enough stock",
        description: `Only ${product.totalStock} units available.`,
        variant: "destructive",
      });
      return;
    }
    setLoading((prev) => ({ ...prev, [selectedProduct]: true }));
    const result = await dispatch(requestProduct({
      productId: selectedProduct,
      quantity: parseInt(requestQty),
      storeId: selectedStoreId
    }));

    if (result.type.endsWith("/rejected")) {
      const message = result?.error?.message || result?.payload?.message || "Failed to send request.";
      toast({
        title: "Request failed",
        description: message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Request sent",
        description: "Your request has been sent to the factory.",
      });
    }

    setLoading((prev) => ({ ...prev, [selectedProduct]: false }));
    setSelectedProduct("");
    setRequestQty("");
    setOpen(false);
    dispatch(fetchMyRequests());
  };

  // Find selected product object for image preview
  const selectedProductObj = factoryProducts.find(p => p._id === selectedProduct);

  // Get unique categories for factory products
  const factoryCategories = [
    "all",
    ...Array.from(new Set(products.map(p => p.category).filter(Boolean))),
  ];

  // Get unique categories for requests
  const requestCategories = [
    "all",
    ...Array.from(new Set(myRequests.map(r => r.product?.category).filter(Boolean))),
  ];

  // Time filter logic for requests
  const filterByTime = (requests) => {
    if (timeFilter === "all") return requests;
    const now = dayjs();
    return requests.filter(r => {
      const created = dayjs(r.createdAt);
      switch (timeFilter) {
        case "today":
          return created.isSame(now, "day");
        case "yesterday":
          return created.isSame(now.subtract(1, "day"), "day");
        case "this_week":
          return created.isSame(now, "week");
        case "last_week":
          return created.isSame(now.subtract(1, "week"), "week");
        case "this_month":
          return created.isSame(now, "month");
        case "last_month":
          return created.isSame(now.subtract(1, "month"), "month");
        case "this_year":
          return created.isSame(now, "year");
        default:
          return true;
      }
    });
  };

  // Status filter logic for requests
  const filterByStatus = (requests) => {
    if (statusFilter === "all") return requests;
    return requests.filter(r => r.status === statusFilter);
  };

  // Filtered products and requests
  const filteredFactoryProducts = (() => {
    let prods = factoryCategory === "all"
      ? products
      : products.filter(p => p.category === factoryCategory);
    if (factorySearchTerm.trim()) {
      prods = prods.filter(p =>
        p.title?.toLowerCase().includes(factorySearchTerm.trim().toLowerCase())
      );
    }
    return prods;
  })();

  // Apply all filters to requests
  const filteredRequests = (() => {
    let reqs = myRequests;
    reqs = filterByTime(reqs);
    reqs = requestCategory === "all" ? reqs : reqs.filter(r => r.product?.category === requestCategory);
    reqs = filterByStatus(reqs);
    if (searchTerm.trim()) {
      reqs = reqs.filter(r =>
        r.product?.title?.toLowerCase().includes(searchTerm.trim().toLowerCase())
      );
    }
    return reqs;
  })();

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await axios.delete(`/api/seller/requests/${requestId}`);
      toast({
        title: "Request deleted",
        description: "Your request has been deleted.",
      });
      dispatch(fetchMyRequests());
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err?.response?.data?.message || "Could not delete request.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header with Add Request button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Product Requests</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => fetchFactoryProducts()}>
              <Plus className="mr-2 h-4 w-4" /> Add Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Product Requests</DialogTitle>
              <DialogDescription>
                Request multiple products from the factory inventory
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              {factoryProducts.length === 0 ? (
                <div className="text-muted-foreground">No products available.</div>
              ) : (
                factoryProducts.map((product) => (
                  <div key={product._id} className="flex items-center gap-4 border-b pb-2 mb-2">
                    <img
                      src={product.image || fallbackImg}
                      alt={product.title}
                      className="w-10 h-10 object-cover rounded border"
                      onError={e => { e.target.onerror = null; e.target.src = fallbackImg; }}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{product.title}</div>
                      <div className="text-xs text-gray-500">Available: {product.totalStock}</div>
                    </div>
                    <Input
                      type="number"
                      min="0"
                      max={product.totalStock}
                      placeholder="Qty"
                      value={quantities[product._id] || ""}
                      onChange={e =>
                        setQuantities({ ...quantities, [product._id]: e.target.value })
                      }
                      className="w-24"
                    />
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  // Collect all products with quantity > 0
                  const requests = Object.entries(quantities)
                    .filter(([id, qty]) => parseInt(qty) > 0)
                    .map(([productId, qty]) => ({
                      productId,
                      quantity: parseInt(qty),
                      storeId: selectedStoreId,
                    }));
                  if (requests.length === 0) {
                    toast({
                      title: "No products selected",
                      description: "Please enter quantity for at least one product.",
                      variant: "destructive",
                    });
                    return;
                  }
                  setLoading({ ...loading, batch: true });
                  try {
                    // Send all requests in parallel (or you can send as a batch API if you have one)
                    await Promise.all(
                      requests.map(req => dispatch(requestProduct(req)))
                    );
                    toast({
                      title: "Requests sent",
                      description: "Your requests have been sent to the factory.",
                    });
                    setQuantities({});
                    setOpen(false);
                    dispatch(fetchMyRequests());
                  } catch (err) {
                    toast({
                      title: "Request failed",
                      description: "Failed to send one or more requests.",
                      variant: "destructive",
                    });
                  }
                  setLoading({ ...loading, batch: false });
                }}
                disabled={loading.batch}
              >
                {loading.batch ? "Submitting..." : "Submit Requests"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Time Filter Row */}
      <div className="flex flex-wrap gap-2 px-4 pb-4 w-full">
        {[
          { label: "All", value: "all" },
          { label: "Today", value: "today" },
          { label: "Yesterday", value: "yesterday" },
          { label: "This Week", value: "this_week" },
          { label: "Last Week", value: "last_week" },
          { label: "This Month", value: "this_month" },
          { label: "Last Month", value: "last_month" },
          { label: "This Year", value: "this_year" },
        ].map(btn => (
          <button
            key={btn.value}
            className={`px-4 py-2 rounded border text-sm font-medium transition ${
              timeFilter === btn.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => setTimeFilter(btn.value)}
            type="button"
            style={{ minWidth: 120 }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Factory Products Row */}
      <div className="border rounded bg-white shadow mb-4">
        <button
          className="w-full flex items-center justify-between px-4 py-3 text-lg font-semibold focus:outline-none"
          onClick={() => setShowFactory(v => !v)}
        >
          <span className="flex items-center gap-2">
            {showFactory ? <ChevronDown /> : <ChevronRight />}
            Factory Products
          </span>
          <span className="text-xs text-gray-500">
            {filteredFactoryProducts.length} item{filteredFactoryProducts.length !== 1 ? "s" : ""}
          </span>
        </button>
        {showFactory && (
          <>
            <div className="flex flex-wrap gap-2 px-4 pt-3 pb-1 w-full">
              {factoryCategories.map(cat => (
                <button
                  key={cat}
                  className={`px-4 py-2 rounded border text-sm font-medium transition ${
                    factoryCategory === cat
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                  onClick={() => setFactoryCategory(cat)}
                  type="button"
                  style={{ minWidth: 120 }}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
            {/* Factory product search input */}
            <div className="flex items-center gap-2 mb-4">
              <Input
                placeholder="Search factory products..."
                value={factorySearchTerm}
                onChange={e => setFactorySearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <div className="space-y-3 px-4 pb-4">
              {filteredFactoryProducts.length === 0 ? (
                <div className="text-muted-foreground">No products in this category.</div>
              ) : (
                filteredFactoryProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border p-3 rounded bg-white shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image || fallbackImg}
                        alt={product.title}
                        className="w-14 h-14 object-cover rounded border"
                        onError={e => { e.target.onerror = null; e.target.src = fallbackImg; }}
                      />
                      <span className="font-medium">{product.title}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        (Available: {product.totalStock})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Qty"
                        type="number"
                        min={1}
                        value={quantities[product._id] || ""}
                        onChange={(e) =>
                          setQuantities({ ...quantities, [product._id]: e.target.value })
                        }
                        className="w-24"
                      />
                      <Button
                        onClick={() => {
                          if (parseInt(quantities[product._id]) > product.totalStock) {
                            toast({
                              title: "Not enough stock",
                              description: `Only ${product.totalStock} units available.`,
                              variant: "destructive",
                            });
                            return;
                          }
                          handleRequest(product._id);
                        }}
                        disabled={
                          loading[product._id] ||
                          !quantities[product._id] ||
                          parseInt(quantities[product._id]) < 1 ||
                          parseInt(quantities[product._id]) > product.totalStock
                        }
                      >
                        {loading[product._id] ? "Requesting..." : "Request"}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* My Requests Row */}
      <div className="border rounded bg-white shadow">
        <button
          className="w-full flex items-center justify-between px-4 py-3 text-lg font-semibold focus:outline-none"
          onClick={() => setShowRequests(v => !v)}
        >
          <span className="flex items-center gap-2">
            {showRequests ? <ChevronDown /> : <ChevronRight />}
            My Requests
          </span>
          <span className="text-xs text-gray-500">
            {filteredRequests.length} item{filteredRequests.length !== 1 ? "s" : ""}
          </span>
        </button>
        {showRequests && (
          <>
            {/* Status Filter Dropdown */}
            <div className="flex flex-wrap gap-2 px-4 pt-3 pb-1 w-full items-center">
              <select
                className="border rounded px-3 py-2 text-sm font-medium"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{ minWidth: 140 }}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              {requestCategories.map(cat => (
                <button
                  key={cat}
                  className={`px-4 py-2 rounded border text-sm font-medium transition ${
                    requestCategory === cat
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                  onClick={() => setRequestCategory(cat)}
                  type="button"
                  style={{ minWidth: 120 }}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Input
                placeholder="Search product requests..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <ul className="space-y-2 px-4 pb-4">
              {filteredRequests.length === 0 ? (
                <li className="text-muted-foreground">No requests in this category.</li>
              ) : (
                filteredRequests.map((r, idx) => (
                  <li
                    key={r._id || idx}
                    className="border p-2 rounded flex flex-col sm:flex-row sm:items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {r.product ? (
                        <>
                          <img
                            src={r.product.image || fallbackImg}
                            alt={r.product.title}
                            className="w-10 h-10 object-cover rounded border"
                            onError={e => { e.target.onerror = null; e.target.src = fallbackImg; }}
                          />
                          <span className="font-medium">{r.product.title}</span> – {r.quantity} units
                          <span className="text-xs text-gray-500 ml-2">
                            {dayjs(r.createdAt).format("MMM D, YYYY h:mm A")}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">[Product deleted]</span>
                      )}
                    </div>
                    <span className="flex items-center gap-2">
                      <strong
                        className={
                          r.status === "pending"
                            ? "text-yellow-600"
                            : r.status === "approved"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {r.status
                          ? r.status.charAt(0).toUpperCase() + r.status.slice(1)
                          : "Unknown"}
                      </strong>
                      {/* Show delete button only if pending */}
                      {r.status === "pending" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete Request"
                          onClick={() => handleDeleteRequest(r._id)}
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </Button>
                      )}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}