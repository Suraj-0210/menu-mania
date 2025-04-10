import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

const ScanCheckoutQR = () => {
  const [sessionId, setSessionId] = useState("");
  const [error, setError] = useState("");
  const [orderData, setOrderData] = useState(null);

  const handleScan = async (codes) => {
    const result = codes[0]?.rawValue;
    if (result && result !== sessionId) {
      setSessionId(result);
      try {
        const response = await fetch(
          `https://endusermenumania.onrender.com/api/checkout/${result}`
        );
        const data = await response.json();
        setOrderData(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch order data.");
      }
    }
  };

  const resetScanner = () => {
    setSessionId(null);
    setOrderData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-6 text-teal-400 drop-shadow">
        Scan Checkout QR Code
      </h1>

      {!orderData && (
        <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-teal-500 bg-gray-800 transition-all duration-300">
          <Scanner
            onScan={handleScan}
            onError={() => setError("Camera access error")}
            formats={["qr_code"]}
            className="w-full"
          />
        </div>
      )}

      {sessionId && (
        <div className="mt-6 w-full max-w-2xl bg-gray-800 border border-teal-500 rounded-2xl shadow-xl p-6 transition-all duration-300">
          <h2 className="text-2xl font-bold text-green-400 mb-4">
            Order Details
          </h2>

          {orderData ? (
            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-300">Session ID:</span>
                <span className="text-white">{sessionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-300">Order Date:</span>
                <span>{orderData.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-300">
                  Total Amount:
                </span>
                <span className="text-yellow-300">
                  ₹{orderData.totalAmount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-300">
                  Paid Online:
                </span>
                <span className="text-green-400">₹{orderData.paidOnline}</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-semibold text-gray-300">
                  Collect Cash:
                </span>
                <span className="text-red-400">
                  ₹{orderData.totalAmount - orderData.paidOnline}
                </span>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={resetScanner}
                  className="bg-teal-600 hover:bg-teal-700 transition-colors px-6 py-2 rounded-xl text-white font-semibold shadow-lg"
                >
                  Scan Another QR
                </button>
              </div>
            </div>
          ) : (
            <p className="text-yellow-400 text-center">
              Fetching order details...
            </p>
          )}
        </div>
      )}

      {error && <p className="mt-4 text-red-400">{error}</p>}
    </div>
  );
};

export default ScanCheckoutQR;
