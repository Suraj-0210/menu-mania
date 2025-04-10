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

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-6 text-teal-400">
        Scan Checkout QR Code
      </h1>

      <div className="w-full max-w-md rounded-xl overflow-hidden shadow-2xl border border-teal-500 bg-gray-800">
        <Scanner
          onScan={handleScan}
          onError={(e) => setError("Camera access error")}
          formats={["qr_code"]}
          className="w-full"
        />
      </div>

      {sessionId && (
        <div className="mt-6 p-4 bg-gray-700 border border-teal-400 rounded-lg shadow-md w-full max-w-md text-sm">
          <p>
            <strong>Session ID:</strong> {sessionId}
          </p>
          {orderData ? (
            <div className="mt-4">
              <p className="text-green-400 font-semibold">
                Order Fetched Successfully
              </p>
              <pre className="mt-2 bg-gray-800 p-2 rounded">
                {JSON.stringify(orderData, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-yellow-400">Fetching order details...</p>
          )}
        </div>
      )}

      {error && <p className="mt-4 text-red-400">{error}</p>}
    </div>
  );
};

export default ScanCheckoutQR;
