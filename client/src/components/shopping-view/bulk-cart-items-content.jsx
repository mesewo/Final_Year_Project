import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { updateBulkCartQuantity, deleteBulkCartItem } from "@/store/shop/bulkcart-slice";
import { useToast } from "../ui/use-toast";

const MIN_BULK_QUANTITY = 10;

function BulkCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    let newQuantity =
      typeOfAction === "plus"
        ? getCartItem?.quantity + 1
        : getCartItem?.quantity - 1;

    // Prevent reducing below minimum bulk quantity
    if (newQuantity < MIN_BULK_QUANTITY) {
      toast({
        title: `Minimum bulk order is ${MIN_BULK_QUANTITY}`,
        variant: "destructive",
      });
      return;
    }

    // Prevent exceeding stock
    const product = productList.find((p) => p._id === getCartItem?.productId);
    if (product && newQuantity > product.totalStock) {
      toast({
        title: `Only ${product.totalStock} units available in stock.`,
        variant: "destructive",
      });
      return;
    }

    dispatch(
      updateBulkCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity: newQuantity,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Bulk cart item updated.",
        });
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteBulkCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Bulk cart item deleted.",
        });
      }
    });
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={cartItem?.quantity <= MIN_BULK_QUANTITY}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          Br
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
}

export default BulkCartItemsContent;