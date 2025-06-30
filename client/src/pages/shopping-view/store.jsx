import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import {
  fetchPublicStoreProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { fetchStoreById } from "@/store/shop/store-slice";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { getAllFeedback } from "@/store/shop/feedback-slice";
import ShoppingHeader from "@/components/shopping-view/header";
import ShoppingFooter from "@/components/shopping-view/footer";

const categories = [
  { id: "men", label: "Men" },
  { id: "women", label: "Women" },
  { id: "kids", label: "Kids" },
];

function StorePage() {
  const { storeId } = useParams();
  const dispatch = useDispatch();
  const { storeProducts, isLoading, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { storeInfo, status: storeStatus } = useSelector(
    (state) => state.store
  );
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const [filters, setFilters] = useState({ category: [] });
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (storeId) {
      dispatch(fetchStoreById(storeId));
      dispatch(fetchPublicStoreProducts(storeId));
    }
  }, [dispatch, storeId]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    if (storeId) {
      dispatch(getAllFeedback());
    }
  }, [dispatch]);

  function uniqueById(arr) {
    const seen = new Set();
    return arr.filter((item) => {
      if (seen.has(item._id)) return false;
      seen.add(item._id);
      return true;
    });
  }

  // Filter products for this store
  let currentStoreProducts = uniqueById(
    storeProducts.filter((product) => product.storeId === storeId)
  );

  // Sort by latest (most recent first)
  currentStoreProducts = currentStoreProducts.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Apply sidebar filters
  if (filters.category.length > 0) {
    currentStoreProducts = currentStoreProducts.filter((product) =>
      filters.category.includes(product.category)
    );
  }

  // Apply search filter
  let intersectionProducts = currentStoreProducts;
  if (searchValue && searchValue.trim() !== "") {
    const searchLower = searchValue.trim().toLowerCase();
    intersectionProducts = intersectionProducts.filter((product) =>
      product.title?.toLowerCase().includes(searchLower)
    );
  }

  function handleGetProductDetails(productId) {
    dispatch(fetchProductDetails(productId));
  }

  function handleAddtoCart(getCurrentProductId) {
    // Find the product object from the current store's products
    const productObj = currentStoreProducts.find(
      (p) => p._id === getCurrentProductId || p.id === getCurrentProductId
    );
    if (!productObj) return;

    dispatch(
      addToCart({
        userId: user.id,
        productId: getCurrentProductId,
        quantity: 1,
        sellerId: productObj.seller || productObj.sellerId,
        storeId: productObj.store || productObj.storeId,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user.id));
        toast({ title: "Product is added to cart" });
      }
    });
  }

  function SidebarFilters() {
    return (
      <div className="w-64 pr-6">
        <h3 className="font-bold mb-4 text-lg">Filter by Category</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.category.includes(cat.id)}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    category: e.target.checked
                      ? [...prev.category, cat.id]
                      : prev.category.filter((c) => c !== cat.id),
                  }));
                }}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="text-gray-700">{cat.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (storeStatus === "loading") {
    return (
      <div className="flex flex-col min-h-screen">
        <ShoppingHeader />
        <div className="p-8 text-center flex-1">Loading store...</div>
        <ShoppingFooter />
      </div>
    );
  }
  if (storeStatus === "failed" || !storeInfo) {
    return (
      <div className="flex flex-col min-h-screen">
        <ShoppingHeader />
        <div className="p-8 text-center text-red-600 flex-1">
          Store not found.
        </div>
        <ShoppingFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ShoppingHeader />
      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Store Banner */}
        <div className="relative rounded-xl overflow-hidden mb-8 h-64">
          <img
            src={
              storeInfo.image ||
              "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80"
            }
            alt={storeInfo.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
            <div>
              <h1 className="text-4xl font-bold text-white">
                {storeInfo.name}
              </h1>
              <p className="text-gray-200 mt-2">{storeInfo.description}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <SidebarFilters />

          {/* Main content */}
          <div className="flex-1">
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                />
                <svg
                  className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {intersectionProducts.length > 0 ? (
                    intersectionProducts.map((productItem) => (
                      <ShoppingProductTile
                        key={productItem._id || productItem.id}
                        product={productItem}
                        handleGetProductDetails={handleGetProductDetails}
                        handleAddtoCart={handleAddtoCart}
                      />
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-gray-900">
                        No products found
                      </h3>
                      <p className="mt-1 text-gray-500">
                        Try adjusting your search or filter to find what you're
                        looking for.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Product Details Modal */}
        <ProductDetailsDialog
          open={openDetailsDialog}
          setOpen={setOpenDetailsDialog}
          storeId={storeId}
          productDetails={productDetails}
        />
      </div>
      <ShoppingFooter />
    </div>
  );
}

export default StorePage;
