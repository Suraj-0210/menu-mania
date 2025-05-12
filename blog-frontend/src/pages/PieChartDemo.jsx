import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const PieChartDemo = () => {
  const [orders, setOrders] = useState([]);
  // Retrieve restaurantId from localStorage
  const restaurantId = localStorage.getItem("restaurantId");

  useEffect(() => {
    if (!restaurantId) {
      setError(
        "Restaurant ID is not available. Please log in or set the restaurant."
      );
      return;
    }
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `https://endusermenumania.onrender.com/api/orders/restaurant/metrices/${restaurantId}`
        );
        const data = await res.json();
        setOrders(data); // Assuming the response is an array of orders
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, []);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const itemMap = {};
  const weekdayMap = {};
  const mostOrderedPerDay = {};

  orders.forEach((order) => {
    const dateObj = new Date(order.OrderDate);
    const day = days[dateObj.getDay()];

    // Track weekday totals
    if (!weekdayMap[day]) weekdayMap[day] = 0;

    // Track items by day
    if (!mostOrderedPerDay[day]) mostOrderedPerDay[day] = {};

    order.Items.forEach((item) => {
      // Total quantity per item
      itemMap[item.Name] = (itemMap[item.Name] || 0) + item.Quantity;

      // Total quantity per day
      weekdayMap[day] += item.Quantity;

      // Most ordered item per day
      mostOrderedPerDay[day][item.Name] =
        (mostOrderedPerDay[day][item.Name] || 0) + item.Quantity;
    });
  });

  const itemNames = Object.keys(itemMap);
  const quantities = Object.values(itemMap);
  const weekdays = Object.keys(weekdayMap);
  const weekdayQuantities = Object.values(weekdayMap);

  const mostPopularItemsByDay = [];
  const topQuantities = [];

  for (const [day, itemData] of Object.entries(mostOrderedPerDay)) {
    const [topItem, qty] = Object.entries(itemData).reduce((a, b) =>
      a[1] > b[1] ? a : b
    );
    mostPopularItemsByDay.push(day);
    topQuantities.push(qty);
  }

  const generateColors = (num) =>
    Array.from(
      { length: num },
      () => `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
    );

  const pieData = {
    labels: itemNames,
    datasets: [
      {
        data: quantities,
        backgroundColor: generateColors(itemNames.length),
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: itemNames,
    datasets: [
      {
        label: "Item Quantity",
        data: quantities,
        backgroundColor: "#3b82f6",
        borderRadius: 4,
      },
    ],
  };

  const weekdayData = {
    labels: weekdays,
    datasets: [
      {
        label: "Total Items Ordered",
        data: weekdayQuantities,
        backgroundColor: "#10b981",
        borderRadius: 4,
      },
    ],
  };

  const topItemsPerDayData = {
    labels: mostPopularItemsByDay,
    datasets: [
      {
        label: "Most Ordered Item Quantity",
        data: topQuantities,
        backgroundColor: "#f59e0b",
        borderRadius: 4,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "right" },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Item Popularity",
        font: { size: 16 },
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-wrap gap-6 justify-center">
      <div className="bg-white shadow-lg rounded-xl p-4 w-full max-w-md h-96">
        <h2 className="text-lg font-semibold text-center mb-2">
          Ordered Items (Pie)
        </h2>
        <div className="h-80">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-4 w-full max-w-md h-96">
        <h2 className="text-lg font-semibold text-center mb-2">
          Item Quantities (Bar)
        </h2>
        <div className="h-80">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-4 w-full max-w-md h-96">
        <h2 className="text-lg font-semibold text-center mb-2">
          Most Ordered Item Per Day
        </h2>
        <div className="h-80">
          <Bar data={topItemsPerDayData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default PieChartDemo;
