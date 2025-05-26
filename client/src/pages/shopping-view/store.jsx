import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { fetchPublicStoreProducts, fetchProductDetails } from "@/store/shop/products-slice";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";





function StorePage() {
  const { storeId } = useParams(); 
  const dispatch = useDispatch();
  const { storeProducts, isLoading, productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  // State for dialog
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  useEffect(() => {
    if (storeId) {
      dispatch(fetchPublicStoreProducts(storeId));
    }
  }, [dispatch, storeId]);

  // Open dialog when productDetails is set
  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  function uniqueById(arr) {
    const seen = new Set();
    return arr.filter(item => {
      if (seen.has(item._id)) return false;
      seen.add(item._id);
      return true;
    });
  }

  const store1Id = "682ccdd83de974f948889f1f";
  const store2Id = "682ccde53de974f948889f23";

  // Map storeId to store name
  const storeNames = {
    [store1Id]: "Maraki",
    [store2Id]: "Azezo",
  };

  const currentStoreProducts = uniqueById(
    storeProducts.filter(product => product.storeId === storeId)
  );

  // Handler for product details
  function handleGetProductDetails(productId) {
    dispatch(fetchProductDetails(productId));
  }

  function handleAddtoCart(getCurrentProductId) {
    // console.log("Add to cart args:", { productId, totalStock });
    dispatch(
      addToCart({
        userId: user.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user.id));
        toast({ title: "Product is added to cart" });
      }
    });
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">
        {storeNames[storeId] ? `${storeNames[storeId]} Store Products` : "Store Products"}
      </h2>
      {isLoading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentStoreProducts.length > 0 ? (
            currentStoreProducts.map(productItem => (
              <ShoppingProductTile
                key={productItem._id || productItem.id}
                product={productItem}
                handleGetProductDetails={handleGetProductDetails}
                handleAddtoCart={handleAddtoCart}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">No products found for this store.</div>
          )}
        </div>
      )}
      {/* Product Details Modal */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default StorePage;