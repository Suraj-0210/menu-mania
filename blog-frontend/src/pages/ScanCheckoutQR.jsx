import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

const ScanCheckoutQR = () => {
  const [sessionId, setSessionId] = useState("");
  const [error, setError] = useState("");
  const [orderData, setOrderData] = useState(null);

  const handleScan = async (codes) => {
    const result = codes[0]?.rawValue;
    if (result && result !== sessionId) {
      result = "c95b7faf-dbc0-4473-b78c-8b56899e3ec7";
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
    <div className="min-h-screen bg-gray-950 text-white px-4 py-10 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-teal-400 mb-8 drop-shadow-lg">
        Scan Checkout QR Code
      </h1>

      {!orderData && (
        <div className="w-full max-w-md bg-gray-800 border border-teal-500 rounded-2xl p-4 shadow-2xl">
          <Scanner
            onScan={handleScan}
            onError={() => setError("Camera access error")}
            formats={["qr_code"]}
            className="w-full"
          />
        </div>
      )}

      {orderData && (
        <div className="w-full max-w-5xl bg-gray-900 rounded-2xl border border-teal-500 shadow-2xl p-6">
          <div className="mb-6">
            <p className="text-teal-300 text-lg font-medium">
              📢 {orderData.message}
            </p>
            <h2 className="text-2xl font-bold mt-2">
              🪑 Table No. {orderData.tableNo}
            </h2>
            <p className="text-sm text-gray-400">
              Session ID: {orderData.sessionId}
            </p>
          </div>

          <div className="space-y-6">
            {orderData.orders.map((order, idx) => (
              <div
                key={order.OrderId}
                className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-inner"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold text-white">
                    🧾 Order #{idx + 1}
                  </h3>
                  <span className="text-sm text-gray-400">
                    {new Date(order.orderDateTime).toLocaleString()}
                  </span>
                </div>
                <ul className="space-y-1 text-sm">
                  {order.Items.map((item, i) => (
                    <li
                      key={i}
                      className="flex justify-between border-b border-gray-700 py-1"
                    >
                      <span>
                        {item.Name} x {item.Quantity}
                      </span>
                      <span>₹{item.Total}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 text-sm flex justify-between text-gray-300">
                  <span>Payment Method:</span>
                  <span className="text-yellow-400">{order.PaymentId}</span>
                </div>
                <div className="text-sm flex justify-between text-gray-300">
                  <span>Status:</span>
                  <span className="text-green-400">{order.Status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-gray-800 rounded-xl p-5 border border-gray-700 shadow-lg text-lg space-y-2">
            <div className="flex justify-between font-semibold text-gray-300">
              <span>Total Amount:</span>
              <span className="text-yellow-300">₹{orderData.totalAmount}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-300">
              <span>Paid Online:</span>
              <span className="text-green-400">₹{orderData.paidOnline}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-300 border-t border-gray-700 pt-2">
              <span>To Collect in Cash:</span>
              <span className="text-red-400">₹{orderData.remainingAmount}</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={reset}
              className="bg-teal-600 hover:bg-teal-700 px-6 py-2 rounded-xl font-semibold shadow-md transition duration-200"
            >
              🔄 Scan Another QR
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-red-400">{error}</p>}
    </div>
  );
};

export default ScanCheckoutQR;
