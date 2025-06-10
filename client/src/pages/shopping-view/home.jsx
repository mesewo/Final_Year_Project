import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import StoreSection from "@/components/shopping-view/StoreSection";
// import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
// import { ShoppingBasket } from "lucide-react";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
];

const stores = [
  {
    id: "azezo",
    name: "Azezo",
    image: "https://z-p3-scontent.fbjr1-1.fna.fbcdn.net/v/t1.6435-9/122141760_142306984267744_896324440922264095_n.jpg?stp=dst-jpg_s600x600_tt6&_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHNn26ZieBqcoVxPFd1bpy33IXsFWHOt5HchewVYc63kdv4L6kMMuC-HmI0X8f0YWXP48ob-kpgE38Skh-smoHa&_nc_ohc=NdTLSF1pJHgQ7kNvwHMeM8G&_nc_oc=AdnGFakZrhsXB8kwM_5Lzj6CvYY-tmod2O7kHCU5n4jMDazI41ZMBJp6XEYGtBX8UQo&_nc_zt=23&_nc_ht=z-p3-scontent.fbjr1-1.fna&_nc_gid=N7miM4CWE46W9Q0tkw5AVQ&oh=00_AfKjYHTbv9_6kTG15cMT0I4cBP1A84ciP-6rsEczjHIzuw&oe=68544DAB",
    storeId: "682ccde53de974f948889f23",
  },
  {
    id: "maraki",
    name: "Maraki",
    image: "https://z-p3-scontent.fbjr1-1.fna.fbcdn.net/v/t1.6435-9/119952990_119894139861269_6810437200308365758_n.jpg?stp=c129.0.774.774a_dst-jpg_s600x600_tt6&_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFNhgTgQCwK6FZ6wjtnXL1U2dLXIz-23EzZ0tcjP7bcTKhiHyxT1jiNL_cOkOhqOWz7BcCiGgPrKDJFnWoH_JQm&_nc_ohc=ZugLHHLMewoQ7kNvwFis9Wh&_nc_oc=AdmuB5UjA-Nk3_Ps2TlLeLvHSVganR0e-DF_bCbx90yuzhecE9MfCscowWk6Ml3gRj0&_nc_zt=23&_nc_ht=z-p3-scontent.fbjr1-1.fna&_nc_gid=XcyyAopqSH47tfZFPBdT7A&oh=00_AfKV2DrRcrnsaMy56LQWm85FMauxQbddx6r5klwzLUkSnw&oe=68545FF1",
    storeId: "682ccdd83de974f948889f1f",
  },
];

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

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

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
    }, 15000);

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
      {/* Hero Banner */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
              />
            ))
          : null}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) % featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Shop by Category */}
      {/* <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Our Stores - Clickable Store Tiles */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Our Stores</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
            {stores.map((store) => (
              <Card
                key={store.id}
                onClick={() => handleNavigateToStore(store)}
                className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
              >
                <CardContent className="relative p-0 h-48">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold">
                      {store.name}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Store Sections with Product Tiles */}
      {storeProducts && Object.keys(storeProducts).length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <StoreSection
              storeName="azezo"
              bgImageUrl="https://example.com/azezo-store-bg.jpg"
              products={storeProducts["azezo"]}
              handleGetProductDetails={handleGetProductDetails}
              handleAddtoCart={handleAddtoCart}
            />

            <StoreSection
              storeName="maraki"
              bgImageUrl="https://example.com/maraki-store-bg.jpg"
              products={storeProducts["maraki"]}
              handleGetProductDetails={handleGetProductDetails}
              handleAddtoCart={handleAddtoCart}
            />
          </div>
        </section>

        
      )}

      {/* Bulk Request Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-center mb-8">Bulk/Big Request</h2>
          <Card
            className="w-full max-w-md cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/shop/bulk-request")}
          >
            <CardContent className="flex flex-col items-center justify-center p-8">
              <ShoppingBasket className="w-16 h-16 mb-4 text-primary" />
              <span className="font-bold text-xl mb-2">Request Bulk Products</span>
              <span className="text-muted-foreground text-center">
                Click here to request large quantities directly from the factory manager.
              </span>
            </CardContent>
          </Card>
        </div>
      </section>

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