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
    <div className="mt-20">
      {restaurants.length ? (
        <RestaurantMenus restaurant={restaurants[0]} />
      ) : (
        <div className="flex mx-auto max-w-3xl flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              MenuMania
            </span>
            <p className="text-sm mt-5">
              Take the next step and add your first restaurant today.
            </p>
          </div>
          <AddRestaurant
            currentUser={currentUser}
            setCreateRestaurantSuccess={setCreateRestaurantSuccess}
            setErrorMessage={setErrorMessage}
            navigate={navigate}
            errorMessage={errorMessage}
            createRestaurantSuccess={createRestaurantSuccess}
          />
        </div>
      )}
    </div>
  );
}
