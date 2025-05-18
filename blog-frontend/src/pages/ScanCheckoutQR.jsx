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
      setError("");

      try {
        const response = await fetch(
          `https://endusermenumania.onrender.com/api/checkout/${result}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || "Unknown error occurred");
          setOrderData(null);
          return;
        }

        const data = await response.json();
        setOrderData(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch order data.");
        setOrderData(null);
      }
    }
  };

  const resetScanner = () => {
    setSessionId("");
    setOrderData(null);
    setError("");
  };

  const handleCompleteCheckout = async () => {
    if (!sessionId) return;

    try {
      const response = await fetch(
        "https://endusermenumania.onrender.com/api/session/expire-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Checkout completed and session expired! ✅");
        resetScanner();
      } else {
        alert(data.message || "Failed to expire session.");
      }
    } catch (err) {
      console.error("Error completing checkout:", err);
      alert("Something went wrong while expiring the session.");
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 flex flex-col items-center bg-white text-gray-900 dark:bg-gray-950 dark:text-white transition-colors duration-300">
      <h1 className="text-4xl font-extrabold text-teal-600 dark:text-teal-400 mb-8 drop-shadow-md">
        Scan Checkout QR Code
      </h1>

      {/* SCANNER */}
      {!orderData && !error && (
        <div className="w-full max-w-md bg-gray-100 dark:bg-gray-800 border border-teal-500 rounded-2xl p-4 shadow-lg">
          <Scanner
            onScan={handleScan}
            onError={() => setError("Camera access error")}
            formats={["qr_code"]}
            className="w-full"
          />
        </div>
      )}

      {/* ERROR STATE */}
      {!orderData && error && (
        <div className="mt-10 w-full max-w-md p-6 bg-red-50 dark:bg-gray-800 border border-red-500 rounded-2xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-3">⚠️ Oops!</h2>
          <p className="text-lg text-gray-800 dark:text-gray-300 font-medium mb-2">
            {error}
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleCompleteCheckout}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-xl font-semibold text-white shadow transition duration-200"
            >
              ✅ Free the Table
            </button>
            <button
              onClick={resetScanner}
              className="mt-4 bg-teal-600 hover:bg-teal-700 px-5 py-2 rounded-xl font-semibold text-white shadow transition duration-200"
            >
              🔄 Scan Another QR
            </button>
          </div>
        </div>
      )}

      {/* ORDER DETAILS */}
      {orderData && (
        <div className="w-full max-w-5xl bg-gray-100 dark:bg-gray-900 rounded-2xl border border-teal-500 shadow-xl p-6 transition-all duration-300">
          <div className="mb-6">
            <p className="text-teal-700 dark:text-teal-300 text-lg font-medium">
              📢 {orderData.message}
            </p>
            <h2 className="text-2xl font-bold mt-2">
              🪑 Table No. {orderData.tableNo}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Session ID: {orderData.sessionId}
            </p>
          </div>

          <div className="space-y-6">
            {orderData.orders.map((order, idx) => (
              <div
                key={order.OrderId}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-300 dark:border-gray-700 shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold">🧾 Order #{idx + 1}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(order.orderDateTime).toLocaleString()}
                  </span>
                </div>
                <ul className="space-y-1 text-sm">
                  {order.Items.map((item, i) => (
                    <li
                      key={i}
                      className="flex justify-between border-b border-gray-200 dark:border-gray-700 py-1"
                    >
                      <span>
                        {item.Name} x {item.Quantity}
                      </span>
                      <span>₹{item.Total}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 text-sm flex justify-between">
                  <span>Payment Method:</span>
                  <span
                    className={
                      order.PaymentId === "Pay_After_Service"
                        ? "text-red-500 font-semibold"
                        : "text-green-500 font-semibold"
                    }
                  >
                    {order.PaymentId === "Pay_After_Service"
                      ? "Offline"
                      : "Online"}
                  </span>
                </div>
                <div className="mt-2 text-sm flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Payment ID:</span>
                  <span className="text-yellow-500">{order.PaymentId}</span>
                </div>
                <div className="text-sm flex justify-between">
                  <span>Status:</span>
                  <span
                    className={
                      order.Status === "Rejected"
                        ? "text-red-500"
                        : "text-green-500"
                    }
                  >
                    {order.Status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* BILLING SUMMARY */}
          <div className="mt-8 bg-gray-100 dark:bg-gray-800 rounded-xl p-6 border border-teal-600 shadow space-y-3 text-base sm:text-lg">
            <div className="flex justify-between font-semibold">
              <span>🧮 Total Billed (Accepted Orders):</span>
              <div className="text-right">
                <span className="text-yellow-500">
                  ₹{orderData.totalAmount - orderData.refundAmount}
                </span>
                {orderData.refundAmount > 0 && (
                  <small className="block text-xs text-gray-500 dark:text-gray-400">
                    (₹{orderData.totalAmount} - ₹{orderData.refundAmount}{" "}
                    refund)
                  </small>
                )}
              </div>
            </div>
            <div className="flex justify-between font-semibold">
              <span>💳 Paid Online (Accepted Orders):</span>
              <span className="text-green-500">₹{orderData.paidOnline}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>💵 Remaining (To Collect in Cash):</span>
              <span className="text-red-500">
                ₹
                {Math.max(
                  orderData.remainingAmount - orderData.refundAmount,
                  0
                )}
              </span>
            </div>

            {orderData.totalAmount - orderData.refundAmount < 0 && (
              <div className="flex justify-between font-semibold text-yellow-500 bg-yellow-100 dark:bg-yellow-800 p-2 rounded">
                <span>🔁 Refund Due:</span>
                <span>₹{orderData.refundAmount - orderData.totalAmount}</span>
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-6 flex gap-4 justify-center">
            <button
              onClick={handleCompleteCheckout}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-xl font-semibold text-white shadow transition"
            >
              ✅ Complete Checkout
            </button>
            <button
              onClick={resetScanner}
              className="bg-teal-600 hover:bg-teal-700 px-6 py-2 rounded-xl font-semibold text-white shadow transition"
            >
              🔄 Scan Another QR
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanCheckoutQR;
