import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ShoppingBasket,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import StoreSection from "@/components/shopping-view/StoreSection";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import { fetchAllStores } from "@/store/shop/store-slice";
import AbayProjectSlider from "@/components/shopping-view/abayProjectSlider";

// const stores = [
//   {
//     id: "azezo",
//     name: "Azezo",
//     image: "https://c8.alamy.com/comp/C3626F/clothes-market-stall-old-town-harar-ethiopia-africa-C3626F.jpg",
//     storeId: "682ccde53de974f948889f23",
//   },
//   {
//     id: "maraki",
//     name: "Maraki",
//     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf073vps5yYWYCkcS-6bn3HiZxUh0Rsy8tpQ&s",
//     storeId: "682ccdd83de974f948889f1f",
//   },
// ];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails, storeProducts } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { stores, status: storesStatus } = useSelector((state) => state.stores);

  function handleNavigateToStore(store) {
    navigate(`/shop/store/${store.storeId}`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 1000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllStores());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Banner */}
      <div className="relative w-full h-[420px] md:h-[600px] overflow-hidden rounded-3xl shadow-2xl my-8">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`${
                  index === currentSlide
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"
                } absolute top-0 left-0 w-full h-full object-cover transition-all duration-1000`}
                alt={`slide-${index}`}
              />
            ))
          : null}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-transparent z-10" />
        {/* Centered Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg animate-fade-in-up">
            Welcome to Abay Industrial Shopping
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-blue-100 font-medium max-w-2xl mx-auto animate-fade-in-up delay-150">
            Discover quality products, bulk deals, and more from Ethiopia’s
            leading industrial group.
          </p>
        </div>
        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prev) =>
                (prev - 1 + featureImageList.length) % featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 hover:bg-blue-500 hover:text-white z-30"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % featureImageList.length)
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 hover:bg-blue-500 hover:text-white z-30"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </Button>
      </div>

      {/* Abay Project Slider */}
      <div className="my-12">
        <AbayProjectSlider />
      </div>

      {/* Our Stores Section */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Our Stores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-7xl mx-auto">
            {storesStatus === "loading" ? (
              <div>Loading stores...</div>
            ) : stores.length === 0 ? (
              <div>No stores found.</div>
            ) : (
              stores.map((store) => (
                <Card
                  key={store._id}
                  onClick={() => navigate(`/shop/store/${store._id}`)}
                  className="w-full cursor-pointer transition-transform duration-300 border-0 shadow-lg hover:scale-105 hover:shadow-2xl bg-white rounded-2xl overflow-hidden"
                >
                  <div className="relative h-80 w-full">
                    <img
                      src={
                        store.image ||
                        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80"
                      }
                      alt={store.name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent px-6 py-4 flex items-end rounded-b-2xl">
                      <h3 className="text-white text-3xl font-bold drop-shadow-lg">
                        {store.name}
                      </h3>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Store Sections with Product Tiles */}
      {storeProducts && Object.keys(storeProducts).length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="space-y-16">
              <StoreSection
                storeName="azezo"
                bgImageUrl="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                products={storeProducts["azezo"]}
                handleGetProductDetails={handleGetProductDetails}
                handleAddtoCart={handleAddtoCart}
              />

              <StoreSection
                storeName="maraki"
                bgImageUrl="https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                products={storeProducts["maraki"]}
                handleGetProductDetails={handleGetProductDetails}
                handleAddtoCart={handleAddtoCart}
              />
            </div>
          </div>
        </section>
      )}

      {/* Bulk Request Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-100 to-blue-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Bulk & Corporate Orders
              </h2>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Special pricing and dedicated support for large quantity
                purchases
              </p>
            </div>
            <Card
              className="w-full cursor-pointer hover:shadow-2xl transition-all duration-300 border-blue-300 overflow-hidden"
              onClick={() => navigate("/shop/bulk-request")}
            >
              <CardContent className="p-0 flex flex-col md:flex-row">
                <div className="md:w-1/2 h-64 md:h-auto">
                  <img
                    src="https://img.freepik.com/free-photo/textiles-sale_1398-3775.jpg"
                    alt="Bulk Request"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex flex-col justify-center">
                  <h3 className="font-bold text-2xl mb-4">
                    Request Bulk Products
                  </h3>
                  <p className="mb-6 text-blue-100">
                    Get wholesale pricing and priority processing when ordering
                    in large quantities. Perfect for businesses, events, and
                    organizations.
                  </p>
                  <ul className="mb-6 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Volume discounts available</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Dedicated account manager</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Custom packaging options</span>
                    </li>
                  </ul>
                  <Button
                    className="mt-4 bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-bold w-full md:w-auto"
                    size="lg"
                  >
                    Request Bulk Order <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}

      {/* Product Details Modal */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
