import { useState } from "react";
import { Card } from "flowbite-react";
import { IoAddCircleSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export const MenuCards = (props) => {
  const { menu, handleClickAddNew } = props;
  const navigate = useNavigate();

  const deleteDish = async (e, dishname) => {
    try {
      const res = await fetch(`/api/menu/delete/${dishname}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      await res.json();
      if (res.ok) {
        navigate(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map((dish, index) => (
          <DishCard key={index} dish={dish} deleteDish={deleteDish} />
        ))}

        {/* Add another dish button */}
        <Card
          className="max-w-xs cursor-pointer hover:shadow-2xl transition-shadow duration-300 hover:scale-105 bg-gradient-to-r from-teal-300 to-teal-500 dark:from-teal-600 dark:to-teal-800 text-white"
          onClick={handleClickAddNew}
        >
          <div className="p-4 flex flex-col items-center">
            <h5 className="text-xl font-semibold mb-2">Add Another Dish</h5>
            <IoAddCircleSharp className="text-4xl animate-bounce" />
          </div>
        </Card>
      </div>
    </>
  );
};

// Separate component for each DishCard
const DishCard = ({ dish, deleteDish }) => {
  const [isReadMore, setIsReadMore] = useState(false);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  return (
    <Card className="max-w-[300px] max-h-[400px] shadow-xl transition-transform transform hover:scale-105 rounded-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-2xl">
      <div className="h-48 w-48 overflow-hidden rounded-t-lg self-center">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>
      <div className="p-4">
        <h5 className="text-xl font-semibold text-gray-800 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200">
          {dish.name}
        </h5>

        {/* Shorten the description and add Read More */}
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
          {isReadMore
            ? dish.description
            : `${dish.description.substring(0, 100)}... `}
          <span
            className="text-teal-600 dark:text-teal-400 cursor-pointer"
            onClick={toggleReadMore}
          >
            {isReadMore ? "Read Less" : "Read More"}
          </span>
        </p>

        <p className="text-lg font-bold mt-2 text-indigo-600 dark:text-indigo-400">
          ₹{dish.price}
        </p>
      </div>
      <div
        className="text-red-600 dark:text-red-400 flex justify-end cursor-pointer p-2 transition-colors duration-200 hover:text-red-800 dark:hover:text-red-600"
        onClick={(e) => deleteDish(e, dish.name)}
      >
        <span className="font-semibold">Delete</span>
      </div>
    </Card>
  );
};
