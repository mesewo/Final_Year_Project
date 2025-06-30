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
    window.history.replaceState(
      {},
      "",
      "/shop/payment-static-success?from=chapa"
    );
  }, [searchParams, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-2 py-8 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="rounded-full bg-green-100 p-4 mb-2">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-400 mb-1">
            Payment Successful!
          </h1>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-200">
            Thank you for your purchase.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Info Box */}
          <div className="flex-1 bg-white dark:bg-gray-900 border border-blue-200 dark:border-gray-700 rounded-xl p-5 shadow-md">
            <h2 className="font-semibold text-lg mb-2 text-blue-900 dark:text-blue-200">
              What happens next?
            </h2>
            <div className="space-y-4">
              {/* Normal Order Info */}
              <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="mt-1">
                  <svg
                    className="w-6 h-6 text-blue-600 dark:text-blue-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7h18M3 12h18M3 17h18"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    For normal orders:
                  </div>
                  <div className="text-blue-900 dark:text-blue-100 text-sm sm:text-base">
                    Pick up your items from the store(s) you ordered from. View
                    your orders in{" "}
                    <span className="font-semibold">Account &gt; Orders</span>.
                    Show your <span className="font-semibold">Order ID</span> or{" "}
                    <span className="font-semibold">QR code</span> to the
                    seller.
                    <div className="mt-1 text-xs text-blue-700 dark:text-blue-300">
                      Products from the same store are grouped in one order if
                      ordered together. Click "See Detail" for more info.
                    </div>
                  </div>
                </div>
              </div>
              {/* Bulk Order Info */}
              <div className="flex items-start gap-3 bg-yellow-50 dark:bg-yellow-900/40 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                <div className="mt-1">
                  <svg
                    className="w-6 h-6 text-yellow-500 dark:text-yellow-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 9V7a5 5 0 00-10 0v2a5 5 0 00-2 4v5a2 2 0 002 2h10a2 2 0 002-2v-5a5 5 0 00-2-4z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                    For bulk orders:
                  </div>
                  <div className="text-yellow-900 dark:text-yellow-100 text-sm sm:text-base">
                    Contact us at{" "}
                    <a
                      href="tel:0941889430"
                      className="underline font-semibold"
                    >
                      0941889430
                    </a>{" "}
                    or{" "}
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=eyayutiger@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold"
                    >
                      eyayutiger@gmail.com
                    </a>{" "}
                    to check delivery options or arrange pickup at our Abay
                    Garment Factory in Azezo, Gondar, Ethiopia.
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Map */}
          <div className="flex-1 flex items-center justify-center">
            <div className="rounded-xl overflow-hidden shadow-md border border-blue-200 dark:border-gray-700 w-full h-56 sm:h-64 md:h-72">
              <iframe
                title="Abay Garment Factory Location"
                src="https://www.google.com/maps?q=12.5731,37.4662&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 220 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
        <Button
          className="mt-4 w-full md:w-auto px-8 py-3 text-base font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
          onClick={() => navigate("/")}
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
}
