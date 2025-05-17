import { useState, useEffect } from "react";
import { Spinner } from "flowbite-react";
import OrderCard from "./orderCard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const tabOptions = [
  { label: "Active Orders", key: "active" },
  { label: "Delivered - Pay After Service", key: "deliveredPayAfter" },
  { label: "Delivered - Paid Online", key: "deliveredPaidOnline" },
  { label: "Rejected Orders", key: "rejected" },
];

const Orders = ({ restaurantid }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    const eventSource = new EventSource(
      `https://endusermenumania.onrender.com/api/orders/restaurant/${restaurantid}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (!data) {
        setOrders([]);
        return;
      }

      const sortedOrders = data.sort((a, b) => {
        if (a.Status === "Rejected") return 1;
        if (b.Status === "Rejected") return -1;
        if (a.Status === "Delivered" && a.PaymentId.startsWith("pay_"))
          return 1;
        if (b.Status === "Delivered" && b.PaymentId.startsWith("pay_"))
          return -1;
        if (a.Status === "Delivered") return 1;
        if (b.Status === "Delivered") return -1;
        return 0;
      });

      setOrders(sortedOrders);
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection failed:", error);
      eventSource.close();
      setError("Failed to connect to live updates. Please try again later.");
    };

    return () => eventSource.close();
  }, [restaurantid]);

  const updateOrderStatus = async (orderId, newStatus, reason) => {
    try {
      const res = await fetch(
        `https://endusermenumania.onrender.com/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus, rejectReason: reason }),
        }
      );

      if (!res.ok) throw new Error("Failed to update order status.");
      toast.success("Updated The Status!", {
        position: "top-right",
        autoClose: 2000,
      });
      await res.json();

      setOrders((prevOrders) =>
        prevOrders
          .map((order) =>
            order.OrderId === orderId ? { ...order, Status: newStatus } : order
          )
          .sort((a, b) => {
            if (a.Status === "Rejected") return 1;
            if (b.Status === "Rejected") return -1;
            if (a.Status === "Delivered" && a.PaymentId.startsWith("pay_"))
              return 1;
            if (b.Status === "Delivered" && b.PaymentId.startsWith("pay_"))
              return -1;
            if (a.Status === "Delivered") return 1;
            if (b.Status === "Delivered") return -1;
            return 0;
          })
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleStatusChange = (orderId, newStatus, reason) => {
    const currentOrder = orders.find((order) => order.OrderId === orderId);
    if (currentOrder?.Status === "Delivered") {
      toast.error("Delivered orders cannot be changed.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    updateOrderStatus(orderId, newStatus, reason);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" className="text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center">{error}</div>;
  }

  const filteredOrders = {
    active: orders.filter(
      (order) => order.Status !== "Delivered" && order.Status !== "Rejected"
    ),
    deliveredPayAfter: orders.filter(
      (order) =>
        order.Status === "Delivered" && order.PaymentId === "Pay_After_Service"
    ),
    deliveredPaidOnline: orders.filter(
      (order) =>
        order.Status === "Delivered" && order.PaymentId.startsWith("pay_")
    ),
    rejected: orders.filter((order) => order.Status === "Rejected"),
  };

  return (
    <div className="max-w-full mx-auto p-4 sm:p-6 lg:p-8">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabOptions.map(({ label, key }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded-t-md font-medium ${
              activeTab === key
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Orders List for selected tab */}
      <div className="mt-4 max-h-[480px] overflow-y-auto space-y-4 pr-2">
        {filteredOrders[activeTab]?.length > 0 ? (
          filteredOrders[activeTab].map((order) => (
            <OrderCard
              key={order.OrderId}
              order={order}
              handleStatusChange={handleStatusChange}
            />
          ))
        ) : (
          <p className="text-gray-600 text-center mt-4">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
