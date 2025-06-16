import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import BulkCartItemsContent from "./bulk-cart-items-content";

function BulkCartWrapper({ bulkCartItems, setOpenBulkCartSheet }) {
  const navigate = useNavigate();

  const totalBulkCartAmount =
    bulkCartItems && bulkCartItems.length > 0
      ? bulkCartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Bulk Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {bulkCartItems && bulkCartItems.length > 0
          ? bulkCartItems.map((item) => (
              <BulkCartItemsContent key={item._id || item.productId} cartItem={item} />
            ))
          : <div className="text-center text-gray-500">Bulk cart is empty.</div>}
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">Br{totalBulkCartAmount}</span>
        </div>
      </div>
      
      <Button
        onClick={() => {
          navigate("/shop/bulk-checkout");
          setOpenBulkCartSheet(false);
        }}
        className="w-full mt-6"
      >
        Bulk Checkout
      </Button>
    </SheetContent>
  );
}

export default BulkCartWrapper;