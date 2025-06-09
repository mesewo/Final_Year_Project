import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PaymentStaticSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Restrict access
    if (searchParams.get("from") !== "chapa") {
      navigate("/", { replace: true });
    }
    // Replace history so back goes home
    window.history.replaceState({}, "", "/shop/payment-static-success?from=chapa");
  }, [searchParams, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-4 text-green-700">Congratulations!</h1>
      <p className="mb-4 text-lg text-gray-700">
        Your payment was successful.<br />
        Thank you for your purchase!
      </p>
      <Button className="mt-6" onClick={() => navigate("/")}>
        Go to Home
      </Button>
    </div>
  );
}