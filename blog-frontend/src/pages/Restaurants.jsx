import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RestaurantMenus } from "./RestaurantMenus";
import AddRestaurant from "../components/AddRestaurant";

export default function Restaurants() {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true); // New loading state
  const [restaurants, setRestaurants] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [createRestaurantSuccess, setCreateRestaurantSuccess] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await fetch(
        `https://menu-mania.onrender.com/api/restaurant/all/${currentUser._id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      setRestaurants(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setErrorMessage("Failed to load restaurants. Please try again.");
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  return (
    <div className="min-h-screen mt-20">
      {loading ? ( // Show loading indicator while fetching
        <div className="flex flex-col justify-center items-center h-full">
          <div role="status" className="flex flex-col items-center">
            <svg
              aria-hidden="true"
              className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C91.5421 39.6781 89.083 38.2158 88.1811 35.8758C86.7997 32.2913 84.9175 28.9121 82.5849 25.841C79.3347 21.5619 75.2735 17.9648 70.6331 15.2552C68.2084 14.6182 65.7593 16.0805 64.8574 18.4205C63.9555 20.7605 65.4146 23.2176 67.8391 24.8553C70.2636 26.4931 73.3249 27.4213 76.4637 27.4213C79.6025 27.4213 82.6638 26.4931 85.0883 24.8553C87.5128 23.2176 88.9719 20.7605 88.07 18.4205C87.1681 16.0805 84.7191 14.6182 82.2944 15.2552C77.6642 17.9648 73.6031 21.5619 70.3539 25.841C68 .9121"
                fill="currentFill"
              />
            </svg>
            <p className="mt-4 text-lg text-gray-900 dark:text-gray-300">
              Loading, please wait...
            </p>
          </div>
          <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Your data is being fetched.
          </span>
          <span className="mt-4 inline-block text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg px-4 py-2 text-sm shadow-md hover:shadow-lg">
            MenuMania
          </span>
        </div>
      ) : restaurants.length ? (
        <RestaurantMenus restaurant={restaurants[0]} />
      ) : (
        <div className="flex flex-col justify-center items-center mx-auto max-w-4xl py-10 px-6 bg-white shadow-lg rounded-lg gap-8 md:flex-row md:items-center transition-transform transform hover:scale-105 dark:bg-gray-800 dark:shadow-md">
          {/* Left Section - Intro */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-gray-100">
              Welcome to <span className="text-indigo-500">MenuMania</span>
            </h1>
            <p className="text-gray-600 text-lg mt-2 dark:text-gray-300">
              Get started by adding your first restaurant and managing your menu
              easily!
            </p>
            <span className="inline-block mt-4 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg px-3 py-2 text-sm shadow-md hover:shadow-lg">
              MenuMania
            </span>
          </div>

          {/* Right Section - Add Restaurant Form */}
          <div className="flex-1 w-full md:max-w-lg">
            <AddRestaurant
              currentUser={currentUser}
              setCreateRestaurantSuccess={setCreateRestaurantSuccess}
              setErrorMessage={setErrorMessage}
              navigate={navigate}
              errorMessage={errorMessage}
              createRestaurantSuccess={createRestaurantSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}
