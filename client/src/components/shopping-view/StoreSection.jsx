import ShoppingProductTile from "./product-tile";

function StoreSection({ storeName, bgImageUrl, products = [], handleGetProductDetails, handleAddtoCart }) {
  if (!products.length) return null;

  return (
    <div className="mb-16">
      <div
        className="relative h-64 w-full rounded-lg overflow-hidden mb-8"
        style={{
          backgroundImage: `url('${bgImageUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <h3 className="text-4xl font-bold text-white capitalize">{storeName}</h3>
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
    </div>
  );
}

export default StoreSection;
