import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import ProductDetailsDialog from "@/components/shopping-view/product-details";

const MIN_BULK_QUANTITY = 10;

export default function BulkRequest() {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" }));
  }, [dispatch]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  const handleQuantityChange = (productId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleBulkRequest = async (productId) => {
    const quantity = Number(quantities[productId]) || MIN_BULK_QUANTITY;
    if (quantity < MIN_BULK_QUANTITY) {
      toast({
        title: `Minimum order is ${MIN_BULK_QUANTITY} units.`,
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await axios.post("/api/product-requests/request", {
        productId,
        quantity,
        isBulk: true,
        // Add storeId if you have it in context
      },
      { withCredentials: true } // Ensure cookies are sent for auth
    
    );
      if (res.data.success) {
        toast({ title: "Bulk request sent for approval." });
      }
    } catch (err) {
      toast({ title: err.response?.data?.message || "Error sending request", variant: "destructive" });
    }
  };

  const handleAddToCart = (productId) => {
    const quantity = Number(quantities[productId]) || MIN_BULK_QUANTITY;
    if (quantity < MIN_BULK_QUANTITY) {
      toast({
        title: `Minimum order is ${MIN_BULK_QUANTITY} units.`,
        variant: "destructive",
      });
      return;
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId,
        quantity,
        isBulk: true, // Optionally flag as bulk
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product added to cart for bulk request." });
      }
    });
  };

  const handleGetProductDetails = (productId) => {
    dispatch(fetchProductDetails(productId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Bulk Product Request</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productList && productList.length > 0 ? (
          productList.map((product) => (
            <Card key={product._id} className="flex flex-col">
              <CardContent 
              className="flex flex-col items-center p-4"
              
              >
                {product.totalStock === 0 && (
                  <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded mb-2">Out of Stock</span>
                )}
                {product.totalStock > 0 && product.totalStock <= (product.lowStockThreshold || 10) && (
                  <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-1 rounded mb-2">Low Stock</span>
                )}
                {product.onSale && (
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded mb-2">Sale</span>
                )}
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-32 h-32 object-cover mb-2 cursor-pointer"
                  onClick={() => handleGetProductDetails(product._id)}
                  style={{ cursor: 'pointer' }}
                />
                <div className="font-bold mb-1">{product.title}</div>
                <div className="text-sm text-gray-600 mb-2">{product.totalStock} in stock</div>
                <div className="text-muted-foreground mb-2">{product.price} Br</div>
                <Input
                  type="number"
                  min={MIN_BULK_QUANTITY}
                  value={quantities[product._id] || MIN_BULK_QUANTITY}
                  onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                  className="mb-2 w-24"
                />
                <Button
                  className="w-full"
                  onClick={() => handleBulkRequest(product._id)}
                >
                  Send Bulk Request
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No products available.</p>
        )}
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
        isBulk={true}
      />
    </div>
  );
}