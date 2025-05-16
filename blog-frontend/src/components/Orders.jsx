import { useState, useEffect } from "react";
import { Spinner } from "flowbite-react";
import OrderCard from "./orderCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Orders = ({ restaurantid }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState({});

  async function fetchOrders() {
    try {
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
        console.error("Error in SSE connection:", error);
        eventSource.close();
        setError("Failed to connect to live updates. Please try again later.");
      };

      return () => {
        eventSource.close();
      };
    } catch (error) {
      console.error("Error in fetchOrders:", error);
      setError("An error occurred while fetching orders. Please try again.");
    }
  }

  useEffect(() => {
    const cleanup = fetchOrders();
    return () => {
      if (typeof cleanup === "function") {
        cleanup();
      }
    };
  }, []);

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

    setSelectedOrderStatus((prevState) => ({
      ...prevState,
      [orderId]: newStatus,
    }));
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

  const deliveredOrders = orders.filter(
    (order) => order.Status === "Delivered"
  );
  const rejectedOrders = orders.filter((order) => order.Status === "Rejected");
  const nonDeliveredNonRejectedOrders = orders.filter(
    (order) => order.Status !== "Delivered" && order.Status !== "Rejected"
  );

  return (
    <div className="max-w-full mx-auto p-4 sm:p-6 lg:p-8">
      {/* Active Orders */}
      <Section
        title="Active Orders"
        orders={nonDeliveredNonRejectedOrders}
        handleStatusChange={handleStatusChange}
        emptyMsg="No active orders yet."
      />

      {/* Delivered Orders (Pay After Service) */}
      <Section
        title="Delivered Orders (Pay After Service)"
        orders={deliveredOrders.filter(
          (order) => order.PaymentId === "Pay_After_Service"
        )}
        handleStatusChange={handleStatusChange}
      />

      {/* Delivered Orders (Paid Online) */}
      <Section
        title="Delivered Orders (Paid Online)"
        orders={deliveredOrders.filter((order) =>
          order.PaymentId.startsWith("pay_")
        )}
        handleStatusChange={handleStatusChange}
      />

      {/* Rejected Orders */}
      <Section
        title="Rejected Orders"
        orders={rejectedOrders}
        handleStatusChange={handleStatusChange}
        isRejected
      />
    </div>
  );
};

const Section = ({
  title,
  orders,
  handleStatusChange,
  emptyMsg = null,
  isRejected = false,
}) => {
  if (!orders.length && !emptyMsg) return null;

  return (
    <div className="mt-6">
      <h2
        className={`text-lg font-semibold ${
          isRejected
            ? "text-red-700 dark:text-red-400"
            : "text-gray-900 dark:text-gray-100"
        }`}
      >
        {title}
      </h2>
      <div className="max-h-96 overflow-y-auto mt-4 space-y-4 pr-2">
        {orders.length ? (
          orders.map((order) => (
            <OrderCard
              key={order.OrderId}
              order={order}
              handleStatusChange={handleStatusChange}
            />
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-300 text-center">
            {emptyMsg}
          </p>
        )}
      </div>
    </div>
  );
};

export default Orders;
