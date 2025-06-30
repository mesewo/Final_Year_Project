import { Card, CardContent } from "../ui/card";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Star } from "lucide-react";
import { useSelector } from "react-redux";

// Helper to render stars
function renderStars(rating) {
  const stars = [];
  const rounded = Math.round(rating * 2) / 2;
  for (let i = 1; i <= 5; i++) {
    if (i <= rounded) {
      stars.push(
        <Star
          key={i}
          className="w-5 h-5 text-yellow-400 inline"
          fill="currentColor"
        />
      );
    } else if (i - 0.5 === rounded) {
      stars.push(
        <Star
          key={i}
          className="w-5 h-5 text-yellow-400 inline"
          style={{ clipPath: "inset(0 50% 0 0)" }}
          fill="currentColor"
        />
      );
    } else {
      stars.push(
        <Star
          key={i}
          className="w-5 h-5 text-gray-300 dark:text-gray-600 inline"
        />
      );
    }
  }
  return stars;
}

function ShoppingProductTile({ product, handleGetProductDetails }) {
  const { feedbackList } = useSelector((state) => state.shopFeedback);

  const approvedFeedback = Array.isArray(feedbackList)
    ? feedbackList.filter(
        (item) =>
          item.status === "approved" &&
          String(item.product) === String(product._id)
      )
    : [];

  const avgRating =
    approvedFeedback.length > 0
      ? approvedFeedback.reduce((sum, item) => sum + item.rating, 0) /
        approvedFeedback.length
      : 0;

  const feedbackCount = approvedFeedback.length;

  const stock =
    typeof product?.totalStock === "number"
      ? product.totalStock
      : typeof product?.quantity === "number"
      ? product.quantity
      : typeof product?.stock === "number"
      ? product.stock
      : null;

  return (
    <Card className="w-full max-w-sm mx-auto shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden group bg-white dark:bg-gray-800 dark:text-white">
      <div
        onClick={() => handleGetProductDetails(product?._id)}
        className="cursor-pointer"
      >
        <div className="relative overflow-hidden">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[280px] object-cover rounded-t-xl transform group-hover:scale-105 transition-transform duration-300"
          />
          {stock === 0 ? (
            <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white shadow">
              Out Of Stock
            </Badge>
          ) : stock > 0 && stock < 10 ? (
            <Badge className="absolute top-3 left-3 bg-yellow-500 hover:bg-yellow-600 text-white shadow">
              {`Only ${stock} left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-3 left-3 bg-green-600 hover:bg-green-700 text-white shadow">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-1 truncate">
            {product?.title}
          </h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground dark:text-gray-300">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-xs text-muted-foreground dark:text-gray-300">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span
              className={`${
                product?.salePrice > 0
                  ? "line-through text-gray-400 dark:text-gray-500"
                  : "text-primary"
              } text-base font-semibold`}
            >
              Br{product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-base font-bold text-primary">
                Br{product?.salePrice}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-2">
            {renderStars(avgRating)}
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              {feedbackCount > 0
                ? `${avgRating.toFixed(1)} · ${feedbackCount} review${
                    feedbackCount > 1 ? "s" : ""
                  }`
                : "No reviews"}
            </span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export default ShoppingProductTile;
