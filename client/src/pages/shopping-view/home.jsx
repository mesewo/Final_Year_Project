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
  fetchStoreProducts,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  // { id: "accessories", label: "Accessories", icon: WatchIcon },
  // { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
  // { id: "nike", label: "Nike", icon: Shirt },
  // { id: "adidas", label: "Adidas", icon: WashingMachine },
  // { id: "puma", label: "Puma", icon: ShoppingBasket },
  // { id: "levi", label: "Levi's", icon: Airplay },
  // { id: "zara", label: "Zara", icon: Images },
  // { id: "h&m", label: "H&M", icon: Heater },
  {id: "abay", label: "ABAY", icon: Shirt},
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
    dispatch(fetchStoreProducts());
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  console.log(productList, "productList");

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
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
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
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
      <section className="py-12 bg-gray-50">
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
      </section>

      {/* <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

       {storeProducts && Object.keys(storeProducts).length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Our Stores</h2>
            
            {/* Azezo Store */}
            <div className="mb-16">
              <div 
                className="relative h-64 w-full rounded-lg overflow-hidden mb-8"
                style={{
                  backgroundImage: "url('data:image/jpeg;base64,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')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <h3 className="text-4xl font-bold text-white">Azezo</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {storeProducts['azezo']?.slice(0, 4).map((productItem) => (
                  <ShoppingProductTile
                    key={productItem._id}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))}
              </div>
            </div>

            {/* Maraki Store */}
            <div>
              <div 
                className="relative h-64 w-full rounded-lg overflow-hidden mb-8"
                style={{
                  backgroundImage: "url('data:image/jpeg;base64,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')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <h3 className="text-4xl font-bold text-white">Maraki</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {storeProducts['maraki']?.slice(0, 4).map((productItem) => (
                  <ShoppingProductTile
                    key={productItem._id}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}


      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    key={productItem._id || productItem.id}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
