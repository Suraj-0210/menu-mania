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
  const restaurantId = localStorage.getItem("restaurantId");

  useEffect(() => {
    if (!restaurantId) {
      console.error("Restaurant ID not found.");
      return;
    }
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `https://endusermenumania.onrender.com/api/orders/restaurant/metrices/${restaurantId}`
        );
        const data = await res.json();
        setOrders(data);
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

    if (!weekdayMap[day]) weekdayMap[day] = 0;
    if (!mostOrderedPerDay[day]) mostOrderedPerDay[day] = {};

    order.Items.forEach((item) => {
      itemMap[item.Name] = (itemMap[item.Name] || 0) + item.Quantity;
      weekdayMap[day] += item.Quantity;
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

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#111", // Default (light mode)
        },
      },
      title: {
        color: "#111", // Default (light mode)
        font: { size: 16 },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#111",
        },
        grid: {
          color: "#e5e7eb",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: "#111",
        },
        grid: {
          color: "#e5e7eb",
        },
      },
    },
  };

  const barOptions = { ...commonOptions };

  const darkify = (options) => {
    const updated = JSON.parse(JSON.stringify(options));
    updated.plugins.legend.labels.color = "#f9fafb";
    updated.plugins.title.color = "#f9fafb";
    updated.scales.x.ticks.color = "#f9fafb";
    updated.scales.x.grid.color = "#374151";
    updated.scales.y.ticks.color = "#f9fafb";
    updated.scales.y.grid.color = "#374151";
    return updated;
  };

  const isDark = document.documentElement.classList.contains("dark");

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
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      legend: {
        position: "right",
        labels: {
          color: isDark ? "#f9fafb" : "#111",
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 flex flex-wrap gap-6 justify-center">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 w-full max-w-md h-96">
        <h2 className="text-lg font-semibold text-center text-gray-900 dark:text-white mb-2">
          Ordered Items (Pie)
        </h2>
        <div className="h-80">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 w-full max-w-md h-96">
        <h2 className="text-lg font-semibold text-center text-gray-900 dark:text-white mb-2">
          Item Quantities (Bar)
        </h2>
        <div className="h-80">
          <Bar
            data={barData}
            options={isDark ? darkify(barOptions) : barOptions}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 w-full max-w-md h-96">
        <h2 className="text-lg font-semibold text-center text-gray-900 dark:text-white mb-2">
          Most Ordered Item Per Day
        </h2>
        <div className="h-80">
          <Bar
            data={topItemsPerDayData}
            options={isDark ? darkify(barOptions) : barOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default PieChartDemo;
