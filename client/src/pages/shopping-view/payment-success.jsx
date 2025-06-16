import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/shop/cart-slice";
import { clearBulkCart } from "@/store/shop/bulkcart-slice";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("Verifying payment...");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [paymentRef, setPaymentRef] = useState(null);

  useEffect(() => {
      let tx_ref = searchParams.get("tx_ref");
    // const orderId = searchParams.get("orderId");
    if (!tx_ref) {
        tx_ref = localStorage.getItem("last_tx_ref"); // fallback for test/demo mode
      }
    if (!tx_ref /*|| !orderId*/) {
      setError("Missing transaction reference");
      setStatus(null);
      return;
    }

    fetch("http://localhost:5000/api/payment-verify/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference: tx_ref/*, orderId*/ }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setStatus(null);
        } else {
          setStatus(null);
          setPaymentRef(tx_ref);
          localStorage.removeItem("last_tx_ref")
          dispatch(clearBulkCart());
          localStorage.removeItem("cart");
        }
      })
      .catch(() => {
        setError("Failed to verify payment.");
        setStatus(null);
      });
  }, [searchParams]);

  useEffect(() => {
    
    // dispatch(clearCart());
    // Optionally, clear localStorage if you store cart there
    // localStorage.removeItem("cart");
  }, [dispatch]);

  if (error) return <div className="text-red-600 p-5">{error}</div>;
  if (status) return <div className="p-5">{status}</div>;

  return (
    <div className="p-5 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
      <p className="mb-4 text-center">
        Please show this QR code at the branch to pick up your order.
      </p>
      <div className="bg-white p-4 rounded shadow-md">
        <QRCode
          value={`${window.location.origin}/verify-qr?ref=${paymentRef}`}
          style={{ height: "auto", maxWidth: "200px", width: "100%" }}
        />
      </div>
      <Button className="mt-6" onClick={() => navigate("/")}>
        Go to Home
      </Button>
    </div>
  );
}