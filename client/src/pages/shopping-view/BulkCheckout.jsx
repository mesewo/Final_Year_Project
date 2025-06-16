import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import img from "../../assets/account.jpg";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import Address from "@/components/shopping-view/address";
import { fetchBulkCartItems } from "@/store/shop/bulkcart-slice";
import { clearBulkCart } from "@/store/shop/bulkcart-slice";

const BULK_DISCOUNT_PERCENT = 10; // 10% discount for bulk orders

export default function BulkCheckout() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentSelectedAddress: reduxSelectedAddress } = useSelector((state) => state.shopCart);
  const { bulkCartItems } = useSelector((state) => state.bulkCart);

  // Fetch bulk cart on mount
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchBulkCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  // Address selection state
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(reduxSelectedAddress || null);

  // Address input state (prefill from selected address if available)
  const [addressInfo, setAddressInfo] = useState({
    addressId: reduxSelectedAddress?._id || "",
    address: reduxSelectedAddress?.address || "",
    city: reduxSelectedAddress?.city || "",
    pincode: reduxSelectedAddress?.pincode || "",
    phone: reduxSelectedAddress?.phone || "",
    notes: reduxSelectedAddress?.notes || "",
  });

  // Update addressInfo when a new address is selected
  const handleAddressSelect = (addressObj) => {
    setCurrentSelectedAddress(addressObj);
    setAddressInfo({
      addressId: addressObj?._id || "",
      address: addressObj?.address || "",
      city: addressObj?.city || "",
      pincode: addressObj?.pincode || "",
      phone: addressObj?.phone || "",
      notes: addressObj?.notes || "",
    });
  };

  // Handle manual address input change
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate address fields
  const isAddressValid =
    addressInfo.address &&
    addressInfo.city &&
    addressInfo.pincode &&
    addressInfo.phone;

  // Calculate totals
  const subtotal = bulkCartItems.reduce(
    (sum, item) => sum + (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity,
    0
  );
  const discount = (subtotal * BULK_DISCOUNT_PERCENT) / 100;
  const total = subtotal - discount;

  // Payment handler
  const handleChapaPayment = async () => {
    if (!bulkCartItems.length) {
      return toast({ title: "Your bulk cart is empty.", variant: "destructive" });
    }
    if (!user?.id) {
      return toast({ title: "User not found. Please login.", variant: "destructive" });
    }
    if (!isAddressValid) {
      return toast({
        title: "Please fill in all required address fields.",
        variant: "destructive",
      });
    }

    try {
      // 1. Create product requests for each item in the bulk cart
      for (const item of bulkCartItems) {
        const res = await axios.post(
          "/api/product-requests/request",
          {
            productId: item.productId,
            quantity: item.quantity,
            isBulk: true,
            addressInfo: {
              address: addressInfo.address,
              city: addressInfo.city,
              pincode: addressInfo.pincode,
              phone: addressInfo.phone,
              notes: addressInfo.notes,
            },
          },
          { withCredentials: true }
        );
        if (!res.data.success) {
            // Check for pending request message
            if (
            res.data.message &&
            res.data.message.toLowerCase().includes("pending request")
            ) {
            toast({
                title: "Pending Order",
                description: "You already have a pending order for this product.",
                variant: "destructive",
            });
            } else {
            toast({
                title: res.data.message || "Failed to create product request.",
                variant: "destructive",
            });
            }
            return;
        }      
    }

      // 2. Generate a tx_ref for the payment
      const tx_ref = `bulk_${Date.now()}_${user.id}`;

      // 3. Initiate Chapa payment
      const paymentResponse = await fetch(
        "http://localhost:5000/api/payment/initiate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            amount: total,
            currency: "ETB",
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            tx_ref,
            return_url: `http://localhost:5173/shop/payment-static-success&from=chapa`,
          }),
        }
      );

      const data = await paymentResponse.json();

      if (data.data?.checkout_url) {
        // await axios.delete(`/api/shop/bulk-cart/clear/${user.id}`);
        // dispatch(clearBulkCart());// Clear bulk cart after successful payment initiation
        localStorage.setItem("last_tx_ref", tx_ref);
        window.location.href = data.data.checkout_url;
      } else {
        toast({
          title: "Failed to initiate payment.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: error.message || "Failed to place bulk order.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container w-full min-h-screen mx-auto px-2 sm:px-4 py-8 ">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover" />
      </div>
      <h1 className="text-3xl font-bold mb-8 text-center">Bulk Checkout</h1>
      {bulkCartItems.length === 0 ? (
        <div className="text-center text-gray-500">Your bulk cart is empty.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
          {/* Address selection and input */}
          <div>
            <Address
              selectedId={currentSelectedAddress}
              setCurrentSelectedAddress={handleAddressSelect}
            />
            {/* ...address input fields if needed... */}
          </div>
          {/* Cart summary and payment */}
          <div className="flex flex-col gap-4">
            <ul className="mb-6">
              {bulkCartItems.map((item) => (
                <li key={item.productId} className="flex justify-between mb-2">
                  <span>
                    {item.title} <span className="text-gray-500">x {item.quantity}</span>
                  </span>
                  <span>
                    Br{((item.salePrice > 0 ? item.salePrice : item.price) * item.quantity).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>Br{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2 text-green-600">
                <span>Bulk Discount ({BULK_DISCOUNT_PERCENT}%)</span>
                <span>-Br{discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Br{total.toLocaleString()}</span>
              </div>
            </div>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleChapaPayment}
              disabled={!isAddressValid}
            >
              Pay with Chapa
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}