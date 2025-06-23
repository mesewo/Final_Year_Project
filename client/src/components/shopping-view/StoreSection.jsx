import ShoppingProductTile from "./product-tile";

function StoreSection({ 
  storeName, 
  bgImageUrl, 
  products = [], 
  handleGetProductDetails, 
  handleAddtoCart 
}) {
  if (!products.length) return null;

  return (
    <div className="mb-16 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div
        className="relative h-64 w-full rounded-lg overflow-hidden mb-8 shadow-md"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${bgImageUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-4xl font-bold text-white capitalize drop-shadow-lg">
            {storeName}
          </h3>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((productItem) => (
          <ShoppingProductTile
            key={productItem._id}
            handleGetProductDetails={handleGetProductDetails}
            product={productItem}
            handleAddtoCart={handleAddtoCart}
          />
        ))}
      </div>
      {products.length > 4 && (
        <div className="mt-8 text-center">
          <Button 
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
            onClick={() => navigate(`/shop/store/${storeName}`)}
          >
            View All {storeName} Products
          </Button>
        </div>
      )}
    </div>
  );
}

export default StoreSection;