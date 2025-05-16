import { useState } from "react";
import { Dropdown } from "flowbite-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderCard = ({ order, handleStatusChange }) => {
  const [showRejectionReason, setShowRejectionReason] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const predefinedReasons = [
    "Insufficient stock available, please choose another dish",
    "Kitchen is closed",
  ];

  const onReject = () => {
    setShowRejectionReason(true);
  };

  const onConfirmRejection = () => {
    const reason =
      selectedReason === "custom" ? customReason.trim() : selectedReason;
    if (reason) {
      handleStatusChange(order.OrderId, "Rejected", reason);
      setShowRejectionReason(false);
      setSelectedReason("");
      setCustomReason("");
    } else {
      // alert("Please provide a reason for rejection.");
      toast.error("Please provide a reason for rejection.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
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
                : order.Status === "Rejected"
                ? "bg-gray-300 text-gray-800"
                : "bg-green-200 text-green-800"
            }`}
          >
            {order.Status}
          </span>
        </div>

        {order.Status !== "Delivered" && order.Status !== "Rejected" && (
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
            <Dropdown.Item onClick={onReject}>Rejected</Dropdown.Item>
          </Dropdown>
        )}
      </div>

      {/* Rejection Reason Section */}
      {showRejectionReason && (
        <div className="mt-4 relative p-4 bg-red-50 dark:bg-red-900 rounded-md border border-red-300 dark:border-red-700">
          <button
            onClick={() => {
              setShowRejectionReason(false);
              setSelectedReason("");
              setCustomReason("");
            }}
            className="absolute top-2 right-2 text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-white text-xl font-bold focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>

          <label className="text-sm font-medium text-red-800 dark:text-red-200 block mb-2">
            Select Rejection Reason
          </label>
          <select
            className="w-full mb-2 p-2 rounded border dark:bg-gray-700"
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
          >
            <option value="">-- Select Reason --</option>
            {predefinedReasons.map((reason, idx) => (
              <option key={idx} value={reason}>
                {reason}
              </option>
            ))}
            <option value="custom">Other (write custom reason)</option>
          </select>

          {selectedReason === "custom" && (
            <input
              type="text"
              className="w-full p-2 rounded border dark:bg-gray-700 mb-2"
              placeholder="Enter custom reason..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
            />
          )}

          <button
            onClick={onConfirmRejection}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Confirm Rejection
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
