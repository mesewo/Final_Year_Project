import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addFeedback, getFeedbackDetails } from "@/store/shop/feedback-slice";
import { getAllOrdersByUserId } from "@/store/shop/order-slice";
import { fetchStoreProductStock } from "@/store/shop/products-slice";

function ProductDetailsDialog({ open, setOpen, productDetails, storeId }) {
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const [storeStock, setStoreStock] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { feedbackDetails } = useSelector((state) => state.shopFeedback);
  const userOrders = useSelector((state) => state.shopOrder.orderList);
  const { toast } = useToast();

  // Handle rating change
  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  // Add to cart logic
  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }
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

  // Handle dialog close
  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setFeedbackMsg("");
  }

  // Add feedback logic
  async function handleAddFeedback() {
    const userOrder = userOrders?.find(order => {
      const items = order?.orderItems?.length ? order.orderItems : order?.cartItems || [];
      return (
        ["delivered", "completed"].includes(order.orderStatus) &&
        Array.isArray(items) &&
        items.some(item => String(item.productId) === String(productDetails?._id))
      );
    });
    const orderId = userOrder?._id;

    if (!orderId) {
      toast({
        title: "You must purchase and try this product before leaving feedback.",
        variant: "destructive",
      });
      return;
    }

    const result = await dispatch(
      addFeedback({
        productId: productDetails?._id,
        userId: user?.id,
        orderId: orderId,
        userName: user?.userName,
        comment: feedbackMsg,
        rating: rating,
      })
    );

    const { success, message } = result?.payload || {};
    if (success) {
      setRating(0);
      setFeedbackMsg("");
      dispatch(getFeedbackDetails(productDetails?._id));
      toast({
        title: "Feedback submitted! It will be visible after approval.",
      });
      // Automatically close the dialog after a short delay
      setTimeout(() => {
        handleDialogClose();
      }, 1000);
    } else {
      toast({
        title: message || "Failed to submit feedback.",
        variant: "destructive",
      });
    }
  }

  // Fetch user orders on mount
  useEffect(() => {
    if (user?.id) {
      dispatch(getAllOrdersByUserId(user.id));
    }
  }, [user, dispatch]);

  // Fetch feedback details when product changes
  useEffect(() => {
    if (productDetails !== null) dispatch(getFeedbackDetails(productDetails?._id));
  }, [productDetails, dispatch]);

  // Fetch store stock when product or store changes
  useEffect(() => {
    if (productDetails?._id && storeId) {
      dispatch(fetchStoreProductStock({ productId: productDetails._id, storeId }))
        .then(res => {
          setStoreStock(res?.payload?.quantity ?? 0);
        });
    }
  }, [productDetails, storeId, dispatch]);

  // Only show approved feedback
  const approvedFeedback =
    feedbackDetails && feedbackDetails.length > 0
      ? feedbackDetails.filter((item) => item.status === "approved")
      : [];

  const averageFeedback =
    approvedFeedback.length > 0
      ? approvedFeedback.reduce((sum, item) => sum + item.rating, 0) /
        approvedFeedback.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:p-12 max-w-[95vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
          onClick={handleDialogClose}
          aria-label="Close"
        >
          {/* <X size={24} /> */}
        </button>
        
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-lg shadow-sm bg-white flex items-center justify-center">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>
        {/* Product Info & Actions */}
        <div className="flex flex-col h-full">
          <div>
            <h1 className="text-3xl font-extrabold mb-2">{productDetails?.title}</h1>
            <p className="text-muted-foreground text-lg mb-4">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between mb-2">
            <p
              className={`text-3xl font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              Br{productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-bold text-muted-foreground">
                Br{productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageFeedback} />
            </div>
            <span className="text-muted-foreground">
              ({averageFeedback.toFixed(2)})
            </span>
          </div>
          {/* Remaining Stock */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
              {storeStock === 0
                ? "Out of stock"
                : storeStock > 0
                  ? `In stock: ${storeStock}`
                  : "Loading stock..."}
            </span>
          </div>
          <div className="mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed" disabled>
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Cart
              </Button>
            )}
          </div>
          <Separator className="my-4" />
          {/* Feedback Section */}
          <div className="max-h-[300px] overflow-auto mb-6">
            <h2 className="text-xl font-bold mb-4">Feedback</h2>
            <div className="grid gap-6">
              {approvedFeedback.length > 0 ? (
                approvedFeedback.map((feedbackItem) => (
                  <div className="flex gap-4" key={feedbackItem._id}>
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {feedbackItem?.userName[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{feedbackItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={feedbackItem?.rating} />
                      </div>
                      <p className="text-muted-foreground">
                        {feedbackItem.comment}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1 className="text-muted-foreground">No Feedback</h1>
              )}
            </div>
            <div className="mt-10 flex-col flex gap-2">
              <Label>Write feedback</Label>
              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                name="feedbackMsg"
                value={feedbackMsg}
                onChange={(event) => setFeedbackMsg(event.target.value)}
                placeholder="Write feedback..."
              />
              <Button
                onClick={handleAddFeedback}
                disabled={feedbackMsg.trim() === ""}
              >
                Submit
              </Button>
              <span className="text-xs text-muted-foreground">
                Your feedback will be visible after approval.
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;