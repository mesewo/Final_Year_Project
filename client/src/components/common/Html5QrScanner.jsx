import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function Html5QrScanner({ onScanOrderId, onClose }) {
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const isRunningRef = useRef(false);
  const hasScannedRef = useRef(false);

  useEffect(() => {
    const qrRegionId = "qr-reader";
    html5QrCodeRef.current = new Html5Qrcode(qrRegionId);

    hasScannedRef.current = false;

    html5QrCodeRef.current.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
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
            // Add a short delay to allow UI to update and avoid race conditions
            setTimeout(() => {
              if (isRunningRef.current && html5QrCodeRef.current) {
                html5QrCodeRef.current.stop().then(() => {
                  html5QrCodeRef.current.clear();
                  isRunningRef.current = false;
                  onScanOrderId(orderId);
                }).catch(() => {});
              }
            }, 400); // 400ms delay, adjust as needed
          }
        }
      },
      (errorMessage) => {
        // Ignore scan errors
      }
    ).then(() => {
      isRunningRef.current = true;
    });

    return () => {
      // Only stop if running
      if (html5QrCodeRef.current && isRunningRef.current) {
        html5QrCodeRef.current.stop().then(() => {
          html5QrCodeRef.current.clear();
          isRunningRef.current = false;
        }).catch(() => {});
      } else if (html5QrCodeRef.current) {
        html5QrCodeRef.current.clear();
      }
    };
  }, [onScanOrderId]);

  return (
    <div className="flex flex-col items-center">
      <div id="qr-reader" style={{ width: 300, height: 300 }} ref={scannerRef}></div>
      <button className="mt-4 px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
        Close Scanner
      </button>
    </div>
  );
}