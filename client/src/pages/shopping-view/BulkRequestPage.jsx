import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import {
  addToBulkCart,
  fetchBulkCartItems,
  updateBulkCartQuantity,
  deleteBulkCartItem,
} from "@/store/shop/bulkcart-slice";

const MIN_BULK_QUANTITY = 10;

export default function BulkRequest() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [quantities, setQuantities] = useState({});
  const { bulkCartItems } = useSelector((state) => state.bulkCart);

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" }));
  }, [dispatch]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchBulkCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  const handleQuantityChange = (productId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleAddToBulkCart = (product) => {
    const quantity = Number(quantities[product._id]) || MIN_BULK_QUANTITY;
    if (quantity < MIN_BULK_QUANTITY) {
      toast({
        title: `Minimum order is ${MIN_BULK_QUANTITY} units.`,
        variant: "destructive",
      });
      return;
    }
    if (quantity > product.totalStock) {
      toast({
        title: `Only ${product.totalStock} units available in stock.`,
        variant: "destructive",
      });
      return;
    }
    dispatch(
      addToBulkCart({
        userId: user?.id,
        productId: product._id,
        quantity,
      })
    ).then((res) => {
      console.log("Add to bulk cart response:", res);
      if (res?.payload?.success) {
        toast({ title: "Added to bulk cart." });
        dispatch(fetchBulkCartItems(user?.id));
      } else {
        toast({
          title: res?.payload?.message || "Failed to add to bulk cart.",
          description: JSON.stringify(res?.payload, null, 2),
          variant: "destructive",
        });
      }
    })
    .catch((err) => {
      // Log the error for debugging
      console.error("Bulk cart add error:", err);
      toast({
        title: "Error adding to bulk cart.",
        description: err?.message || JSON.stringify(err, null, 2),
        variant: "destructive",
      });
    });

  };

  const handleUpdateBulkCartQuantity = (productId, quantity) => {
    dispatch(
      updateBulkCartQuantity({
        userId: user?.id,
        productId,
        quantity,
      })
    ).then((res) => {
      if (res?.payload?.success) {
        toast({ title: "Updated quantity in bulk cart." });
        dispatch(fetchBulkCartItems(user?.id));
      }
    });
  };

  const handleDeleteBulkCartItem = (productId) => {
    dispatch(
      deleteBulkCartItem({
        userId: user?.id,
        productId,
      })
    ).then((res) => {
      if (res?.payload?.success) {
        toast({ title: "Removed from bulk cart." });
        dispatch(fetchBulkCartItems(user?.id));
      }
    });
  };

  const handleGetProductDetails = (productId) => {
    dispatch(fetchProductDetails(productId));
  };

  const handleCheckoutRedirect = () => {
    navigate("/shop/bulk-checkout");
  };

  const totalBulkCartAmount =
    bulkCartItems && bulkCartItems.length > 0
      ? bulkCartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Bulk Product Request</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productList && productList.length > 0 ? (
          productList.map((product) => (
            <Card key={product._id} className="flex flex-col">
              <CardContent className="flex flex-col items-center p-4">
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
                  style={{ cursor: "pointer" }}
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
                  onClick={() => handleAddToBulkCart(product)}
                >
                  Add to Bulk Cart
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

      {bulkCartItems && bulkCartItems.length > 0 && (
        <div className="mt-8 border rounded p-4 bg-gray-50">
          <h2 className="font-bold mb-2">Bulk Cart</h2>
          <ul>
            {bulkCartItems.map((item) => (
              <li key={item.productId}>
                {item.title || item.product?.title} — {item.quantity} units
                <Input
                  type="number"
                  min={MIN_BULK_QUANTITY}
                  value={item.quantity}
                  onChange={(e) =>
                    handleUpdateBulkCartQuantity(item.productId, Number(e.target.value))
                  }
                  className="mx-2 w-20 inline-block"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteBulkCartItem(item.productId)}
                  className="ml-2"
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-4">
            <span className="font-bold">Total</span>
            <span className="font-bold">Br{totalBulkCartAmount}</span>
          </div>
          <Button
            onClick={handleCheckoutRedirect}
            disabled={isSubmitting}
            className="w-full mt-4"
          >
            {isSubmitting ? "Placing Order..." : "Place Order with Chapa"}
          </Button>
        </div>
      )}
    </div>
  );
}