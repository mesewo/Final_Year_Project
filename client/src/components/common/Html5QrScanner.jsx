import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function Html5QrScanner({ onScanOrderId, onClose }) {
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const isRunningRef = useRef(false);
  const hasScannedRef = useRef(false);
  const [scanBoxSize, setScanBoxSize] = useState(256);

  // Responsive scan box size
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 350) setScanBoxSize(160);
      else if (window.innerWidth < 400) setScanBoxSize(200);
      else if (window.innerWidth < 600) setScanBoxSize(240);
      else setScanBoxSize(256);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const qrRegionId = "qr-reader";
    html5QrCodeRef.current = new Html5Qrcode(qrRegionId);

    hasScannedRef.current = false;

    html5QrCodeRef.current
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: scanBoxSize - 6, height: scanBoxSize - 6 },
        },
        (decodedText) => {
          if (!hasScannedRef.current) {
            let orderId = null;
            try {
              const url = new URL(decodedText);
              orderId = url.searchParams.get("orderId");
            } catch {
              if (decodedText.length === 24) orderId = decodedText;
            }
            if (orderId) {
              hasScannedRef.current = true;
              setTimeout(() => {
                if (isRunningRef.current && html5QrCodeRef.current) {
                  html5QrCodeRef.current
                    .stop()
                    .then(() => {
                      html5QrCodeRef.current.clear();
                      isRunningRef.current = false;
                      onScanOrderId(orderId);
                    })
                    .catch(() => {});
                }
              }, 400);
            }
          }
        },
        () => {}
      )
      .then(() => {
        isRunningRef.current = true;
      });

    return () => {
      if (html5QrCodeRef.current && isRunningRef.current) {
        html5QrCodeRef.current
          .stop()
          .then(() => {
            html5QrCodeRef.current.clear();
            isRunningRef.current = false;
          })
          .catch(() => {});
      } else if (html5QrCodeRef.current) {
        html5QrCodeRef.current.clear();
      }
    };
    // eslint-disable-next-line
  }, [onScanOrderId, scanBoxSize]);

  // Optional: Flashlight toggle for supported devices
  // See https://github.com/mebjas/html5-qrcode/issues/273 for implementation ideas

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[320px] sm:min-h-[400px]">
      {/* Scanner area */}
      <div
        className="relative"
        style={{
          width: scanBoxSize,
          height: scanBoxSize,
          maxWidth: "95vw",
          maxHeight: "65vw",
        }}
      >
        <div
          id="qr-reader"
          ref={scannerRef}
          className="rounded-lg overflow-hidden"
          style={{
            width: scanBoxSize,
            height: scanBoxSize,
            maxWidth: "95vw",
            maxHeight: "65vw",
          }}
        ></div>
        {/* Xender-style animated scan box overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div
            className="border-4 border-blue-500 rounded-xl shadow-lg relative"
            style={{
              width: scanBoxSize - 8,
              height: scanBoxSize - 8,
            }}
          >
            {/* Animated scan line */}
            <div className="absolute left-0 right-0 h-1 bg-blue-400/80 animate-xender-scanline rounded-full" />
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-xl"></div>
          </div>
        </div>
        {/* Instructions */}
        <div className="absolute bottom-[-2.5rem] left-1/2 -translate-x-1/2 text-blue-700 text-sm font-medium bg-white/80 px-3 py-1 rounded shadow z-10 whitespace-nowrap">
          Align the QR code within the box
        </div>
      </div>
      {/* Close button */}
      <button
        className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition text-base sm:text-lg"
        onClick={onClose}
        style={{ minWidth: 140, fontSize: "1.1rem" }}
      >
        Close Scanner
      </button>
      {/* Animations */}
      <style>
        {`
          @keyframes xender-scanline {
            0% { top: 0; opacity: 0.7; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 95%; opacity: 0.7; }
          }
          .animate-xender-scanline {
            animation: xender-scanline 2s linear infinite;
          }
          @media (max-width: 600px) {
            .rounded-xl { border-radius: 0.75rem !important; }
            .w-6, .h-6 { width: 1.1rem !important; height: 1.1rem !important; }
          }
        `}
      </style>
    </div>
  );
}