import { useEffect, useState } from "react";
import { Card } from "flowbite-react";
import { IoAddCircleSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const MenuCards = (props) => {
  const { handleClickAddNew, restaurant } = props;
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const res = await fetch(
        `https://menu-mania.onrender.com/api/menu/${restaurant._id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      setMenu(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  const deleteDish = async (e, dishId) => {
    try {
      // First, delete orders associated with this menu item (dish)
      const orderRes = await fetch(
        `https://endusermenumania.onrender.com/api/orders/menu/${dishId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      // Now delete the dish itself
      const res = await fetch(
        `https://menu-mania.onrender.com/api/menu/delete/${dishId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      await res.json();

      if (res.ok) {
        toast.success("Dish and associated orders deleted successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
        navigate(0); // Refresh the page
      }
    } catch (error) {
      toast.error("Failed to delete the dish or associated orders.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const updateDishStock = async (dish, newStock) => {
    const newDish = { ...dish, stock: newStock };
    try {
      const res = await fetch(
        `https://menu-mania.onrender.com/api/menu/update/${newDish._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newDish),
        }
      );

      if (res.ok) {
        toast.success("Stock quantity updated successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        toast.error("Failed to update stock.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("An error occurred while updating the stock.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map((dish, index) => (
          <DishCard
            key={index}
            dish={dish}
            deleteDish={deleteDish}
            updateDishStock={updateDishStock}
          />
        ))}

        {/* Add another dish button */}
        <Card
          className="w-fit cursor-pointer hover:shadow-2xl transition-shadow duration-300 hover:scale-105 bg-gradient-to-r from-teal-300 to-teal-500 dark:from-teal-600 dark:to-teal-800 text-white"
          onClick={handleClickAddNew}
        >
          <div className="p-4 flex flex-col items-center">
            <h5 className="text-xl font-semibold mb-2">Add Another Dish</h5>
            <IoAddCircleSharp className="text-4xl animate-bounce" />
          </div>
        </Card>
      </div>

      <ToastContainer />
    </>
  );
};

// Separate component for each DishCard
const DishCard = ({ dish, deleteDish, updateDishStock }) => {
  const [isReadMore, setIsReadMore] = useState(false);
  const [stock, setStock] = useState(dish.stock);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  const handleStockChange = (e) => {
    const newStock = e.target.value;
    setStock(newStock);
    updateDishStock(dish, newStock); // Update stock
  };

  return (
    <Card className="max-w-[270px] max-h-[420px] shadow-xl transition-transform transform hover:scale-105 rounded-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-2xl">
      <div className="h-40 w-full overflow-hidden rounded-t-lg">
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

        {/* Stock dropdown and delete button in one row */}
        <div className="flex justify-between items-center mt-4">
          <select
            value={stock}
            onChange={handleStockChange}
            className="px-3 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-md focus:ring focus:ring-teal-200 dark:focus:ring-teal-500 transition duration-200"
            style={{
              maxHeight: "140px",
              overflowY: "auto",
              background: stock === 0 ? "red" : "inherit",
            }} // Make dropdown scrollable
          >
            {[...Array(21).keys()].map((num) => (
              <option key={num} value={num}>
                Stock: {num}
              </option>
            ))}
          </select>

          <div
            className="text-red-600 dark:text-red-400 cursor-pointer px-2 py-1 transition-colors duration-200 hover:text-red-800 dark:hover:text-red-600"
            onClick={(e) => deleteDish(e, dish._id)}
          >
            <span className="font-semibold">Delete</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
