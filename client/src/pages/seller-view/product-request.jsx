import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { requestProduct, fetchMyRequests } from "@/store/productRequest-slice";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCcw } from "lucide-react";
import { useToast } from '../../components/ui/use-toast';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";

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

useEffect(() => {
  const fetchInitialData = async () => {
    try {
      // ✅ Get factory-wide products
      const prodRes = await axios.get("/api/factman/products/get");
      const factoryProds = (prodRes.data.data || []).filter(p => p.isActive);
      setProducts(factoryProds);

      // ✅ Load requests
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
  // console.log("Factory products response:", res.data);
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

  // Handle backend error
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
    setLoading((prev) => ({ ...prev, [selectedProduct]: true }));
    await dispatch(requestProduct({ productId: selectedProduct, quantity: parseInt(requestQty), storeId: selectedStoreId }));
    toast({
          title:  "Request sent",
          description: "Your request has been sent to the factory.",
        });
    setLoading((prev) => ({ ...prev, [selectedProduct]: false }));
    setSelectedProduct("");
    setRequestQty("");
    setOpen(false);
    dispatch(fetchMyRequests());
  };

  // Find selected product object for image preview
  const selectedProductObj = factoryProducts.find(p => p._id === selectedProduct);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Factory Products</h2>
        <Dialog open={open} onOpenChange={(v) => {
          setOpen(v);
          if (v) fetchFactoryProducts();
        }}>
          <DialogTrigger asChild>
              {/* <Button variant="outline">Request Product</Button> */}
          </DialogTrigger>
          <Button
            variant="outline"
            onClick={fetchFactoryProducts}
            className="ml-2"
          >
            <RefreshCcw size={16} />
          </Button>
          <DialogContent className="max-w-md">
            <DialogTitle>Request Product from Factory</DialogTitle>
            {/* Product dropdown with images */}
            <div className="mb-2">
              <select
                className="border rounded px-2 py-1 w-full"
                value={selectedProduct}
                onChange={e => setSelectedProduct(e.target.value)}
              >
                <option value="">Select Product</option>
                {factoryProducts.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
            {/* Show image preview for selected product */}
            {selectedProductObj && (
              <div className="flex flex-col items-center mb-2">
                <img
                  src={selectedProductObj.image || fallbackImg}
                  alt={selectedProductObj.title}
                  className="w-24 h-24 object-cover rounded border mb-1"
                  onError={e => { e.target.onerror = null; e.target.src = fallbackImg; }}
                />
                <span className="text-sm text-gray-600">{selectedProductObj.title}</span>
              </div>
            )}
            <Input
              placeholder="Quantity"
              type="number"
              min={1}
              value={requestQty}
              onChange={e => setRequestQty(e.target.value)}
              className="mb-2"
            />
            
            <Button
              onClick={handleDialogRequest}
              disabled={!selectedProduct || !requestQty || parseInt(requestQty) < 1 || loading[selectedProduct]}
              className="w-full"
            >
              {loading[selectedProduct] ? "Requesting..." : "Send Request"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-3">
        {products.map((product) => (
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
                  parseInt(quantities[product._id]) > product.totalStock // Disable if over stock
                }
              >
                {loading[product._id] ? "Requesting..." : "Request"}
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between ">
        <h3 className="text-xl mt-8 font-semibold">My Requests
        <Button
          variant="outline"
          className="ml-2"
          onClick={() => dispatch(fetchMyRequests())}
        >
          <RefreshCcw size={16} />
        </Button>
        </h3>
      </div>

      <ul className="space-y-2">
        {myRequests.length === 0 ? (
          <li className="text-muted-foreground">No requests yet.</li>
        ) : (
          myRequests.map((r, idx) => (
            <li key={r._id || idx} className="border p-2 rounded flex flex-col sm:flex-row sm:items-center justify-between">
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
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">[Product deleted]</span>
                )}
              </div>
              <span>
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
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}