import React, { useEffect, useState } from "react";

const TableStatusPage = () => {
  const [tables, setTables] = useState([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  // Retrieve restaurantId from localStorage
  const restaurantId = localStorage.getItem("restaurantId");

  useEffect(() => {
    if (!restaurantId) {
      setError(
        "Restaurant ID is not available. Please log in or set the restaurant."
      );
      return;
    }

    const eventSource = new EventSource(
      `https://endusermenumania.onrender.com/api/session/stream-table-status/${restaurantId}`
    );

    eventSource.onopen = () => {
      console.log("✅ SSE connection opened");
      setConnected(true);
    };

    eventSource.onerror = (err) => {
      console.error("❌ SSE error:", err);
      setConnected(false);
      eventSource.close();
    };

    eventSource.addEventListener("tableStatus", (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📡 tableStatus event received:", data);

        const bookedMap = {};
        data.bookedTables.forEach(({ tableNo, bookedAt }) => {
          bookedMap[tableNo] = bookedAt;
        });

        const allTables = [];
        for (let i = 1; i <= data.totalTables; i++) {
          allTables.push({
            tableNo: i,
            isBooked: bookedMap.hasOwnProperty(i),
            bookedAt: bookedMap[i] || null,
          });
        }

        setTables(allTables);
      } catch (err) {
        console.error("❌ Failed to parse SSE data", err);
      }
    });

    return () => {
      eventSource.close();
      console.log("🔒 SSE connection closed");
    };
  }, [restaurantId]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 flex justify-center items-center">
        <div className="bg-red-600 text-center p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-white">Error</h1>
          <p className="mt-2 text-lg text-white">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold tracking-wide">
            📋 Table Details
          </h1>
          <div
            className={`px-4 py-2 text-sm rounded-full font-medium shadow ${
              connected ? "bg-green-600" : "bg-red-500"
            }`}
          >
            {connected ? "Live Connected" : "Disconnected"}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {tables.map((table) => (
            <div
              key={table.tableNo}
              className={`rounded-xl p-4 shadow-xl border-2 backdrop-blur-sm ${
                table.isBooked
                  ? "bg-red-600/80 border-red-400"
                  : "bg-green-700/70 border-green-400"
              }`}
            >
              <h2 className="text-xl font-bold">Table #{table.tableNo}</h2>
              <p className="mt-1 text-sm">
                {table.isBooked ? (
                  <>
                    <span className="block font-semibold">Booked</span>
                    <span className="text-xs text-gray-100">
                      At: {new Date(table.bookedAt).toLocaleTimeString()}
                    </span>
                  </>
                ) : (
                  <span className="text-green-100 font-medium">Available</span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableStatusPage;
