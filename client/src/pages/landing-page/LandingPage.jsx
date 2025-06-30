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
import { motion } from "framer-motion";
import MagicalHeroImage from "@/components/MagicalHeroImage";
import ShoppingHeader from "@/components/shopping-view/header";
import Footer from "@/components/shopping-view/footer";
import AbayProjectSlider from "@/components/shopping-view/abayProjectSlider"; // <-- Add this import

const stores = [
  {
    id: "azezo",
    name: "Azezo",
    image:
      "https://c8.alamy.com/comp/C3626F/clothes-market-stall-old-town-harar-ethiopia-africa-C3626F.jpg",
    storeId: "682ccde53de974f948889f23",
  },
  {
    id: "maraki",
    name: "Maraki",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf073vps5yYWYCkcS-6bn3HiZxUh0Rsy8tpQ&s",
    storeId: "682ccdd83de974f948889f1f",
  },
];

function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productDetails, storeProducts } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToStore(store) {
    navigate(`/shop/store/${store.storeId}`);
  }

  function handleGetProductDetails(productId) {
    dispatch(fetchProductDetails(productId));
  }

  function handleAddtoCart(productId) {
    if (!user?.id) {
      toast({
        title: "Please log in to add to cart",
        description: "Login is required to add items to cart.",
      });
      return;
    }

    dispatch(
      addToCart({
        userId: user.id,
        productId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        if (user?.id) {
          dispatch(fetchCartItems(user.id));
        }

        toast({
          title: "Product added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) =>
        featureImageList.length ? (prev + 1) % featureImageList.length : 0
      );
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

  return (
    <div className="flex flex-col min-h-screen">
      <ShoppingHeader />
      {/* Hero Banner */}
      <div className="relative w-full h-[420px] md:h-[600px] overflow-hidden rounded-3xl shadow-2xl my-8">
        {featureImageList?.map((slide, index) => (
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
        ))}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-transparent z-10" />
        {/* Centered Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg animate-fade-in-up">
            Welcome to Abay Garment Shopping
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
          <motion.h2
            className="text-3xl font-bold text-center mb-8 text-gray-800"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5, type: "spring" }}
          >
            Our Stores
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-7xl mx-auto">
            {stores.map((store, idx) => (
              <motion.div
                key={store.id}
                whileHover={{
                  scale: 1.06,
                  boxShadow: "0 0 40px 8px #38bdf8, 0 2px 20px 0 #0ea5e9",
                  background:
                    "linear-gradient(135deg,rgba(59,130,246,0.10),rgba(14,165,233,0.08))",
                  filter: "brightness(1.04) saturate(1.1)",
                  transition: { duration: 0.25, type: "spring" },
                }}
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { delay: 0.1 * idx, type: "spring" },
                }}
                className="w-full cursor-pointer border-0 shadow-lg bg-white rounded-2xl overflow-hidden relative group"
                onClick={() => handleNavigateToStore(store)}
              >
                <div className="relative h-80 w-full">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent px-6 py-4 flex items-end rounded-b-2xl">
                    <h3 className="text-white text-3xl font-bold drop-shadow-lg">
                      {store.name}
                    </h3>
                  </div>
                </div>
                {/* Magical animated border */}
                <motion.div
                  className="absolute inset-0 pointer-events-none rounded-2xl border-4 border-blue-300 opacity-30 group-hover:opacity-70 blur-[2px] transition"
                  animate={{
                    boxShadow: [
                      "0 0 0px #38bdf8",
                      "0 0 20px #38bdf8",
                      "0 0 40px #38bdf8",
                      "0 0 20px #38bdf8",
                      "0 0 0px #38bdf8",
                    ],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            ))}
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
                bgImageUrl="https://images.unsplash.com/photo-1556740738-b6a63e27c4df"
                products={storeProducts["azezo"]}
                handleGetProductDetails={handleGetProductDetails}
                handleAddtoCart={handleAddtoCart}
              />
              <StoreSection
                storeName="maraki"
                bgImageUrl="https://images.unsplash.com/photo-1523381294911-8d3cead13475"
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
                    in large quantities.
                  </p>
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

      {/* Product Details Modal */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
      <Footer />
    </div>
  );
}

export default LandingPage;
