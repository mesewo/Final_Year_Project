<<<<<<< HEAD
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <Card className="p-10">
      <CardHeader className="p-0">
        <CardTitle className="text-4xl">Payment is successfull!</CardTitle>
      </CardHeader>
      <Button className="mt-5" onClick={() => navigate("/shop/account")}>
        View Orders
      </Button>
    </Card>
  );
}

export default PaymentSuccessPage;
=======
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import QRCode from "react-qr-code";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verifying payment...");
  const [error, setError] = useState(null);
  const [paymentRef, setPaymentRef] = useState(null);

  useEffect(() => {
    const tx_ref = searchParams.get("tx_ref");
    const orderId = searchParams.get("orderId");

    if (!tx_ref || !orderId) {
      setError("Missing transaction reference or order ID.");
      setStatus(null);
      return;
    }

    fetch("http://localhost:5000/api/payment-verify/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference: tx_ref, orderId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setStatus(null);
        } else {
          setStatus(null);
          setPaymentRef(tx_ref);
        }
      })
      .catch(() => {
        setError("Failed to verify payment.");
        setStatus(null);
      });
  }, [searchParams]);

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
    </div>
  );
}
>>>>>>> 6d70975 (integrate Chapa payment gateway)
