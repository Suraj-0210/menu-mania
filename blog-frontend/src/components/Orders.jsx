import { useState, useEffect } from "react";
import { Spinner, Dropdown } from "flowbite-react"; // Import Dropdown from Flowbite
import OrderCard from "./orderCard";

const Orders = ({ restaurantid }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null); // Reset error state before fetching
    try {
      const res = await fetch(
        `https://endusermenumania.onrender.com/api/orders/restaurant/${restaurantid}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch orders. Please try again later.");
      }

      const data = await res.json();

      // Check if data is empty or null
      if (!data || !Array.isArray(data)) {
        setOrders([]); // Set orders to an empty array
        return; // Exit early
      }

      // Sort orders with "Delivered" status and specific PaymentId at the bottom
      const sortedOrders = data.sort((a, b) => {
        if (a.Status === "Delivered" && a.PaymentId.startsWith("pay_"))
          return 1;
        if (b.Status === "Delivered" && b.PaymentId.startsWith("pay_"))
          return -1;
        if (a.Status === "Delivered") return 1; // Delivered goes last
        if (b.Status === "Delivered") return -1; // Delivered goes last
        return 0; // Keep other statuses in order
      });

      setOrders(sortedOrders);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(
        `https://endusermenumania.onrender.com/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update order status. Please try again.");
      }

      await res.json();

      // Update the order status in the frontend and re-sort orders
      setOrders((prevOrders) =>
        prevOrders
          .map((order) =>
            order.OrderId === orderId ? { ...order, Status: newStatus } : order
          )
          .sort((a, b) => {
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

  const handleStatusChange = (orderId, newStatus) => {
    setSelectedOrderStatus((prevState) => ({
      ...prevState,
      [orderId]: newStatus,
    }));
    updateOrderStatus(orderId, newStatus); // Trigger API call
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

  // Separate orders for rendering
  const deliveredOrders = orders.filter(
    (order) => order.Status === "Delivered"
  );
  const nonDeliveredOrders = orders.filter(
    (order) => order.Status !== "Delivered"
  );

  return (
    <div className="max-w-full mx-auto p-4 sm:p-6 lg:p-8">
      {nonDeliveredOrders.length ? (
        <div className="space-y-6">
          {nonDeliveredOrders.map((order) => (
            <OrderCard
              key={order.OrderId}
              order={order}
              handleStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-300 text-center mt-10">
          No orders yet. Sit back let the customers in.
        </p>
      )}

      {/* Horizontal Line */}
      {deliveredOrders.length > 0 && (
        <div className="my-4">
          <hr className="border-gray-300" />
        </div>
      )}

      {/* Delivered Orders Sections */}

      {/* Delivered Orders (Pay After Service) Section */}
      {deliveredOrders.filter(
        (order) => order.PaymentId === "Pay_After_Service"
      ).length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Delivered Orders (Pay After Service)
          </h2>
          <div className="space-y-6">
            {deliveredOrders
              .filter((order) => order.PaymentId === "Pay_After_Service")
              .map((order) => (
                <OrderCard
                  key={order.OrderId}
                  order={order}
                  handleStatusChange={handleStatusChange}
                />
              ))}
          </div>
        </div>
      )}

      {/* Delivered Orders (Paid Online) Section */}
      {deliveredOrders.filter((order) => order.PaymentId.startsWith("pay_"))
        .length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Delivered Orders (Paid Online)
          </h2>
          <div className="space-y-6">
            {deliveredOrders
              .filter((order) => order.PaymentId.startsWith("pay_"))
              .map((order) => (
                <OrderCard
                  key={order.OrderId}
                  order={order}
                  handleStatusChange={handleStatusChange}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
