import { useState, useEffect } from "react";
import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { createNewOrder } from "@/store/shop/order-slice";
import { Navigate, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { clearCart } from "@/store/shop/cart-slice"; // assume you have this

export default function ShoppingCheckout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL, error: orderError } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Calculate total
  const totalCartAmount = cartItems?.items?.reduce(
    (sum, itm) =>
      sum + (itm.salePrice > 0 ? itm.salePrice : itm.price) * itm.quantity,
    0
  ) || 0;

  const handlePlaceOrder = async () => {
    // validations
    if (!cartItems?.items?.length) {
      return toast({ title: "Your cart is empty.", variant: "destructive" });
    }
    if (!currentSelectedAddress) {
      return toast({ title: "Select an address to proceed.", variant: "destructive" });
    }

    setIsSubmitting(true);

    const orderData = {
      userId: user.id,
      cartId: cartItems._id,
      cartItems: cartItems.items.map((i) => ({
        productId: i.productId,
        title: i.title,
        image: i.image,
        price: i.salePrice > 0 ? i.salePrice : i.price,
        quantity: i.quantity,
        sellerId: i.sellerId,
        storeId: i.storeId,
      })),
      addressInfo: {
        addressId: currentSelectedAddress._id,
        address: currentSelectedAddress.address,
        city: currentSelectedAddress.city,
        pincode: currentSelectedAddress.pincode,
        phone: currentSelectedAddress.phone,
        notes: currentSelectedAddress.notes,
      },
      orderStatus: "pending",
      paymentMethod: "telebirr",     // <-- use Telebirr
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    };

    const res = await dispatch(createNewOrder(orderData)).unwrap().catch((e) => {
      toast({ title: e || "Failed to place order.", variant: "destructive" });
      setIsSubmitting(false);
    });

    if (res?.success) {
      toast({ title: "Order placed successfully!", variant: "default" });
      dispatch(clearCart());
      navigate("/shop/orders");  // redirect to orders page
    }
  };

  // If using PayPal or redirect logic:
  if (approvalURL) window.location.href = approvalURL;

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems?.items?.map((item) => (
            <UserCartItemsContent key={item.productId} cartItem={item} />
          ))}

          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">Br{totalCartAmount}</span>
            </div>
          </div>

          <div className="mt-4 w-full">
            <Button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Placing Order..." : "Place Order with Telebirr"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
