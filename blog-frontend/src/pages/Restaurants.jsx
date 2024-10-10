import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RestaurantMenus } from "./RestaurantMenus";
import AddRestaurant from "../components/AddRestaurant";

export default function Restaurants() {
  const { currentUser } = useSelector((state) => state.user);
  const [restaurants, setRestaurants] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [createRestaurantSuccess, setCreateRestaurantSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await fetch(`/api/restaurant/all/${currentUser._id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      setRestaurants(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  return (
    <div className="h-screen mt-20">
      {restaurants.length ? (
        <RestaurantMenus restaurant={restaurants[0]} />
      ) : (
        <div className="flex flex-col justify-center items-center mx-auto max-w-4xl py-10 px-6 bg-white shadow-lg rounded-lg md:flex-row gap-8 md:items-center transition-transform transform hover:scale-105 dark:bg-gray-800 dark:shadow-md">
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
          <div className="flex-1 max-w-lg">
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

      {/* Success and Error Message Display */}
      {createRestaurantSuccess && (
        <div className="mt-5 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative dark:bg-green-900 dark:border-green-700 dark:text-green-300">
          {createRestaurantSuccess}
        </div>
      )}

      {errorMessage && (
        <div className="mt-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900 dark:border-red-700 dark:text-red-300">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
