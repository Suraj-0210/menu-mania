import { Dropdown } from "flowbite-react";

const OrderCard = ({ order, handleStatusChange }) => (
  <div className="p-4 bg-white shadow rounded-lg dark:bg-gray-800 hover:shadow-md transition">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Order #{order.OrderId} - Table {order.TableNo}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 sm:mt-0">
        Payment ID: {order.PaymentId}
      </div>
    </div>

    <ul className="mt-2 space-y-1 text-gray-700 dark:text-gray-300">
      {order.Items.map((item, idx) => (
        <li key={idx} className="text-sm">
          <span className="font-medium">{item.Name}</span> - {item.Quantity}
        </li>
      ))}
    </ul>

    {/* Message Section */}
    {order.Message && order.Message.trim() !== "" && (
      <div className="mt-4 p-3 bg-indigo-50 border-l-4 border-indigo-600 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-100 dark:border-indigo-400 rounded-md shadow-sm">
        <div className="text-sm font-medium">Customer Note:</div>
        <div className="text-sm italic mt-1">"{order.Message}"</div>
      </div>
    )}

    <div className="flex flex-col sm:flex-row justify-between items-start mt-4">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Status:{" "}
        <span
          className={`px-2 py-1 rounded-full ${
            order.Status === "Pending"
              ? "bg-yellow-200 text-yellow-800"
              : order.Status === "Confirmed"
              ? "bg-yellow-200 text-yellow-800"
              : order.Status === "Preparing"
              ? "bg-blue-200 text-blue-800"
              : order.Status === "Completed"
              ? "bg-red-200 text-red-800"
              : "bg-green-200 text-green-800"
          }`}
        >
          {order.Status}
        </span>
      </div>

      <Dropdown
        label="Change Status"
        color="indigo"
        arrowIcon={true}
        inline={true}
        className="rounded-lg mt-2 sm:mt-0"
      >
        <Dropdown.Item
          onClick={() => handleStatusChange(order.OrderId, "Confirmed")}
        >
          Confirmed
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => handleStatusChange(order.OrderId, "Preparing")}
        >
          Preparing
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => handleStatusChange(order.OrderId, "Delivered")}
        >
          Delivered
        </Dropdown.Item>
      </Dropdown>
    </div>
  </div>
);

export default OrderCard;
